/*
 * @Author: Azhou
 * @Date: 2021-06-21 15:27:15
 * @LastEditors: Azhou
 * @LastEditTime: 2021-07-04 19:51:23
 */
export const shapes = [
  {
    value: 'polygon',
    icon: 'star outline',
    title: 'Click to draw Polygon',
    label: 'Polygon',
  },
  {
    value: 'rectangle',
    icon: 'square outline',
    title: 'Click to draw Rectangle',
    label: 'Rectangle',
  },
  {
    value: 'point',
    icon: 'point',
    title: 'Click to draw Points',
    label: 'Point',
  },
]

export const btnGroup = [
  {
    title: 'will save hits and change status to done',
    desc: 'Save and Done',
    value: 'saveToDone',
  },
  {
    title: 'will save hits and change status to notDone',
    desc: 'Save Partial Hit',
    value: 'savePartialHit',
  },
  {
    title: 'will download hit to local with json format',
    desc: 'Save Hit To JSON',
    value: 'saveHitToLocal',
  },
  {
    title: 'will download img and hit together with png format',
    desc: 'Save Hit To IMG',
    value: 'saveHitToImg',
  },
  {
    title: 'will download img and hit together with png format',
    desc: 'log result',
    value: 'logResult',
  },
]
