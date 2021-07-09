/*
 * @Author: Azhou
 * @Date: 2021-06-09 22:28:26
 * @LastEditors: Azhou
 * @LastEditTime: 2021-07-01 16:07:03
 */
export const getPoint = point => {
  if (point < 0.0) {
    return 0.0
  }
  if (point > 1.0) {
    return 1.0
  }
  return point
}

export const getOffsets = e => {
  return [e.offsetX, e.offsetY]
}
