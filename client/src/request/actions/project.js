/*
 * @Author: Azhou
 * @Date: 2021-05-20 20:35:24
 * @LastEditors: Azhou
 * @LastEditTime: 2021-07-01 19:47:30
 */
import { BASE_URL } from '../helpers/config'
import { getUidToken } from '../helpers/dthelper'
import superagent from 'superagent'
import qs from 'qs'
import { imgUploadPre } from '@/constants'

// create project first step: upload base information
export const uploadDataForm = data => {
  const { uid, token } = getUidToken()

  return new Promise((resolve, reject) => {
    superagent
      .post(BASE_URL + 'createProject')
      .send(data)
      .set('uid', uid)
      .set('token', token)
      .end((err, res) => {
        //   console.log('end err is ', err.response.body)
        if (err)
          resolve({
            err: true,
            data: err.response.body.message,
          })
        else
          resolve({
            err: false,
            data: res.body,
          })
      })
  })
}

export const uploadFileDT = (file, pid, progressCallback, type) => {
  const { uid, token } = getUidToken()
  const data = new FormData()
  data.append('file', file)
  data.append('filename', file.name)
  return new Promise(resolve => {
    if (type) {
      superagent
        .post(BASE_URL + pid + '/upload')
        .set('itemStatus', 'preTagged')
        .set('format', type)
        .set('uid', uid)
        .set('token', token)
        .set('uploadFormat', type)
        .attach('file', file)
        .on('progress', function (event) {
          console.log('Percentage done: ', event.percent)
          progressCallback(event)
        })
        .end((err, res) => {
          if (err)
            resolve({
              err: true,
              data: err.response.body.message,
            })
          else
            resolve({
              err: false,
              data: res.body,
            })
        })
    } else {
      superagent
        .post(BASE_URL + pid + '/upload')
        .set('uid', uid)
        .set('token', token)
        .attach('file', file)
        .on('progress', function (event) {
          console.log('Percentage done: ', event.percent)
          progressCallback(event)
        })
        .end((err, res) => {
          if (err)
            resolve({
              err: true,
              data: err.response.body.message,
            })
          else
            resolve({
              err: false,
              data: res.body,
            })
        })
    }
  })
}

export const deleteProjectDt = pid => {
  const { uid, token } = getUidToken()

  return new Promise(resolve => {
    superagent
      .post(BASE_URL + pid + '/deleteProject')
      .set('uid', uid)
      .set('token', token)
      .end((err, res) => {
        if (err)
          resolve({
            err: true,
            data: err.response.body.message,
          })
        else
          resolve({
            err: false,
            data: res.body,
          })
      })
  })
}

export const fetchProjectDetail = pid => {
  const { uid, token } = getUidToken()
  return new Promise(resolve => {
    superagent
      .post(BASE_URL + pid + '/getProjectDetails')
      .set('uid', uid)
      .set('token', token)
      .end((err, res) => {
        if (err)
          resolve({
            err: true,
            data: err.response.body.message,
          })
        else
          resolve({
            err: false,
            data: res.body,
          })
      })
  })
}
export const fetchProjectHits = (pid, queryData) => {
  const { uid, token } = getUidToken()
  const url = `${BASE_URL}${pid}/getHits?${qs.stringify(queryData)}`
  return new Promise(resolve => {
    superagent
      .post(url)
      .set('uid', uid)
      .set('token', token)
      .end((err, res) => {
        if (err)
          resolve({
            err: true,
            data: err.response.body.message,
          })
        else {
          let _resData = { ...res.body }
          let hits = res.body.hits.map(ele => {
            // 是上传到服务器上的图片，非网络图片，加上地址前缀
            if (ele.data.indexOf('/uploads') !== -1) {
              ele = {
                ...ele,
                data: imgUploadPre + ele.data,
              }
            }
            // 添加一个缩略图字段
            ele.thumbnailImg = ele.data
            ele.dataIsThumbnailImg = false

            // 序列化标记的result
            if (ele.hitResults) {
              ele.hitResults.forEach(hitResult => {
                try {
                  let result = JSON.parse(hitResult.result)
                  hitResult.result = result.map((v, index) => ({
                    ...v,
                    hide: false,
                    mouseHover: false,
                    id: index + 1, // 确保id不会为0
                  }))
                } catch (err) {}
              })
            } else ele.hitResults = []

            return ele
          })
          _resData.hits = hits
          resolve({
            err: false,
            data: _resData,
          })
        }
      })
  })
}

export const updateHitStatus = (hitId, pid, status, result) => {
  const { uid, token } = getUidToken()
  return new Promise(resolve => {
    superagent
      .post(BASE_URL + pid + '/addHitResult?hitId=' + hitId)
      .send({ status, result })
      .set('uid', uid)
      .set('token', token)
      .end((err, res) => {
        if (err)
          resolve({
            err: true,
            data: err.response.body.message,
          })
        else
          resolve({
            err: false,
            data: res.body,
          })
      })
  })
}

export const addHitEvaluation = (hitId, pid, evaluation) => {
  const { uid, token } = getUidToken()
  return new Promise(resolve => {
    superagent
      .post(BASE_URL + pid + '/evaluationResult?hitId=' + hitId)
      .send({ evaluation })
      .set('uid', uid)
      .set('token', token)
      .end((err, res) => {
        if (err)
          resolve({
            err: true,
            data: err.response.body.message,
          })
        else
          resolve({
            err: false,
            data: res.body,
          })
      })
  })
}
