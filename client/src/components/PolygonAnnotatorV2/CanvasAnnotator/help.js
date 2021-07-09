/*
 * @Author: Azhou
 * @Date: 2021-06-09 14:12:20
 * @LastEditors: Azhou
 * @LastEditTime: 2021-07-04 19:23:09
 */
import React from 'react'
import { getPoint } from '../utils'

export const getZoomFactor = (deltaY, zoomF) => {
  let zoomFactor
  if (deltaY < 0 && !zoomF) {
    zoomFactor = 1.07
  } else if (deltaY > 0 && !zoomF) {
    zoomFactor = 0.93
  } else if (zoomF) {
    zoomFactor = zoomF
  }
  // console.log(`deltaY=${deltaY}\tzoomF=${zoomF}\tzoomFactor${zoomFactor}`)
  return zoomFactor
}

export const getDecPoints = (currentRect, shape, imgSize) => {
  let points = ''
  if (shape === 'polygon') {
    for (let index = 0; index < currentRect.length; index++) {
      points =
        points +
        Math.ceil(currentRect[index][0] * imgSize.imgWidth) +
        ',' +
        Math.ceil(currentRect[index][1] * imgSize.imgHeight) +
        ' '
    }
  } else if (shape === 'rectangle') {
    let x = currentRect[0][0]
    let y = currentRect[0][1]
    let xlg = currentRect[2][0]
    let ylg = currentRect[2][1]
    for (let jindex = 0; jindex < currentRect.length; jindex++) {
      const currentPoint = currentRect[jindex]
      if (x > currentPoint[0]) {
        x = currentPoint[0]
      }
      if (y > currentPoint[1]) {
        y = currentPoint[1]
      }
      if (currentPoint[0] > xlg) {
        xlg = currentPoint[0]
      }
      if (currentPoint[1] > ylg) {
        ylg = currentPoint[1]
      }
    }
    x = x * imgSize.imgWidth
    y = y * imgSize.imgHeight
    xlg = xlg * imgSize.imgWidth
    ylg = ylg * imgSize.imgHeight

    points = x + ',' + ylg + ' ' + xlg + ',' + ylg + ' ' + xlg + ',' + y + ' ' + x + ',' + y
  }

  return points.trim()
}
export const getPoints = currentRect => {
  let points = ''
  for (let index = 0; index < currentRect.length; index++) {
    points = points + currentRect[index][0] + ',' + currentRect[index][1] + ' '
  }
  return points.trim()
}

export const renderRects = (box, fillColor, index, imageProp, imgSize, defaultClass) => {
  const shape = box.shape
  if (shape === 'point') return
  let sw = 1
  let cursor = ''

  if (box.mouseHover) {
    sw = 3
    cursor = 'alias'
  }
  if (defaultClass) {
    cursor = 'crosshair'
  }
  const points = getDecPoints(box.points, shape, imgSize)

  return (
    <polygon
      id={index}
      key={index}
      points={points}
      style={{
        fill: fillColor,
        cursor: cursor,
        fillOpacity: imageProp.opacity,
        stroke: '#1ae04e',
        strokeWidth: sw,
      }}
    />
  )
}

export const renderPoints = (box, fillColor, index, imgSize, dragFlagArr) => {
  const pointArrs = []
  const shape = box.shape
  let sw = 1
  let radius = 0.5

  if (shape === 'point') {
    radius = 5
    sw = 0
  }

  if (box.mouseHover || shape === 'point') {
    if (shape === 'point') {
      radius = 5
    } else {
      radius = 4
    }
    for (let jindex = 0; jindex < box.points.length; jindex++) {
      const id = index + '--' + jindex
      pointArrs.push(
        <circle
          id={id}
          key={id}
          style={{ cursor: dragFlagArr.pointDrag ? 'grabbing' : 'grab' }}
          cx={Math.ceil(box.points[jindex][0] * imgSize.imgWidth)}
          cy={Math.ceil(box.points[jindex][1] * imgSize.imgHeight)}
          r={radius}
          stroke="white"
          strokeWidth={sw}
          fill={fillColor}
        />
      )
    }
  }
  return <g key={`point-${index}`}>{pointArrs}</g>
}

export const renderHalfPoints = (box, index, imageProp, imgSize, dragFlagArr) => {
  const pointArrs = []
  const { points, shape, mouseHover } = box

  if (shape === 'polygon' && !dragFlagArr.pointDrag && !dragFlagArr.rectDrag && mouseHover) {
    let radius = 4
    for (let jindex = 0; jindex < points.length; jindex++) {
      let nextIndex = jindex + 1
      if (jindex === points.length - 1) {
        nextIndex = 0
      }
      const distance = getDistance(points[jindex], points[nextIndex], imgSize, imageProp)
      const id = index + '--' + jindex + '--' + nextIndex
      if (Number(distance.toFixed(2)) >= 30) {
        const x = (points[jindex][0] + points[nextIndex][0]) / 2
        const y = (points[jindex][1] + points[nextIndex][1]) / 2
        pointArrs.push(
          <circle
            style={{ fillOpacity: 0.7, cursor: dragFlagArr.pointDrag ? 'grabbing' : 'grab' }}
            id={id}
            cx={Math.ceil(x * imgSize.imgWidth)}
            cy={Math.ceil(y * imgSize.imgHeight)}
            r={radius}
            stroke="white"
            fill="white"
          />
        )
      }
    }
    return <g key={`half-point-${index}`}>{pointArrs}</g>
  }
}

export const renderCurrentPoints = (entityColorMap, imageProp, currentRect, defaultClass) => {
  const pointArrs = []
  let lineColor = 'lightblue'
  if (defaultClass) {
    lineColor = entityColorMap[defaultClass]
  }
  const sw = 2
  let radius = 0
  const rect = currentRect
  for (let jindex = 0; jindex < rect.length; jindex++) {
    const id = 'x' + '-' + jindex
    if (jindex === 0) radius += 3
    else radius = 0.5
    pointArrs.push(
      <circle
        id={id}
        key={id}
        cx={Math.ceil(rect[jindex][0])}
        cy={Math.ceil(rect[jindex][1])}
        style={{ cursor: jindex === 0 ? 'pointer' : 'crosshair' }}
        r={radius / imageProp.scale}
        stroke="white"
        strokeWidth={sw / imageProp.scale}
        fill={lineColor}
      />
    )
  }

  return <g>{pointArrs}</g>
}

export const getDistance = (point1, point2, imgSize, imageProp) => {
  return (
    Math.sqrt(
      Math.pow(point1[0] * imgSize.imgWidth - point2[0] * imgSize.imgWidth, 2) +
        Math.pow(point1[1] * imgSize.imgHeight - point2[1] * imgSize.imgHeight, 2)
    ) * imageProp.scale
  )
}

const renderCurrentRectangle = (imgSize, entityColorMap, defaultClass, currentRect, imageProp) => {
  let x = imgSize.imgWidth
  let y = imgSize.imgHeight
  let xlg = 0
  let ylg = 0
  const color = entityColorMap[defaultClass]
  for (let index = 0; index < currentRect.length; index++) {
    const currentPoint = currentRect[index]
    if (x > currentPoint[0]) {
      x = currentPoint[0]
    }
    if (y > currentPoint[1]) {
      y = currentPoint[1]
    }
    if (currentPoint[0] > xlg) {
      xlg = currentPoint[0]
    }
    if (currentPoint[1] > ylg) {
      ylg = currentPoint[1]
    }
  }
  let points = x + ',' + ylg + ' ' + xlg + ',' + ylg + ' ' + xlg + ',' + y + ' ' + x + ',' + y

  return (
    <polygon
      points={points}
      style={{
        fill: `${color}`,
        fillOpacity: imageProp.opacity,
        stroke: '#1ae04e',
        strokeWidth: `${2 / imageProp.scale}`,
      }}
    />
  )
}

export const rectToStyles = (
  canvas,
  toolName,
  currentRect,
  entityColorMap,
  defaultClass,
  imageProp,
  imgSize
) => {
  if (!canvas || !currentRect.length) return <div />

  if (toolName === 'polygon' && currentRect.length > 1) {
    return (
      <polyline
        points={getPoints(currentRect)}
        style={{
          fill: `${entityColorMap[defaultClass]}`,
          fillOpacity: imageProp.opacity,
          stroke: '#1ae04e',
          strokeWidth: `${1 / imageProp.scale}`,
        }}
      />
    )
  } else if (toolName === 'rectangle') {
    return renderCurrentRectangle(imgSize, entityColorMap, defaultClass, currentRect, imageProp)
  }
}

export const getBoundingBoxMap = (currentImgInfo, currentHit) => {
  let _boundingBoxMap = []
  let hitBoundingBoxMap = []
  const { imgSize, originImgSize, sliceOffset } = currentImgInfo
  const minX = sliceOffset.x,
    minY = sliceOffset.y,
    maxX = sliceOffset.x + imgSize.imgWidth,
    maxY = sliceOffset.y + imgSize.imgHeight

  // 大图原有的标记信息
  currentHit.hitResults.forEach(hitResult => {
    hitBoundingBoxMap.push(...hitResult.result)
  })
  hitBoundingBoxMap.forEach(box => {
    let _points = box.points
      .map(point => {
        const pointOriginX = point[0] * originImgSize.imgWidth,
          pointOriginY = point[1] * originImgSize.imgHeight
        if (
          pointOriginX >= minX &&
          pointOriginX <= maxX &&
          pointOriginY >= minY &&
          pointOriginY <= maxY
        ) {
          // 点在选中的区域图内则返回
          const newPoint = [
            getPoint((point[0] * originImgSize.imgWidth - sliceOffset.x) / imgSize.imgWidth),
            getPoint((point[1] * originImgSize.imgHeight - sliceOffset.y) / imgSize.imgHeight),
          ]
          return newPoint
        }
      })
      .filter(Boolean)
    // 标记的所有点都在所选图形内
    if (_points.length === box.points.length) {
      _boundingBoxMap.push({
        ...box,
        points: _points,
      })
    }
  })
  return _boundingBoxMap
}
