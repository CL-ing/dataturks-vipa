import {
  convertKeyToString,
  hitStateNameMap,
  HIT_EVALUATION_CORRECT,
  HIT_EVALUATION_INCORRECT,
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
import { useHistory, useParams } from 'react-router-dom'
import { Accordion, Dropdown, Icon, Label } from 'semantic-ui-react'
import Popover from 'react-bootstrap/lib/Popover'

function getUrl(type, contributorId, entity, evaluationType, params) {
  let url = '/projects/' + params.orgName + '/' + params.projectName + '/space?'
  if (type) {
    url = url + 'type=' + type
  }
  if (contributorId) {
    url = url + '&contributorId=' + contributorId
  }
  if (entity) {
    url = url + '&label=' + entity
  }
  if (evaluationType) {
    url = url + '&evaluationType=' + evaluationType
  }
  return url
}

export const getHitStates = (parentState, resetFilterState) => {
  let history = useHistory()
  let params = useParams()
  const options = []
  let selected = parentState.type
  options.push({
    text: 'Done HITs',
    value: HIT_STATE_DONE,
    onClick: () => {
      resetFilterState()
      history.push(
        getUrl(
          HIT_STATE_DONE,
          parentState.contributorId,
          parentState.label,
          parentState.evaluationType,
          params
        )
      )
    },
  })
  options.push({
    text: 'SL HITs',
    value: HIT_STATE_SL,
    onClick: () => {
      resetFilterState()
      history.push(
        getUrl(
          HIT_STATE_SL,
          parentState.contributorId,
          parentState.label,
          parentState.evaluationType,
          params
        )
      )
    },
  })
  options.push({
    text: 'AL HITs',
    value: HIT_STATE_AL,
    onClick: () => {
      resetFilterState()
      history.push(
        getUrl(
          HIT_STATE_AL,
          parentState.contributorId,
          parentState.label,
          parentState.evaluationType,
          params
        )
      )
    },
  })
  options.push({
    text: 'Skipped HITs',
    value: HIT_STATE_SKIPPED,
    onClick: () => {
      resetFilterState()
      history.push(getUrl(HIT_STATE_SKIPPED, undefined, undefined, undefined, params))
    },
  })
  options.push({
    text: 'Deleted HITs',
    value: HIT_STATE_DELETED,
    onClick: () => {
      resetFilterState()
      history.push(getUrl(HIT_STATE_DELETED, undefined, undefined, undefined, params))
    },
  })
  options.push({
    text: 'Pre-Tagged HITs',
    value: HIT_STATE_PRE_TAGGED,
    onClick: () => {
      resetFilterState()
      history.push(getUrl(HIT_STATE_PRE_TAGGED, undefined, undefined, undefined, params))
    },
  })
  options.push({
    text: 'Re-Tagging Queue',
    value: HIT_STATE_REQUEUED,
    onClick: () => {
      resetFilterState()
      history.push(getUrl(HIT_STATE_REQUEUED, undefined, undefined, undefined, params))
    },
  })
  return <Dropdown value={selected} placeholder="Select State" selection options={options} />
}

export const getEvaluations = (parentState, resetFilterState) => {
  let history = useHistory()
  let params = useParams()
  const options = []
  let selected = parentState.evaluationType
  options.push({
    text: 'Correct',
    value: 'correct',
    onClick: () => {
      resetFilterState()
      parentState.label = undefined
      parentState.contributorId = undefined
      history.push(getUrl(parentState.type, undefined, undefined, HIT_EVALUATION_CORRECT, params))
    },
  })
  options.push({
    text: 'Incorrect',
    value: 'incorrect',
    onClick: () => {
      resetFilterState()
      parentState.label = undefined
      parentState.contributorId = undefined
      history.push(getUrl(parentState.type, undefined, undefined, HIT_EVALUATION_INCORRECT, params))
    },
  })
  options.push({
    text: 'Not Evaluated',
    value: 'none',
    onClick: () => {
      resetFilterState()
      parentState.label = undefined
      parentState.contributorId = undefined
      history.push(getUrl(parentState.type, undefined, undefined, 'NONE', params))
    },
  })
  options.push({
    text: 'All',
    value: undefined,
    onClick: () => {
      resetFilterState()
      parentState.evaluationType = undefined
      history.push(getUrl(parentState.type, undefined, undefined, undefined, params))
    },
  })
  return (
    <Dropdown
      compact
      value={selected}
      placeholder="Filter By Evaluation Status"
      selection
      options={options}
    />
  )
}

export const getContributors = (parentState, resetFilterState) => {
  let history = useHistory()
  let params = useParams()
  const contributorDetails = parentState.contributorDetails
  const options = []
  let selected = ''
  if (contributorDetails) {
    for (let index = 0; index < contributorDetails.length && index < 50; index++) {
      // let active = false;
      if (parentState.contributorId === contributorDetails[index].userDetails.uid) {
        // active = true;
        selected = contributorDetails[index].userDetails.uid
      }
      options.push({
        text: contributorDetails[index].userDetails.firstName
          ? contributorDetails[index].userDetails.firstName
          : '',
        value: contributorDetails[index].userDetails.uid
          ? contributorDetails[index].userDetails.uid
          : '',
        image: {
          avatar: true,
          src: contributorDetails[index].userDetails.profilePic
            ? contributorDetails[index].userDetails.profilePic
            : '',
        },
        onClick: () => {
          resetFilterState()
          history.push(
            getUrl(
              parentState.type,
              contributorDetails[index].userDetails.uid,
              parentState.label,
              parentState.evaluationType,
              params
            )
          )
        },
      })
    }
    options.push({
      text: 'All',
      value: 'all',
      onClick: () => {
        resetFilterState()
        parentState.contributorId = undefined
        history.push(
          getUrl(parentState.type, undefined, parentState.label, parentState.evaluationType, params)
        )
      },
    })
    return (
      <Dropdown value={selected} placeholder="Filter by Contributor" selection options={options} />
    )
  }
}

export const getEntities = (parentState, resetFilterState) => {
  const entities = parentState.entities
  let history = useHistory()
  let params = useParams()
  const options = []
  let selected = ''
  if (entities) {
    for (let index = 0; index < entities.length; index++) {
      // let active = false;
      if (parentState.label === entities[index]) {
        // active = true;
        selected = entities[index]
      }
      options.push({
        text: entities[index],
        value: entities[index],
        onClick: () => {
          resetFilterState()
          history.push(
            getUrl(
              parentState.type,
              parentState.contributorId,
              entities[index],
              parentState.evaluationType,
              params
            )
          )
        },
      })
    }
    options.push({
      text: 'All',
      value: 'All',
      onClick: () => {
        resetFilterState()
        parentState.label = undefined
        history.push(
          getUrl(
            parentState.type,
            parentState.contributorId,
            undefined,
            parentState.evaluationType,
            params
          )
        )
      },
    })
    return (
      <Dropdown
        value={selected}
        placeholder="Filter by Tagged Entity"
        selection
        options={options}
      />
    )
  }
}

export const showTaggingInstructions = parentState => {
  const { activeIndex } = parentState
  return (
    <Accordion>
      <Accordion.Title active={activeIndex === 0} index={0} onClick={() => {}}>
        <Icon name="dropdown" />
        <Label size="mini" style={{ background: '#a9d5de' }}>
          Project Guidelines
        </Label>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <p>{parentState.rules.instructions}</p>
      </Accordion.Content>
    </Accordion>
  )
}

export function getHitInfo(hit) {
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

export const getPopoverTop = taskType => {
  let popoverTop
  if (taskType === POS_TAGGING) {
    popoverTop = (
      <Popover id="popover-positioned-top" title="How to annotate">
        Click to select a word and then select an entity to annotate. More queries?
        <a href="https://dataturks.com/help/help.php" target="_blank">
          See Demo Videos
        </a>
      </Popover>
    )
  } else if (taskType === TEXT_CLASSIFICATION) {
    popoverTop = (
      <Popover id="popover-positioned-top" title="How to classify">
        Click to select a class to classify the sentence. More queries?
        <a href="https://dataturks.com/help/help.php" target="_blank">
          See Demo Videos
        </a>
      </Popover>
    )
  } else if (taskType === IMAGE_BOUNDING_BOX) {
    popoverTop = (
      <Popover id="popover-positioned-top" title="How to Bound">
        Click on the image and mouse-drag to draw a rectangle and pick a category from drop-down
        menu. By Default first category in the list will be shown selected. More queries?
        <a href="https://dataturks.com/help/help.php" target="_blank">
          See Demo Videos
        </a>
      </Popover>
    )
  } else if (
    taskType === IMAGE_POLYGON_BOUNDING_BOX ||
    taskType === IMAGE_POLYGON_BOUNDING_BOX_V2
  ) {
    popoverTop = (
      <Popover id="popover-positioned-top" title="How to Bound">
        <li>Click on the image to mark each point of the polygon.</li>
        <li>
          When you select "Close Polygon" button, last point is auto-connected to the first point to
          complete the polygon.
        </li>
        <li>
          More queries?
          <a href="https://dataturks.com/help/help.php" target="_blank">
            See Demo Videos
          </a>
        </li>
      </Popover>
    )
  }
  return popoverTop
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
