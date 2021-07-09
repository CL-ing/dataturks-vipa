import {
  convertKeyToString,
  hitStateNameMap,
  HIT_STATE_AL,
  HIT_STATE_DELETED,
  HIT_STATE_DONE,
  HIT_STATE_PRE_TAGGED,
  HIT_STATE_REQUEUED,
  HIT_STATE_SKIPPED,
  HIT_STATE_SL,
  IMAGE_BOUNDING_BOX,
  IMAGE_POLYGON_BOUNDING_BOX,
  IMAGE_POLYGON_BOUNDING_BOX_V2,
  POS_TAGGING,
  TEXT_CLASSIFICATION,
} from '@/helpers/Utils'
import React from 'react'
import { Accordion, Icon, Label } from 'semantic-ui-react'
import Popover from 'react-bootstrap/lib/Popover'

export const renderSelectorArr = (contributorDetails = [], entities) => {
  return [
    {
      valueKey: 'status',
      placeholder: 'Select State',
      options: [
        { text: 'Done HITs', value: HIT_STATE_DONE },
        { text: 'SL HITs', value: HIT_STATE_SL },
        { text: 'AL HITs', value: HIT_STATE_AL },
        { text: 'Skipped HITs', value: HIT_STATE_SKIPPED },
        { text: 'Deleted HITs', value: HIT_STATE_DELETED },
        { text: 'Pre-Tagged HITs', value: HIT_STATE_PRE_TAGGED },
        { text: 'Re-Tagging Queue', value: HIT_STATE_REQUEUED },
      ],
    },
    {
      valueKey: 'evaluationType',
      placeholder: 'Filter By Evaluation Status',
      options: [
        { text: 'Correct', value: 'correct' },
        { text: 'Incorrect', value: 'incorrect' },
        { text: 'Not Evaluated', value: 'none' },
        { text: 'All', value: 'all' },
      ],
    },
    {
      valueKey: 'userId',
      placeholder: 'Filter by Contributor',
      options: [
        ...contributorDetails.map(contributor => ({
          text: contributor?.userDetails?.firstName,
          value: contributor?.userDetails?.uid,
        })),
        {
          text: 'All',
          value: 'all',
        },
      ],
    },
    {
      valueKey: 'label',
      placeholder: 'Filter by Tagged Entity',
      options: [
        ...entities.map(entity => ({
          text: entity,
          value: entity,
        })),
        {
          text: 'All',
          value: 'all',
        },
      ],
    },
  ]
}

export const getHitInfo = hit => {
  if (hit) {
    const fileName = hit.fileName
    const status = hit.status
    return (
      <div>
        {fileName && (
          <Label title="File Name" size="mini">
            {fileName}
          </Label>
        )}
        {status && (
          <Label title="HIT status" style={{ textTransform: 'capitalize' }} size="mini">
            {hitStateNameMap[status]}
          </Label>
        )}
      </div>
    )
  }
}

export const getKeyboardShortcuts = shortcuts => {
  const shorts = Object.keys(shortcuts)
  let completeContent = ''
  if (shorts) {
    for (let index = 0; index < shorts.length; index++) {
      const content = convertKeyToString(shortcuts[shorts[index]])
      completeContent = completeContent + shorts[index] + ':' + content + '\n'
    }
  }
  return completeContent
}
