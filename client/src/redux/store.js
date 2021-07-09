/*
 * @Author: Azhou
 * @Date: 2021-05-11 22:59:42
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-23 19:56:49
 */
import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import createMiddleware from './middleware/clientMiddleware'
import ApiClient from '../helpers/ApiClient'
import { userInitialState } from './reducers/user'
import { authInitialState } from './modules/auth'
import { dtInitialState } from './modules/dataturks'

const client = new ApiClient()

let finalCreateStore = compose(applyMiddleware(createMiddleware(client), thunk))(_createStore)

export default finalCreateStore(rootReducer, {
  user: userInitialState,
  auth: authInitialState,
  dataturksReducer: dtInitialState,
})
