/*
 * @Author: Azhou
 * @Date: 2021-06-15 11:46:11
 * @LastEditors: Azhou
 * @LastEditTime: 2021-07-04 19:56:34
 */
import {
  DOCUMENT_ANNOTATION,
  HIT_STATE_NOT_DONE,
  POS_TAGGING,
  POS_TAGGING_GENERIC,
} from '@/helpers/Utils'
import useQuery from '@/hooks/useQuery'
import { fetchProjectDetail, fetchProjectHits, updateHitStatus } from '@/request/actions/project'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CreateFullScreen from './CreateFullScreen'
import DoneLeftPanel from './DoneLeftPanel'
import DoneTopBar from './DoneTopBar'
import {
  getCurrentResult,
  getIsHitted,
  getState,
  saveElement,
  saveHitToLocalIMG,
  saveHitToLocalJSON,
} from './help'
import AllDone from './AllDone'
import styles from './TaggerSpace.module.scss'
import { message, Modal, Spin } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const TaggerSpaceNew = () => {
  let { type, label, evaluationType, contributorId } = useQuery()
  const dispatch = useDispatch()
  const docAnnotator = useRef()

  const {
    projectDetails,
    projectHits,
    currentHit,
    currentIndex,
    currentImgInfo,
    boundingBoxMap,
    entityColorMap,
  } = useSelector(
    // @ts-ignore
    state => state.project
  )

  const [parentState, setParentState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [changesInSession, setChangesInSession] = useState(0)
  const [filterValue, setFilterValue] = useState({
    currentStart: 0,
    currentCount: 10,
  })

  const fetchData = async () => {
    if (!type) return

    const currentProjectPid = localStorage.getItem('currentProject')
    if (currentProjectPid) {
      setLoading(true)
      // 获取项目详情
      const detailRes = await fetchProjectDetail(currentProjectPid)
      dispatch({
        type: 'UPDATE_PROJECT_DETAIL',
        payload: detailRes.data,
      })
      // 获取项目标记信息
      const hitsRes = await fetchProjectHits(currentProjectPid, {
        start: filterValue.currentStart,
        count: filterValue.currentCount,
        status: type,
        // @ts-ignore
        label: label ? label.replace(' ', '+') : undefined,
        userId: contributorId,
        evaluationType,
      })
      const { hits = [] } = hitsRes.data
      dispatch({
        type: 'UPDATE_PROJECT_HITS',
        payload: hits,
      })
      dispatch({
        type: 'UPDATE_CURRENT_HITS',
        payload: hits[0],
      })
      if (hits[0] && hits[0].hitResults) {
        let newBoundingBoxMap = []
        hits[0].hitResults.forEach(hitResult => {
          if (hitResult.result) newBoundingBoxMap.push(...hitResult.result)
        })
        dispatch({
          type: 'UPDATE_BOUNDING_BOX_MAP',
          payload: newBoundingBoxMap,
        })
      }

      setLoading(false)
    }
  }

  const isHitted = useMemo(() => getIsHitted(type), [type])

  useEffect(() => {
    setParentState(getState())
    const editor = document.getElementById('write_text')
    if (editor !== null) {
      editor.setAttribute('data-gramm', 'false')
    }
  }, [])

  // 路由的query参数变化时重新获取参数
  useEffect(() => {
    fetchData()
  }, [type, label, evaluationType, contributorId])

  const handleToggle = key => {
    let newState = { ...parentState }
    newState[key] = !newState[key]
    setParentState(newState)
  }

  const handleChangeHitStatus = async action => {
    const result = getCurrentResult(currentImgInfo, boundingBoxMap, currentHit)
    // console.log('result: ', result)
    // console.log('result: ', JSON.parse(result))

    let res
    switch (action) {
      case 'saveHitToLocal':
        // 以json文件格式，保存标注信息并到本地
        saveHitToLocalJSON(currentHit, projectDetails, result)
        res = { err: false }
        break
      case 'saveHitToImg':
        // 以png图片格式，保存标注信息并到本地
        setLoading(true)
        res = await saveHitToLocalIMG(currentHit, currentImgInfo, result, entityColorMap)
        setLoading(false)
        if (res.err) {
          Modal.error({
            title: 'information',
            content: res.msg,
          })
        }
        break
      case 'savePartialHit':
        res = await updateHitStatus(currentHit.id, projectDetails.id, 'notDone', result)
        break
      case 'saveToDone':
        // 保存标注信息并to done
        res = await updateHitStatus(currentHit.id, projectDetails.id, 'done', result)
        break
      case 'skipped':
      case 'deleted':
        res = await updateHitStatus(currentHit.id, projectDetails.id, action)
        break
      case 'reQueued':
        res = await updateHitStatus(currentHit.id, projectDetails.id, 'notDone')
        break
      case 'logResult':
        console.log('boundingBoxMap: ', boundingBoxMap)
        console.log('result: ', result)
        res = { err: false }
        break
    }
    if (res && !res.err) {
      message.success('operate success!')
      if (!['savePartialHit', 'saveHitToLocal', 'saveHitToImg', 'logResult'].includes(action))
        fetchData()
    } else {
      message.error('operate fail!')
    }
  }

  const handleNextRow = action => {
    const changeCurrentHit = () => {
      const step = action === 'next' ? 1 : -1
      // 清除标记信息

      dispatch({
        type: 'UPDATE_CURRENT_HIT_INDEX',
        payload: currentIndex + step,
      })
    }
    // 页面无标记信息，直接切换下一个后返回
    if (changesInSession === 0 || !isHitted) {
      changeCurrentHit()
      return
    }

    // 页面有标记信息
    if (changesInSession > 0 && isHitted) {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: 'You have made some changes in session, will you like to save them ?',
        onOk: async () => {
          // 存储标记信息
          const resultString = getCurrentResult(parentState)
          const res = await updateHitStatus(
            currentHit.id,
            projectDetails.id,
            currentHit.status,
            resultString
          )
          if (res.err) {
            message.error('operation fail')
          } else {
            message.success('operation success')
            changeCurrentHit()
          }
        },
        onCancel() {
          // 不存储标记信息
          changeCurrentHit()
        },
      })
    } else {
      changeCurrentHit()
    }
  }
  if (!parentState) return <div />
  return (
    <Spin spinning={loading}>
      {projectHits?.length == 0 && type === 'notDone' ? (
        <AllDone />
      ) : (
        <div style={{ display: 'flex' }}>
          {type !== 'notDone' && projectDetails.task_type !== POS_TAGGING && (
            <DoneLeftPanel
              changesInSession={changesInSession}
              type={type}
              isHitted={isHitted}
              handleChangeHitStatus={handleChangeHitStatus}
              saveElement={() => saveElement(currentHit, parentState, projectDetails)}
              nextRow={handleNextRow}
            />
          )}
          <div style={{ padding: '0 0.5rem', width: '100%' }}>
            <DoneTopBar
              isHitted={isHitted}
              type={type}
              handleToggle={handleToggle}
              docAnnotator={docAnnotator}
              projectDetails={projectDetails}
              resetFilterState={() => {}}
            />
            <br />
            {type === 'notDone' &&
              (projectDetails.task_type === DOCUMENT_ANNOTATION ||
                projectDetails.task_type === POS_TAGGING_GENERIC) && (
                <p className={styles.pTips}>
                  <li>Click on the document and then drag to select text and select a label.</li>
                  <li>
                    More queries?
                    <a href="https://dataturks.com/help/help.php" target="_blank">
                      See Demo Videos
                    </a>
                  </li>
                </p>
              )}
            {type !== HIT_STATE_NOT_DONE && (
              <div className="text-center">
                {projectHits.length === 0 && <h2> No items to display here </h2>}
              </div>
            )}

            {projectHits && currentHit && (
              <CreateFullScreen
                parentState={{}}
                fullScreenChange={isFullscreenEnabled => {}}
                saveTagAndNextRow={handleNextRow}
                handleChangeHitStatus={handleChangeHitStatus}
              />
            )}
          </div>
        </div>
      )}
    </Spin>
  )
}

export default TaggerSpaceNew
