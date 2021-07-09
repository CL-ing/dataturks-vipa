/*
 * @Author: Azhou
 * @Date: 2021-06-23 10:00:41
 * @LastEditors: Azhou
 * @LastEditTime: 2021-06-24 14:10:38
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  rectToStyles,
  renderCurrentPoints,
  renderHalfPoints,
  renderPoints,
  renderRects,
} from './help'

const RenderTagShape = ({
  currentRect,
  defaultClass,
  imageProp,
  imgSize,
  hideLabelsMap,
  dragFlagArr,
  canvas,
  toolName,
}) => {
  const { boundingBoxMap, entityColorMap } = useSelector(
    // @ts-ignore
    state => state.project
  )

  useEffect(() => {
    // console.log('boundingBoxMap: ', boundingBoxMap)
  }, [boundingBoxMap])

  return (
    <>
      {boundingBoxMap.map((box, index) => {
        let hide = false
        box.label.forEach(label => {
          if (hideLabelsMap[label]) hide = true
        })
        if (hide || box.hide) return <div key={index} />

        const fillColor = entityColorMap[box.label[0]]

        return (
          <>
            {renderRects(box, fillColor, index, imageProp, imgSize, defaultClass)}
            {renderPoints(box, fillColor, index, imgSize, dragFlagArr)}
            {renderHalfPoints(box, index, imageProp, imgSize, dragFlagArr)}
          </>
        )
      })}
      {currentRect.length && (
        <>
          {rectToStyles(
            canvas,
            toolName,
            currentRect,
            entityColorMap,
            defaultClass,
            imageProp,
            imgSize
          )}
          {toolName === 'polygon' &&
            renderCurrentPoints(entityColorMap, imageProp, currentRect, defaultClass)}
        </>
      )}
    </>
  )
}

export default RenderTagShape
