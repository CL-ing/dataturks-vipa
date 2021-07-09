/*
 * @Author: Azhou
 * @Date: 2021-07-06 09:33:14
 * @LastEditors: Azhou
 * @LastEditTime: 2021-07-06 17:30:54
 */

import { Modal } from 'antd'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import { imgUploadPre } from '@/constants'

// 以zip格式下载标记信息及原图
export const downloadZip = (hitsDetails, entityColorMap) => {
  // 状态为done的标记项
  if (!hitsDetails?.length) {
    Modal.info({
      title: 'Notification',
      content: "There is no completed items, can't download",
    })
    return
  }
  // 存在服务器uploads文件夹中的标记项
  const isUploadHits = hitsDetails.filter(v => v.data.indexOf('/uploads') !== -1)
  if (!isUploadHits?.length) {
    Modal.info({
      title: 'Notification',
      content: "There is no uploaded items, can't download",
    })
    return
  }
  // console.log('isUploadHits: ', isUploadHits)
  // 转换hit result
  const finalDownloadHits = isUploadHits.map(item => {
    const resultString = item.hitResults ? item.hitResults[0]?.result : ''
    const resultArr = JSON.parse(resultString)
    resultArr.forEach(box => (box.fillColor = entityColorMap[box.label[0]]))
    return { ...item, finalHitResults: resultArr }
  })
  // console.log('finalDownloadHits: ', finalDownloadHits)
  handleBatchDownload(finalDownloadHits)
}
const handleBatchDownload = async imgList => {
  const zip = new JSZip()

  const imgsPromise = imgList.map(img => {
    return new Promise((resolve, reject) => {
      const imgObj = new Image()
      imgObj.src = imgUploadPre + img.data
      // 需要图片源允许跨域
      imgObj.crossOrigin = 'anonymous'
      imgObj.onload = () => {
        // 使用canvas获取标记的base64数据
        const canvas = document.createElement('canvas') //准备空画布
        canvas.width = imgObj.naturalWidth
        canvas.height = imgObj.naturalHeight
        const context = canvas.getContext('2d') //取得画布的2d绘图上下文
        // 设置画布背景色为黑色
        context.fillStyle = '#000000'
        context.fillRect(0, 0, canvas.width, canvas.height)
        // 将坐标绘制到canvas中
        drawPointToCtx(img.finalHitResults, context, imgObj.naturalWidth, imgObj.naturalHeight)
        // 需要把得到的base64代码去除掉多余的描述部分
        const taggerContent = canvas
          .toDataURL('image/png', 1)
          .replace(/^data:image\/(png|jpg);base64,/, '')
        const taggerName = img.fileName.split('.')[0] + '.label.png'

        // 使用canvas获取图片的base64数据
        const imgCanvas = document.createElement('canvas') //准备空画布
        imgCanvas.width = imgObj.naturalWidth
        imgCanvas.height = imgObj.naturalHeight
        imgCanvas
          .getContext('2d')
          .drawImage(imgObj, 0, 0, imgObj.naturalWidth, imgObj.naturalHeight)
        const imgContent = imgCanvas.toDataURL().replace(/^data:image\/(png|jpg);base64,/, '')
        const imgName = img.fileName.split('.')[0] + '.image.png'

        // 逐个添加文件
        const labelDir = zip.folder('label')
        labelDir.file(taggerName, taggerContent, { base64: true }) // 1表示质量(无损压缩)
        const imageDir = zip.folder('image')
        imageDir.file(imgName, imgContent, { base64: true })
        resolve('image transform success')
      }
      imgObj.onerror = function () {
        reject('image load error')
      }
    })
  })
  Promise.all(imgsPromise).then(() => {
    zip
      .generateAsync({
        type: 'blob',
      })
      .then(content => {
        // 生成二进制流
        FileSaver.saveAs(content, 'photo.zip') // 利用file-saver保存文件
      })
  })
}
const drawPolygonInCtx = (poly, context) => {
  context.beginPath()
  context.moveTo(poly[0], poly[1])

  for (var i = 2; i < poly.length; i += 2) {
    context.lineTo(poly[i], poly[i + 1])
  }
  context.closePath()
  context.fill()
  context.stroke()
}
const drawPointToCtx = (resultArr, context, imgWidth, imgHeight) => {
  resultArr.forEach(hit => {
    context.fillStyle = hit.fillColor // 内部填充颜色
    context.globalAlpha = 0.4 // 默认透明度0.4
    // 还原点的坐标
    hit.points = hit.points.map(point => [
      Math.ceil(point[0] * imgWidth),
      Math.ceil(point[1] * imgHeight),
    ])

    if (hit.shape !== 'point') {
      // 画矩形和多边形，不要画边框
      // context.strokeStyle = '#1ae04e' // 外边框颜色
      context.lineWidth = 0 // 边框1个像素宽
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
