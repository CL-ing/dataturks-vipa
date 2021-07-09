/*
 * @Author: Azhou
 * @Date: 2021-05-11 23:03:56
 * @LastEditors: 徐文祥
 * @LastEditTime: 2021-05-17 13:47:06
 */
import { combineReducers } from 'redux'

import user from './user'
import project from './project'
import auth from '../modules/auth'
import dataturksReducer from '../modules/dataturks'

export default combineReducers({
  user,
  auth,
  project,
  dataturksReducer,
})
