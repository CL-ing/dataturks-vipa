/*
 * @Author: Azhou
 * @Date: 2021-06-15 15:04:30
 * @LastEditors: Azhou
 *
 * @LastEditTime: 2021-07-04 19:26:11
 */
import { createDocEntityColorMap, createEntitiesJson } from '@/helpers/Utils'
import {
  UPDATE_CURRENT_HITS,
  UPDATE_PROJECT_DETAIL,
  UPDATE_PROJECT_HITS,
  UPDATE_CURRENT_HIT_INDEX,
  UPDATE_BOUNDING_BOX_MAP,
  UPDATE_CURRENT_IMG_INFO,
} from '../actionTypes'

export const projectInitialState = {
  projectDetails: {}, // 项目详情
  projectHits: [], // 项目的历史标记项
  entities: [],
  entityColorMap: {},
  currentHit: null, // 当前标记项
  currentIndex: 0, // 当前标记项在历史hits中的index
  boundingBoxMap: [], // 当前标记项的标记信息
  currentImgInfo: {
    // 当前标记图片的相关信息，供缩略图计算使用
    imgSize: null, // 图片的当前大小，受scale影响，也有可能是缩略图的区域图
    originImgSize: null, // 图片的原始大小
    sliceOffset: {
      // 缩略图左上角的起始偏移量
      x: 0,
      y: 0,
    },
    sliceSize: {
      // 缩略图截取的图片大小
      imgWidth: 0,
      imgHeight: 0,
    },
    opacity: 0.4, // 当前标记的透明度
  },
}

const project = function (state = projectInitialState, action) {
  switch (action.type) {
    case UPDATE_PROJECT_DETAIL:
      const entities = createEntitiesJson(action.payload.taskRules).entities
      return {
        ...state,
        projectDetails: action.payload,
        entities,
        entityColorMap: createDocEntityColorMap(entities),
      }

    case UPDATE_PROJECT_HITS:
      return {
        ...state,
        projectHits: action.payload,
      }
    case UPDATE_CURRENT_HITS:
      return {
        ...state,
        currentHit: action.payload,
      }
    case UPDATE_CURRENT_HIT_INDEX:
      return {
        ...state,
        currentIndex: action.payload,
        currentHit: state.projectHits[action.payload],
      }
    case UPDATE_BOUNDING_BOX_MAP:
      return {
        ...state,
        boundingBoxMap: action.payload,
      }
    case UPDATE_CURRENT_IMG_INFO:
      return {
        ...state,
        currentImgInfo: action.payload,
      }
    default:
      return state
  }
}
export default project
