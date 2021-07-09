/*
 * @Author: Azhou
 * @Date: 2021-05-12 15:02:24
 * @LastEditors: 徐文祥
 * @LastEditTime: 2021-05-14 19:32:29
 */
import { BASE_URL } from "../helpers/config";
import { getUidToken } from "../helpers/dthelper";
import superagent from 'superagent'

// 用户注册
export const createUserWithPassword = (fname, lname, email, password) => {
  console.log("createUserWithPassword ", BASE_URL, window.location);
  const { uid, token } = getUidToken();

    return new Promise((resolve, reject) => {
        try {
            superagent
                .post(BASE_URL + "createUserWithPassword")
                .send({ firstName: fname, secondName: lname, email, authType: 'emailSignUp' })
                .set("uid", uid)
                .set("token", token)
                .set("password", password)
                .end((err, res) => {
                    if (err) reject(err)
                    else resolve(res.body)
                });
        } catch (err) {
            reject(err)
        }
    })
};

// 用户登录
export const dtLogin = (email, password) => {
  const { uid, token } = getUidToken();

    return new Promise((resolve, reject) => {
        try {
            superagent
                .post(BASE_URL + "login")
                .set("uid", uid)
                .set("token", token)
                .set('email', email)
                .set("password", password)
                .end((err, res) => {
                    if (err) reject(err)
                    else resolve(res.body)
                });
        } catch (err) {
            reject(err)
        }
    })
};

// 获取用户信息
export const getHomeData = (cache) => {
    let url = "getUserHome";
    if (cache) {
        url = "getUserHome?cache=false";
    }
    const { uid, token } = getUidToken();
    return new Promise((resolve, reject) => {
        try {
            superagent
                .post(BASE_URL + url)
                .set("uid", uid)
                .set("token", token)
                .end((err, res) => {
                    if (err) reject(err)
                    else resolve(res.body)
                });
        } catch (err) {
            reject(err)
        }
    })
}