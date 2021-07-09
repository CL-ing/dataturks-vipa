/*
 * @Author: Azhou
 * @Date: 2021-06-21 11:29:47
 * @LastEditors: Azhou
 * @LastEditTime: 2021-07-08 16:24:24
 */
import React, { useMemo, useState } from 'react'
import styles from './index.module.scss'

import CanvasAnnotator from './CanvasAnnotator/CanvasAnnotator'
import { useDispatch, useSelector } from 'react-redux'
import RightBar from './RightBar'
import useQuery from '@/hooks/useQuery'
import { HIT_STATE_NOT_DONE } from '@/helpers/Utils'
import { Spin } from 'antd'

const PolygonAnnotatorV2 = ({
  fullScreen,
  getBackTopreviousRow,
  skipRow,
  saveTagAndNextRow,
  saveRow,
}) => {
  let { status } = useQuery()

  // @ts-ignore
  const { boundingBoxMap, currentHit } = useSelector(state => state.project)
  const dispatch = useDispatch()

  const [hideLabelsMap, setHideLabelsMap] = useState({})
  const [toolName, setToolName] = useState('')
  const [defaultClass, setDefaultClass] = useState('')
  const [loading, setLoading] = useState(false)

  const [dragFlagArr, setDragFlagArr] = useState({
    pointDrag: false,
    rectDrag: false,
    svgDrag: false,
    dragPoint: undefined,
    dragRect: undefined,
    dragging: false,
  })

  const space = useMemo(() => status === HIT_STATE_NOT_DONE, [status])

  const clearPolygons = () => {
    if (window.confirm('Are you sure you wish to clear all tagged items?')) {
      if (boundingBoxMap.length > 0) {
        dispatch({
          type: 'UPDATE_BOUNDING_BOX_MAP',
          payload: [],
        })
        currentHit.hitResults[0].result = ''
        dispatch({
          type: 'UPDATE_CURRENT_HITS',
          payload: { ...currentHit },
        })
      }
    }
  }

  return (
    <Spin spinning={loading}>
      <div className={styles.container}>
        <CanvasAnnotator
          toolName={toolName}
          defaultClass={defaultClass}
          dragFlagArr={dragFlagArr}
          hideLabelsMap={hideLabelsMap}
          space={space}
          fullScreen={fullScreen}
          setDragFlagArr={setDragFlagArr}
        />
        <RightBar
          space={space}
          toolName={toolName}
          setToolName={setToolName}
          defaultClass={defaultClass}
          setDefaultClass={setDefaultClass}
          clearPolygons={clearPolygons}
          hideLabelsMap={hideLabelsMap}
          toggleEyeStatus={key => {
            hideLabelsMap[key] = !hideLabelsMap[key]
            setHideLabelsMap({ ...hideLabelsMap })
          }}
          getBackTopreviousRow={getBackTopreviousRow}
          skipRow={skipRow}
          saveRow={saveRow}
          saveTagAndNextRow={saveTagAndNextRow}
        />
      </div>
    </Spin>
  )
}

export default PolygonAnnotatorV2
