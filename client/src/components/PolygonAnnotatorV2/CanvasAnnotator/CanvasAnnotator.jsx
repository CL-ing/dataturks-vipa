import React, { useEffect, useMemo, useRef, useState } from 'react'
import Thumbnail from './Thumbnail'
import { mousedown, mousemove, mouseup } from './handleMouseEvent'
import ArrowBtn from './ArrowBtn'
import ControlImageProp from './ControlImageProp'
import styles from './index.module.scss'
import GetLabels from './GetLabels'
import { useDispatch, useSelector } from 'react-redux'
import RenderTagShape from './RenderTagShape'
import { Spin } from 'antd'
import { getOffsets } from '../utils'
import { getZoomFactor } from './help'

const initImageProp = { contrast: 1.0, brightness: 1.0, saturation: 1.0, scale: 1, opacity: 0.4 }
const imgMinSize = 200

const CanvasAnnotator = ({
  hideLabelsMap,
  space,
  fullScreen,
  defaultClass,
  toolName,
  dragFlagArr,
  setDragFlagArr,
}) => {
  let windowHeight = (window.innerHeight * 75) / 100
  let windowWidth = (window.innerWidth * 80) / 100
  if (!space) {
    windowHeight = (window.innerHeight * 70) / 100
    windowWidth = (window.innerWidth * 60) / 100
  }
  if (fullScreen) {
    windowHeight = (window.innerHeight * 95) / 100
  }

  const { currentHit, currentImgInfo, boundingBoxMap } = useSelector(
    // @ts-ignore
    state => state.project
  )
  const dispatch = useDispatch()
  const [currentRect, setCurrentRect] = useState([])
  const [imgSize, setImgSize] = useState({ imgWidth: undefined, imgHeight: undefined })
  const [imgLoad, setImgLoad] = useState(false)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [imageProp, setImageProp] = useState(initImageProp)

  const canvas = useRef(null)

  useEffect(() => {
    dispatch({
      type: 'UPDATE_CURRENT_IMG_INFO',
      payload: {
        ...currentImgInfo,
        imgSize,
        opacity: imageProp.opacity,
      },
    })
  }, [imgSize, imageProp.opacity])

  useEffect(() => {
    // 开始加载图片
    setImgLoad(false)
  }, [currentHit.data])

  useEffect(() => {
    let newBoundingBoxMap = []
    // 切换了另一张图片，更新标记信息
    currentHit.hitResults.forEach(hitResult => {
      if (hitResult.result) newBoundingBoxMap.push(...hitResult.result)
    })
    dispatch({
      type: 'UPDATE_BOUNDING_BOX_MAP',
      payload: newBoundingBoxMap,
    })
    // 更新图片相关信息
    dispatch({
      type: 'UPDATE_CURRENT_IMG_INFO',
      payload: {
        ...currentImgInfo,
        sliceOffset: {
          x: 0,
          y: 0,
        },
        sliceSize: {
          imgWidth: 0,
          imgHeight: 0,
        },
      },
    })
  }, [currentHit.thumbnailImg])

  const updateBoundingBoxMap = _boundingBoxMap => {
    dispatch({
      type: 'UPDATE_BOUNDING_BOX_MAP',
      payload: [...boundingBoxMap, ..._boundingBoxMap],
    })
  }

  const handleZoom = (deltaY, zoomF, sizeObj) => {
    let zoomFactor = getZoomFactor(deltaY, zoomF)

    if (currentRect && currentRect.length > 0) {
      for (let jindex = 0; jindex < currentRect.length; jindex++) {
        currentRect[jindex][0] = currentRect[jindex][0] * zoomFactor
        currentRect[jindex][1] = currentRect[jindex][1] * zoomFactor
      }
    }
    setCurrentRect(currentRect)

    setImgSize({
      imgWidth: sizeObj.imgWidth * zoomFactor,
      imgHeight: sizeObj.imgHeight * zoomFactor,
    })

    return zoomFactor
  }

  const changeImageProp = (name, value) => {
    if (name === 'scale') {
      if (imgSize && (imgSize.imgWidth < imgMinSize || imgSize.imgHeight < imgMinSize) && value < 1)
        return
      handleZoom(0, value, currentImgInfo.originImgSize)
      setTranslate({
        x: (windowWidth - imgSize.imgWidth) / 2,
        y: (windowHeight - imgSize.imgHeight) / 2,
      })
    }
    setImageProp({
      ...imageProp,
      [name]: value,
    })
  }

  const onImgLoad = ({ target: img }) => {
    setImgSize({ imgWidth: img.naturalWidth, imgHeight: img.naturalHeight })
    // 设置图片初始位置
    setTranslate({
      x: (windowWidth - img.naturalWidth) / 2,
      y: (windowHeight - img.naturalHeight) / 2,
    })
    setImgLoad(true)

    if (!currentHit.dataIsThumbnailImg) {
      // 非区域图时设置原图尺寸
      dispatch({
        type: 'UPDATE_CURRENT_IMG_INFO',
        payload: {
          ...currentImgInfo,
          originImgSize: {
            imgWidth: img.naturalWidth,
            imgHeight: img.naturalHeight,
          },
        },
      })
    }
  }

  const showThumbnail = useMemo(() => {
    return space && currentHit.thumbnailImg && currentHit.thumbnailImg.indexOf('/upload') != -1
  }, [currentHit, space])

  const handleMouseDown = _event => {
    mousedown(
      _event.nativeEvent,
      imgSize,
      defaultClass,
      toolName,
      currentRect,
      setCurrentRect,
      boundingBoxMap,
      updateBoundingBoxMap,
      dragFlagArr,
      setDragFlagArr
    )
  }

  const handleMouseMove = _event => {
    mousemove(
      _event.nativeEvent,
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
    )
  }

  const handleMouseUp = _event => {
    mouseup(
      _event.nativeEvent,
      imgSize,
      dragFlagArr,
      boundingBoxMap,
      updateBoundingBoxMap,
      setDragFlagArr
    )
  }

  const handleOnWheel = event => {
    const [offsetX, offsetY] = getOffsets(event.nativeEvent)
    if (event.deltaY) {
      if (
        imgSize &&
        (imgSize.imgWidth < imgMinSize || imgSize.imgHeight < imgMinSize) &&
        event.deltaY > 0
      )
        return
      const zoomFactor = handleZoom(event.deltaY, undefined, imgSize)

      translate.x = translate.x - (offsetX * zoomFactor - offsetX)
      translate.y = translate.y - (offsetY * zoomFactor - offsetY)
      setTranslate(translate)

      // 若当前为从缩略图截取的区域图，则取其宽高
      const { sliceSize, originImgSize } = currentImgInfo
      const imgFormerWidth = sliceSize?.imgWidth > 0 ? sliceSize?.imgWidth : originImgSize.imgWidth

      setImageProp({
        ...imageProp,
        scale: imgSize.imgWidth / imgFormerWidth,
      })
    }
  }

  return (
    <div className={styles.canvasWrap}>
      <ControlImageProp imageProp={imageProp} changeImageProp={changeImageProp} />
      <div
        style={{
          width: windowWidth,
          height: windowHeight,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Spin spinning={!imgLoad}>
          <div style={{ position: 'relative' }}>
            {showThumbnail && <Thumbnail reflectImgDone={() => setImageProp(initImageProp)} />}
            <img
              style={{
                filter: `contrast(${imageProp.contrast})
                        brightness(${imageProp.brightness})
                        saturate(${imageProp.saturation})`,
                transform: `translate3d(${translate.x}px, ${translate.y}px, 0px) scale(1)`,
                width: imgLoad ? imgSize.imgWidth : 'auto',
                height: imgLoad ? imgSize.imgHeight : 'auto',
                display: 'block',
              }}
              draggable="false"
              onLoad={onImgLoad}
              src={currentHit.data}
            />
            {imgLoad && (
              <div id="svg-tag">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  ref={canv => {
                    canvas.current = canv
                  }}
                  style={{
                    zIndex: 2,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: imgSize.imgWidth,
                    height: imgSize.imgHeight,
                    transform: `translate3d(${translate.x}px, ${translate.y}px, 0px) scale(1)`,
                    cursor: defaultClass ? 'crosshair' : 'move',
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={() => {
                    setDragFlagArr({
                      ...dragFlagArr,
                      svgDrag: false,
                    })
                  }}
                  onWheel={handleOnWheel}
                >
                  <RenderTagShape
                    currentRect={currentRect}
                    defaultClass={defaultClass}
                    imageProp={imageProp}
                    imgSize={imgSize}
                    hideLabelsMap={hideLabelsMap}
                    dragFlagArr={dragFlagArr}
                    canvas={canvas.current}
                    toolName={toolName}
                  />
                </svg>
              </div>
            )}
          </div>
        </Spin>
        <ArrowBtn
          pan={(distancex, distancey) =>
            setTranslate({
              x: translate.x + distancex,
              y: translate.y + distancey,
            })
          }
        />
      </div>
      <GetLabels updateBoundingBoxMap={updateBoundingBoxMap} />
    </div>
  )
}

export default CanvasAnnotator
