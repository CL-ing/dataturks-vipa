/*
 * @Author: Azhou
 * @Date: 2021-05-13 14:57:51
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-13 16:32:58
 */
import { UPDATE_USER_DETAIL } from '../actionTypes'

export const userInitialState = {
  user: {},
}

const user = function (state = userInitialState, action) {
  switch (action.type) {
    case UPDATE_USER_DETAIL: {
      return {
        ...state,
        user: action.payload,
      }
    }
    default:
      return state
  }
}
export default user
