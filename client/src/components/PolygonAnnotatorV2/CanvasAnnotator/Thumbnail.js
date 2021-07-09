/*
 * @Author: Azhou
 * @Date: 2021-06-01 20:31:36
 * @LastEditors: Azhou
<<<<<<< HEAD
 * @LastEditTime: 2021-07-04 20:10:19
=======
 * @LastEditTime: 2021-07-06 21:01:46
>>>>>>> tmp
 */
import React, { useEffect, useState } from 'react'
import { Slider } from 'antd'
import styles from '../index.module.scss'
import { getReflectImg } from '@/request/actions/tagger'
import { useDispatch, useSelector } from 'react-redux'
import { getBoundingBoxMap } from './help'

const MASKUNITWIDTH = 20, // mask基本长度，单位px
  SMALLIMAGEWIDTH = 200, // 缩略图大小：200*200，单位px
  BIGBOXWTDTH = 400 // 预览区大小：400*400，单位px

const Thumbnail = ({ reflectImgDone }) => {
  const dispatch = useDispatch()
  const { currentHit, currentImgInfo } = useSelector(
    // @ts-ignore
    state => state.project
  )
  const [display, setDisplay] = useState('none')
  const [maskRate, setMaskRate] = useState(4)
  const [maskLeftTopCoo, setMaskLeftTopCoo] = useState({
    cooX: 0,
    cooY: 0,
  })
  useEffect(() => {
    var smallBox = document.getElementById('smallBox')
    var smallImg = document.getElementById('smallImg')
    var bigImg = document.getElementById('bigImg')
    var bigBox = document.getElementById('bigBox')
    var mask = document.getElementById('mask')
    smallBox.onmousemove = function (_event) {
      // 拿到缩略图所在div相对于浏览器窗口（viewport）左上角的距离
      const smallBoxX = smallImg.getBoundingClientRect().left
      const smallBoxY = smallImg.getBoundingClientRect().top

      var event = _event || window.event
      // event.pageX || event.clientX拿到的是鼠标相对于屏幕左上角的位置
      // @ts-ignore
      const mouseX = event.pageX
      // @ts-ignore
      const mouseY = event.pageY
      // 最终想要的boxX与boxY是鼠标相对于容器左上角的坐标
      const boxX = mouseX - smallBoxX
      const boxY = mouseY - smallBoxY

      //为了能以中心点移动，向左挪动遮罩层宽度的一半
      var targetX = boxX - mask.offsetWidth / 2
      var targetY = boxY - mask.offsetHeight / 2

      // 边界保护
      if (targetX < 0) {
        targetX = 0
      }
      if (targetX > smallImg.offsetWidth - mask.offsetWidth) {
        targetX = smallImg.offsetWidth - mask.offsetWidth
      }
      if (targetY < 0) {
        targetY = 0
      }
      if (targetY > smallImg.offsetHeight - mask.offsetHeight) {
        targetY = smallImg.offsetHeight - mask.offsetHeight
      }

      setMaskLeftTopCoo({
        cooX: targetX,
        cooY: targetY,
      })
      mask.style.left = targetX + 'px'
      mask.style.top = targetY + 'px'

      // 按比例显示右侧图片
      // 计算放大比例
      const rate = bigBox.offsetWidth / mask.offsetWidth
      // 通过设置图片的绝对位置将选中区域放大显示
      var bigtargetX = -rate * targetX
      var bigtargetY = -rate * targetY
      bigImg.style.left = bigtargetX + 'px'
      bigImg.style.top = bigtargetY + 'px'

      // 等比例放大图片
      bigImg.style.width = smallImg.offsetWidth * rate + 'px'
      bigImg.style.height = smallImg.offsetWidth * rate + 'px'
    }
  }, [])

  const sendCoordinates = () => {
    const image = document.createElement('img')
    image.src = currentHit.thumbnailImg
    image.onload = async () => {
      // 获取图片的原始宽度
      // @ts-ignore
      const naturalWidth = image.naturalWidth
      // @ts-ignore
      const naturalHeight = image.naturalHeight
      // console.log('naturalWidth:', naturalWidth)
      const ratio = (MASKUNITWIDTH * maskRate) / SMALLIMAGEWIDTH
      let imgSrc = currentHit.thumbnailImg
      if (imgSrc.indexOf('/uploads') !== -1) {
        imgSrc = '/uploads' + imgSrc.split('/uploads')[1]
      }
      // 计算缩略图大小与原图大小的比例
      const cooXRatio = naturalWidth / SMALLIMAGEWIDTH
      const cooYRatio = naturalHeight / SMALLIMAGEWIDTH
      const width = naturalWidth * ratio
      const height = naturalHeight * ratio
      const data = {
        xPosition: maskLeftTopCoo.cooX * cooXRatio,
        yPosition: maskLeftTopCoo.cooY * cooYRatio,
        width,
        height,
        imgUrl: imgSrc,
      }
      const res = await getReflectImg(data)
      if (!res.err) {
        dispatch({
          type: 'UPDATE_CURRENT_HITS',
          payload: {
            ...currentHit,
            data: `data:image/jpg;base64,${res.data.imgStr}`,
            dataIsThumbnailImg: true,
          },
        })
        const currentImgInfo = {
          originImgSize: {
            imgWidth: naturalWidth,
            imgHeight: naturalHeight,
          },
          sliceOffset: {
            x: data.xPosition,
            y: data.yPosition,
          },
          sliceSize: {
            imgWidth: width,
            imgHeight: height,
          },
          imgSize: {
            imgWidth: width,
            imgHeight: height,
          },
        }
        // 左上角的【偏移量
        dispatch({
          type: 'UPDATE_CURRENT_IMG_INFO',
          payload: currentImgInfo,
        })
        const newBoundingBoxMap = getBoundingBoxMap(currentImgInfo, currentHit)
        dispatch({
          type: 'UPDATE_BOUNDING_BOX_MAP',
          payload: newBoundingBoxMap,
        })
        reflectImgDone()
      }
    }
  }

  return (
    <div className={styles.thumbnailWrap} style={{ width: `${SMALLIMAGEWIDTH}px` }}>
      <div
        id="smallBox"
        className={styles.smallBox}
        onMouseOver={() => setDisplay('block')}
        onMouseOut={() => setDisplay('none')}
        onClick={sendCoordinates}
      >
        <img
          src={currentHit.thumbnailImg}
          id="smallImg"
          style={{ width: `${SMALLIMAGEWIDTH}px`, height: `${SMALLIMAGEWIDTH}px` }}
        />
        <span
          id="mask"
          className={styles.mask}
          style={{
            display,
            width: `${MASKUNITWIDTH * maskRate}px`,
            height: `${MASKUNITWIDTH * maskRate}px`,
          }}
        ></span>
      </div>
      <div style={{ padding: '0 8px' }}>{`the mask's width is ${MASKUNITWIDTH * maskRate}px`}</div>
      <Slider
        min={1}
        max={10}
        value={maskRate}
        style={{
          width: `${SMALLIMAGEWIDTH - 20}px`,
          margin: '10px auto',
        }}
        onChange={setMaskRate}
      />
      <div
        id="bigBox"
        className={styles.bigBox}
        style={{
          display,
          width: `${BIGBOXWTDTH}px`,
          height: `${BIGBOXWTDTH}px`,
          left: `${SMALLIMAGEWIDTH}px`,
        }}
      >
        <img src={currentHit.thumbnailImg} id="bigImg" />
      </div>
    </div>
  )
}

export default Thumbnail
