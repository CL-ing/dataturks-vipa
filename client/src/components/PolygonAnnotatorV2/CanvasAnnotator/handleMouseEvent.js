/*
 * @Author: Azhou
 * @Date: 2021-06-09 22:27:00
 * @LastEditors: Azhou
 * @LastEditTime: 2021-07-01 23:55:12
 */

import { getOffsets, getPoint } from '../utils'

export const paintBegin = (
  toolName,
  event,
  defaultClass,
  imgSize,
  currentRect,
  setCurrentRect,
  updateBoundingBoxMap
) => {
  const { nodeName, id } = event.target
  const [offsetX, offsetY] = getOffsets(event)
  switch (toolName) {
    case 'polygon':
      if (nodeName === 'circle' && id.length === 3 && id[0] === 'x' && id[2] === '0') {
        // 点击了circle节点，即结束绘制polygon
        updateBoundingBoxMap([
          {
            points: currentRect.map(point => [
              getPoint(point[0] / imgSize.imgWidth),
              getPoint(point[1] / imgSize.imgHeight),
            ]),
            label: [defaultClass],
            shape: 'polygon',
            notes: '',
            hide: false,
            mouseHover: false,
          },
        ])
        setCurrentRect([])
      } else {
        // 将当前绘制点存储到currentRect中
        currentRect.push([offsetX, offsetY])
        setCurrentRect([...currentRect])
      }
      break
    case 'point':
      // 绘制了一个point
      updateBoundingBoxMap([
        {
          points: [[getPoint(offsetX / imgSize.imgWidth), getPoint(offsetY / imgSize.imgHeight)]],
          label: [defaultClass],
          shape: 'point',
          notes: '',
          hide: false,
          mouseHover: false,
        },
      ])
      break
    case 'rectangle':
      if (currentRect.length === 0) {
        // 存储左上角顶点位置
        currentRect.push([offsetX, offsetY])
        setCurrentRect(currentRect)
      } else {
        let currentRectangle = currentRect
        // rectangle绘制结束
        // console.log('mouse down and currentRectangle is : ', [...currentRectangle])
        // currentRectangle[0]: 左上角的点
        const currentPoint = currentRectangle[0]
        // currentRectangle[3]: 右下角的点
        const nextPoint = currentRectangle[2]
        currentRectangle = []
        currentRectangle.push([
          getPoint(currentPoint[0] / imgSize.imgWidth),
          getPoint(currentPoint[1] / imgSize.imgHeight),
        ])
        currentRectangle.push([
          getPoint(nextPoint[0] / imgSize.imgWidth),
          getPoint(currentPoint[1] / imgSize.imgHeight),
        ])
        currentRectangle.push([
          getPoint(nextPoint[0] / imgSize.imgWidth),
          getPoint(nextPoint[1] / imgSize.imgHeight),
        ])
        currentRectangle.push([
          getPoint(currentPoint[0] / imgSize.imgWidth),
          getPoint(nextPoint[1] / imgSize.imgHeight),
        ])

        // 绘制了一个rectangle
        updateBoundingBoxMap([
          {
            points: currentRectangle,
            label: [defaultClass],
            shape: 'rectangle',
            notes: '',
            hide: false,
            mouseHover: true,
          },
        ])
        setCurrentRect([])
      }
      break
  }
}

export const mousedown = (
  event,
  imgSize,
  defaultClass,
  toolName,
  currentRect,
  setCurrentRect,
  boundingBoxMap,
  updateBoundingBoxMap,
  dragFlagArr,
  setDragFlagArr
) => {
  event.preventDefault()
  const { nodeName, id } = event.target
  const [offsetX, offsetY] = getOffsets(event)
  if (defaultClass) {
    paintBegin(
      toolName,
      event,
      defaultClass,
      imgSize,
      currentRect,
      setCurrentRect,
      updateBoundingBoxMap
    )
  } else if (nodeName === 'svg') {
    // move svg
    setDragFlagArr({
      ...dragFlagArr,
      dragPoint: [event.pageX, event.pageY],
      svgDrag: true,
    })
  } else if (nodeName === 'polygon' || nodeName === 'rect') {
    // highlight tagger
    const isFocus = boundingBoxMap[id].mouseHover
    if (isFocus) {
      setDragFlagArr({
        ...dragFlagArr,
        rectDrag: true,
        dragRect: id,
        dragPoint: [offsetX, offsetY],
      })
    } else {
      boundingBoxMap[id].mouseHover = true
      updateBoundingBoxMap([])
    }
  } else if (nodeName === 'circle') {
    // click circle
    const splits = id.split('--')
    if (splits.length === 2) {
      const rectIndex = parseInt(splits[0], 10)
      const rectShape = boundingBoxMap[rectIndex].shape
      if (rectShape === 'point') {
        boundingBoxMap[rectIndex].mouseHover = !boundingBoxMap[rectIndex].mouseHover
        updateBoundingBoxMap([])
      }
      setDragFlagArr({
        ...dragFlagArr,
        pointDrag: true,
        dragRect: rectIndex,
        dragPoint: parseInt(splits[1], 10),
      })
    } else if (splits.length === 3) {
      const rect = boundingBoxMap[parseInt(splits[0], 10)].points
      const firstIndex = parseInt(splits[1], 10)
      const nextIndex = parseInt(splits[2], 10)
      const middleX = (rect[firstIndex][0] + rect[nextIndex][0]) / 2
      const middleY = (rect[firstIndex][1] + rect[nextIndex][1]) / 2
      rect.splice(firstIndex + 1, 0, [middleX, middleY])
      boundingBoxMap[parseInt(splits[0], 10)].points = rect
      updateBoundingBoxMap([])
      setDragFlagArr({
        ...dragFlagArr,
        pointDrag: true,
        dragRect: parseInt(splits[0], 10),
        dragPoint: parseInt(splits[1], 10) + 1,
      })
    }
  }
  return false
}

export const mousemove = (
  event,
  imgSize,
  translate,
  setTranslate,
  toolName,
  boundingBoxMap,
  updateBoundingBoxMap,
  currentRect,
  setCurrentRect,
  dragFlagArr,
  setDragFlagArr
) => {
  event.preventDefault()
  const { pointDrag, rectDrag, svgDrag, dragPoint, dragRect } = dragFlagArr
  const [offsetX, offsetY] = getOffsets(event)
  if (pointDrag) {
    const _currentRect = boundingBoxMap[dragRect].points
    const shape = boundingBoxMap[dragRect].shape

    const newx = getPoint(offsetX / imgSize.imgWidth)
    const newy = getPoint(offsetY / imgSize.imgHeight)
    let oldx = _currentRect[dragPoint][0]
    let oldy = _currentRect[dragPoint][1]
    _currentRect[dragPoint][0] = newx
    _currentRect[dragPoint][1] = newy

    if (shape === 'rectangle') {
      for (let jindex = 0; jindex < _currentRect.length; jindex++) {
        if (_currentRect[jindex][0] === oldx) {
          _currentRect[jindex][0] = newx
        }
        if (_currentRect[jindex][1] === oldy) {
          _currentRect[jindex][1] = newy
        }
      }
    }
    boundingBoxMap[dragRect].points = _currentRect
    updateBoundingBoxMap([])
  } else if (rectDrag && dragRect) {
    const dx = (offsetX - dragPoint[0]) / imgSize.imgWidth
    const dy = (offsetY - dragPoint[1]) / imgSize.imgHeight
    const _currentRect = boundingBoxMap[dragRect].points
    for (let jindex = 0; jindex < _currentRect.length; jindex++) {
      _currentRect[jindex][0] = _currentRect[jindex][0] + dx
      _currentRect[jindex][1] = _currentRect[jindex][1] + dy
    }
    boundingBoxMap[dragRect].points = _currentRect
    updateBoundingBoxMap([])
    setDragFlagArr({
      ...dragFlagArr,
      dragging: true,
      dragPoint: [offsetX, offsetY],
    })
  } else if (
    toolName === 'rectangle' &&
    currentRect.length > 0 &&
    event.target.nodeName !== 'circle'
  ) {
    let currentRectangle = currentRect
    const currentPoint = currentRectangle[0]
    currentRectangle = []
    currentRectangle.push([currentPoint[0], currentPoint[1]])
    currentRectangle.push([offsetX, currentPoint[1]])
    currentRectangle.push([offsetX, offsetY])
    currentRectangle.push([currentPoint[0], offsetY])

    setCurrentRect(currentRectangle)
  } else if (svgDrag) {
    setTranslate({
      x: translate.x + event.movementX,
      y: translate.y + event.movementY,
    })
  }
  return false
}

export const mouseup = (
  event,
  imgSize,
  dragFlagArr,
  boundingBoxMap,
  updateBoundingBoxMap,
  setDragFlagArr
) => {
  event.preventDefault()
  const [offsetX, offsetY] = getOffsets(event)
  const { pointDrag, rectDrag, svgDrag, dragPoint, dragRect, dragging } = dragFlagArr
  if (pointDrag) {
    const currentRect = boundingBoxMap[dragRect].points
    const shape = boundingBoxMap[dragRect].shape
    const newx = getPoint(offsetX / imgSize.imgWidth)
    const newy = getPoint(offsetY / imgSize.imgHeight)
    currentRect[dragPoint][0] = newx
    currentRect[dragPoint][1] = newy
    if (shape === 'rectangle') {
      let oldx = currentRect[dragPoint][0]
      let oldy = currentRect[dragPoint][1]
      for (let jindex = 0; jindex < currentRect.length; jindex++) {
        if (currentRect[jindex][0] === oldx) {
          currentRect[jindex][0] = newx
        }
        if (currentRect[jindex][1] === oldy) {
          currentRect[jindex][1] = newy
        }
      }
    }
    boundingBoxMap[dragRect].points = currentRect
    updateBoundingBoxMap([])
    setDragFlagArr({
      ...dragFlagArr,
      pointDrag: false,
    })
  } else if (rectDrag) {
    if (dragging) {
      const dx = (offsetX - dragPoint[0]) / imgSize.imgWidth
      const dy = (offsetY - dragPoint[1]) / imgSize.imgHeight
      const currentRect = boundingBoxMap[dragRect].points
      for (let jindex = 0; jindex < currentRect.length; jindex++) {
        currentRect[jindex][0] = currentRect[jindex][0] + dx
        currentRect[jindex][1] = currentRect[jindex][1] + dy
      }
      boundingBoxMap[dragRect].points = currentRect
      updateBoundingBoxMap([])
      setDragFlagArr({
        ...dragFlagArr,
        dragging: false,
        rectDrag: false,
        dragPoint: undefined,
        dragRect: undefined,
      })
    } else {
      boundingBoxMap[event.target.id].mouseHover = !boundingBoxMap[event.target.id].mouseHover
      updateBoundingBoxMap([])
      setDragFlagArr({
        ...dragFlagArr,
        dragging: false,
        rectDrag: false,
        dragRect: undefined,
      })
    }
  } else if (svgDrag) {
    setDragFlagArr({
      ...dragFlagArr,
      svgDrag: false,
    })
  }
}
