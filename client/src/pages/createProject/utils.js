/*
 * @Author: Azhou
 * @Date: 2021-05-19 14:31:18
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-19 14:31:19
 */

const getNamePlaceHolder = type => {
  let _namePlaceHolder = 'Dataset name'
  switch (type) {
    case 'POS_TAGGING':
    case 'POS_TAGGING_GENERIC':
      _namePlaceHolder = 'Resume Skill Identification Dataset'
      break
    case 'IMAGE_CLASSIFICATION':
      _namePlaceHolder = 'Cat Dog Image Classification Dataset'
      break
    case 'VIDEO_CLASSIFICATION':
      _namePlaceHolder = 'Cat Dog Video Classification Dataset'
      break
    case 'IMAGE_POLYGON_BOUNDING_BOX':
    case 'VIDEO_BOUNDING_BOX':
    case 'IMAGE_POLYGON_BOUNDING_BOX_V2':
    case 'IMAGE_BOUNDING_BOX':
      _namePlaceHolder = 'Car/Cat Bounding Box Dataset'
      break
    case 'TEXT_CLASSIFICATION':
      _namePlaceHolder = 'Emotion Detection Dataset using tweets'
      break
    case 'TEXT_MODERATION':
      _namePlaceHolder = 'Violent Content Moderation Dataset'
      break
    case 'TEXT_SUMMARIZATION':
      _namePlaceHolder = 'Resume Summarization Dataset'
      break
  }

  return _namePlaceHolder
}

const getInstructionPlaceHolder = type => {
  let placeholder = 'Tagging guidelines for your team. Ex: Mark all place names as City'
  if (
    type === 'TEXT_CLASSIFICATION' ||
    type === 'IMAGE_CLASSIFICATION' ||
    type === 'VIDEO_CLASSIFICATION'
  ) {
    placeholder = 'Classification guidelines for your team. Ex: Mark all 1 star review as negative'
  } else if (
    type === 'IMAGE_BOUNDING_BOX' ||
    type === 'VIDEO_BOUNDING_BOX' ||
    type === 'IMAGE_POLYGON_BOUNDING_BOX' ||
    type === 'IMAGE_POLYGON_BOUNDING_BOX_V2'
  ) {
    placeholder = 'Bounding guidelines for your team. Ex: Create rectangles around cars'
  } else if (type === 'DOCUMENT_ANNOTATION') {
    placeholder =
      'Document annotation guidelines for your team. e.g Mark javascript as super-human skill '
  }
  return placeholder
}

export { getNamePlaceHolder, getInstructionPlaceHolder }
