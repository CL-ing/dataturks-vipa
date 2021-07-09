/*
 * @Author: Azhou
 * @Date: 2021-06-08 21:29:50
 * @LastEditors: Azhou
 * @LastEditTime: 2021-06-08 21:52:42
 */
import { BASE_URL } from '../helpers/config'
import { getUidToken } from '../helpers/dthelper'
import superagent from 'superagent'

// create project first step: upload base information
export const getReflectImg = data => {
  const { uid, token } = getUidToken()
  const { xPosition, yPosition, width, height, imgUrl } = data
  return new Promise((resolve, reject) => {
    superagent
      .post(BASE_URL + 'getReflectImg')
      .set('uid', uid)
      .set('token', token)
      .send(data)
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
