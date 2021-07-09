import { HIT_STATE_DONE, HIT_STATE_SL, HIT_STATE_AL } from '@/helpers/Utils'
import { updateHitStatus } from '@/request/actions/project'
import { getPoint } from '@/components/PolygonAnnotatorV2/utils'
import FileSaver from 'file-saver'

export const getContributorDetailsMap = contributorDetails => {
  if (!contributorDetails) return {}
  let contributorDetailsMap = {}

  for (let index = 0; index < contributorDetails.length; index++) {
    contributorDetailsMap[contributorDetails[index].userDetails.uid] =
      contributorDetails[index].userDetails
  }
  return contributorDetailsMap
}

export const getCurrentResult = (currentImgInfo, boundingBoxMap, currentHit) => {
  const { imgSize, sliceOffset, sliceSize, originImgSize } = currentImgInfo
  let resultString = ''

  // 若当前为从缩略图截取的区域图，则取其宽高
  const imgFormerWidth = sliceSize?.imgWidth > 0 ? sliceSize?.imgWidth : originImgSize.imgWidth
  // console.log('current imgSize: ', imgSize)
  // console.log('current originImgSize: ', originImgSize)
  const scale = imgSize.imgWidth / imgFormerWidth
  // 当前的标记数组
  let _boundingBoxMap = [...boundingBoxMap].map(box => {
    let _points = box.points.map(point => [
      getPoint(((point[0] * imgSize.imgWidth) / scale + sliceOffset.x) / originImgSize.imgWidth),
      getPoint(((point[1] * imgSize.imgHeight) / scale + sliceOffset.y) / originImgSize.imgHeight),
    ])
    box.points = _points
    return box
  })
  // 原有的标记数组
  let originBoundingBoxMap = []
  currentHit.hitResults.forEach(hitResult => {
    if (hitResult.result) originBoundingBoxMap.push(...hitResult.result)
  })

  if (_boundingBoxMap.length) {
    // 将两个数组进行合并
    _boundingBoxMap.forEach(newBox => {
      if (newBox.id) {
        // 对原有的标记信息更改
        const index = originBoundingBoxMap.findIndex(item => item.id === newBox.id)
        originBoundingBoxMap[index] = newBox
      } else {
        // 新增加的标记信息
        originBoundingBoxMap.push(newBox)
      }
    })
    resultString = JSON.stringify(originBoundingBoxMap)
  } else if (originBoundingBoxMap.length) resultString = JSON.stringify(originBoundingBoxMap)
  return resultString
}

export const validPoints = points => {
  for (let index = 0; index < points.length; index++) {
    if (
      points[index][0] > 1.0 ||
      points[index][1] > 1.0 ||
      points[index][0] < 0.0 ||
      points[index][1] < 0.0
    )
      return false
  }
  return true
}

// 把标注的信息保存在JSON文件
export const saveHitToLocalJSON = (currentHit, projectDetails, result) => {
  var nativeResult = {
    content: currentHit.data,
    annotation: JSON.parse(result), // 注意 result 是字符串，需要转对象，不然有转义问题（debug两个小时的血泪史）
    extras: currentHit.extras,
    metadata: {
      first_done_at: null,
      last_updated_at: null,
      sec_taken: null,
      last_updated_by: null,
      status: currentHit.status,
      evaluation: null,
    },
  }
  // 转字符串并保存
  const blob = new Blob([JSON.stringify(nativeResult)], { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blob, projectDetails.name + '.json')
}

const drawPolygonInCtx = (poly, context) => {
  context.beginPath()
  context.moveTo(poly[0], poly[1])

  for (var i = 2; i < poly.length; i += 2) {
    context.lineTo(poly[i], poly[i + 1])
    // console.log(poly[i], poly[i + 1])
  }
  context.closePath()
  context.fill()
  context.stroke()
}
const drawPointToCtx = (result, context, entityColorMap, currentImgInfo) => {
  const resultArr = JSON.parse(result)
  const {
    originImgSize: { imgWidth, imgHeight },
  } = currentImgInfo
  resultArr.forEach(hit => {
    context.fillStyle = entityColorMap[hit.label[0]] // 内部填充颜色
    context.globalAlpha = currentImgInfo.opacity
    // 还原点的坐标
    hit.points = hit.points.map(point => [
      Math.ceil(point[0] * imgWidth),
      Math.ceil(point[1] * imgHeight),
    ])

    // console.log('还原后的points：', hit.points)
    if (hit.shape !== 'point') {
      // 画矩形和多边形
      context.strokeStyle = '#1ae04e' // 外边框颜色
      context.lineWidth = 1 // 边框1个像素宽
      let poly = []
      hit.points.forEach(point => {
        poly.push(point[0])
        poly.push(point[1])
      })
      drawPolygonInCtx(poly, context)
    } else {
      // 画点
      const x = hit.points[0][0],
        y = hit.points[0][1]
      context.beginPath()
      context.arc(x, y, 5, 0, Math.PI * 2, true)
      context.closePath()
      context.fill()
    }
  })
}

// 把标注信息画到图片中并保存到本地
export const saveHitToLocalIMG = (currentHit, currentImgInfo, result, entityColorMap) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas') //准备空画布
    const {
      originImgSize: { imgWidth, imgHeight },
    } = currentImgInfo
    canvas.width = imgWidth
    canvas.height = imgHeight
    const context = canvas.getContext('2d') //取得画布的2d绘图上下文

    const imgObj = new Image()
    imgObj.src = currentHit.data
    // 需要图片源允许跨域
    imgObj.crossOrigin = 'anonymous'
    imgObj.onload = function () {
      context.drawImage(imgObj, 0, 0, imgWidth, imgHeight)
      // todo: 转换坐标并绘制到canvas中

      drawPointToCtx(result, context, entityColorMap, currentImgInfo)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png') //将画布内的信息导出为png图片数据
      a.download = 'tagger-img' //设定下载名称
      a.click() //点击触发下载
      resolve({
        err: false,
        msg: '',
      })
    }
    imgObj.onerror = function () {
      resolve({
        err: true,
        msg: "The image load error, maybe the reason is this image isn't saved in our service, can't produce local image",
      })
    }
  })
}

export const saveElement = async (currentHit, parentState, projectDetails, docAnnotator) => {
  const { changesInSession, classification, classificationResponse } = parentState
  let result = ''
  if (changesInSession > 0) {
    if (docAnnotator) {
      docAnnotator.saveCategory(true)
    }
    result = getCurrentResult(parentState)
  } else if (currentHit.hitResults?.length) {
    result = currentHit.hitResults[0].result
  }
  if (classification?.length && Object.keys(classificationResponse).length === 0) {
    alert('Please choose at least one classification')
    return false
  }

  const res = await updateHitStatus(currentHit.id, projectDetails.id, currentHit.status, result)
  if (!res.err) {
    // todo: saveElementCallback
  }
}

/**
 * @Description: 是否已经标注过,新增HIT_STATE_SL,HIT_STATE_AL
 * @date 2020/2/27
 */
export const getIsHitted = type => {
  return type === HIT_STATE_DONE || type === HIT_STATE_SL || type === HIT_STATE_AL
}

export const getState = () => {
  return {
    tagLine: '',
    clickedColor: {},
    taggedEntity: {},
    words: [],
    selectIds: [],
    shortcuts: {},
    rules: {},
    currentIndex: 0,
    changesInSession: 0,
    loading: false,
    startTime: new Date().getTime(),
    currentTags: new Set(),
    autoClose: true,
    notes: false,
    autoLabel: true,
    newEntities: [],
  }
}
