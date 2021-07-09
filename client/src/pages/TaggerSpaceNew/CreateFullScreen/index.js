/*
 * @Author: Azhou
 * @Date: 2021-05-31 19:22:14
 * @LastEditors: Azhou
 * @LastEditTime: 2021-06-01 15:11:28
 */
import React, { useMemo } from 'react'
import { showExtra } from './utils'
import Fullscreen from 'react-fullscreen-crossbrowser'
import { useSelector } from 'react-redux'
import PolygonAnnotatorV2 from '@/components/PolygonAnnotatorV2/PolygonAnnotator'

const CreateFullScreen = ({
  parentState,
  fullScreenChange,
  saveTagAndNextRow,
  handleChangeHitStatus,
}) => {
  // @ts-ignore
  const { currentHit } = useSelector(state => state.project)
  const extra = useMemo(() => {
    let extra = ''
    if (currentHit) {
      extra = JSON.parse(currentHit.extras)
    }
    return extra
  }, [currentHit])

  return (
    <div>
      {extra && <div>{showExtra(extra)}</div>}
      <Fullscreen enabled={parentState.fullScreen} onChange={fullScreenChange}>
        <PolygonAnnotatorV2
          fullScreen={parentState.isFullscreenEnabled}
          saveTagAndNextRow={() => saveTagAndNextRow('next')}
          saveRow={handleChangeHitStatus}
          skipRow={() => handleChangeHitStatus('skipped')}
          getBackTopreviousRow={() => saveTagAndNextRow('previous')}
        />
      </Fullscreen>
    </div>
  )
}

export default CreateFullScreen
