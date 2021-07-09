/*
 * @Author: Azhou
 * @Date: 2021-05-31 09:51:14
 * @LastEditors: Azhou
 * @LastEditTime: 2021-06-16 19:10:05
 */
import React, { useMemo } from 'react'
import { Button, Checkbox, Icon } from 'semantic-ui-react'
import { useHistory, useParams } from 'react-router-dom'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Popover from 'react-bootstrap/lib/Popover'
import {
  DOCUMENT_ANNOTATION,
  HIT_STATE_NOT_DONE,
  IMAGE_BOUNDING_BOX,
  IMAGE_POLYGON_BOUNDING_BOX_V2,
  POS_TAGGING,
  POS_TAGGING_GENERIC,
  VIDEO_BOUNDING_BOX,
  VIDEO_CLASSIFICATION,
} from '@/helpers/Utils'
import {
  getContributors,
  getEntities,
  getEvaluations,
  getHitInfo,
  getHitStates,
  getKeyboardShortcuts,
  getPopoverTop,
  showTaggingInstructions,
} from './utils'
import { useSelector } from 'react-redux'

const DoneTopBar = ({
  type,
  isHitted,
  handleToggle,
  docAnnotator,
  resetFilterState,
  projectDetails,
}) => {
  let history = useHistory()
  // @ts-ignore
  let { orgName, projectName } = useParams()

  // @ts-ignore
  const { currentHit } = useSelector(state => state.project)
  // const { fullScreen, shortcuts } = parentState
  const taskType = projectDetails.task_type
  const fullScreenPopover = <Popover id="popover-positioned-top" title="Full Screen" />

  const popoverTop = useMemo(() => getPopoverTop(taskType), [taskType])
  const keyobardPopover = useMemo(() => {
    // if (projectDetails && shortcuts) {
    //   return getKeyboardShortcuts(shortcuts)
    // }
  }, [projectDetails])
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <Button
          icon
          title="Back"
          className="pull-left"
          onClick={() => history.push(`/userHome/projects/${orgName}/${projectName}`)}
          compact
        >
          <Icon color="teal" name="arrow left" />
        </Button>
        <Button
          icon
          title="Home"
          className="pull-left"
          onClick={() => history.push('/userHome/my-projects')}
          compact
        >
          <Icon size="large" name="home" color="teal" />
        </Button>
        {/* {type !== HIT_STATE_NOT_DONE && taskType !== POS_TAGGING && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {getHitStates(parentState, resetFilterState)}
            <br />
            {isHitted && getEvaluations(parentState, resetFilterState)}
            <br />
            {isHitted &&
              !parentState.evaluationType &&
              getContributors(parentState, resetFilterState)}
            <br />
            {isHitted &&
              !parentState.evaluationType &&
              parentState.entities?.length &&
              getEntities(parentState, resetFilterState)}
          </div>
        )} */}
      </div>
      {/* {(type === HIT_STATE_NOT_DONE || taskType === POS_TAGGING) && (
        <div style={{ flexGrow: 2, alignSelf: 'center' }}>
          {showTaggingInstructions(parentState)}
        </div>
      )} */}
      {type === HIT_STATE_NOT_DONE && currentHit && (
        <div style={{ flexGrow: 1.5, alignSelf: 'center' }}>{getHitInfo(currentHit)}</div>
      )}
      {/* {parentState.type === HIT_STATE_NOT_DONE &&
        taskType === IMAGE_BOUNDING_BOX &&
        !parentState.hitsCompleted && (
          <div className="text-center">
            <Checkbox
              size="mini"
              checked={parentState.notes}
              onClick={() => handleToggle('notes')}
              label="Show Notes"
            />
            &nbsp; &nbsp;
            <Checkbox
              size="mini"
              checked={parentState.hideLabels}
              onClick={() => handleToggle('hideLabels')}
              label="Hide Labels"
            />
            &nbsp; &nbsp;
            <Checkbox
              size="mini"
              checked={parentState.autoClose}
              onClick={() => handleToggle('autoClose')}
              label="AutoClose"
            />
          </div>
        )}
      {parentState.type === HIT_STATE_NOT_DONE &&
        taskType === IMAGE_POLYGON_BOUNDING_BOX_V2 &&
        !parentState.hitsCompleted && (
          <div className="text-center" style={{}}>
            <Checkbox
              size="mini"
              checked={parentState.keepEntitySelected}
              onClick={() => handleToggle('keepEntitySelected')}
              label="Keep Entity Selected"
            />
          </div>
        )}
      {parentState.type === HIT_STATE_NOT_DONE &&
        (taskType === DOCUMENT_ANNOTATION || taskType === POS_TAGGING_GENERIC) &&
        !parentState.hitsCompleted && (
          <div>
            <Checkbox
              checked={parentState.autoClose}
              onClick={() => handleToggle('autoClose')}
              label="AutoClose on Selection"
            />
            &nbsp; &nbsp;
            <Checkbox
              checked={parentState.autoLabel}
              onClick={() => handleToggle('autoLabel')}
              label="Autolabel Same Text in Document"
            />
            &nbsp; &nbsp;
            <Button
              disabled={parentState.undoButton}
              size="mini"
              icon
              onClick={() => docAnnotator.undo()}
            >
              Undo
            </Button>
            &nbsp; &nbsp;
            <Button size="mini" icon onClick={() => docAnnotator.clearAll()}>
              Clear All
            </Button>
          </div>
        )} */}
      {(type === HIT_STATE_NOT_DONE || taskType === POS_TAGGING) && (
        <div style={{ display: 'flex' }}>
          {popoverTop && (
            <div>
              <OverlayTrigger trigger={['hover']} placement="bottom" overlay={popoverTop}>
                <Icon name="help circle" color="teal" />
              </OverlayTrigger>
            </div>
          )}
        </div>
      )}

      {/* {(type === HIT_STATE_NOT_DONE || taskType === POS_TAGGING) && (
        <div style={{ display: 'flex' }}>
          {keyobardPopover && (
            <div>
              <OverlayTrigger trigger={['hover']} placement="bottom" overlay={keyobardPopover}>
                <Button
                  size="mini"
                  icon
                  onClick={() =>
                    history.push(`/userHome/projects/${orgName}/${projectName}/keybind`)
                  }
                  compact
                >
                  <Icon aria-label="Keyboard Shortcuts" name="keyboard" />
                </Button>
              </OverlayTrigger>
            </div>
          )}
        </div>
      )} */}

      {/* {(type === HIT_STATE_NOT_DONE || taskType === POS_TAGGING) && (
        <div style={{ display: 'flex' }}>
          {fullScreenPopover &&
            taskType !== VIDEO_BOUNDING_BOX &&
            taskType !== VIDEO_CLASSIFICATION && (
              <div>
                <OverlayTrigger trigger={['hover']} placement="bottom" overlay={fullScreenPopover}>
                  <Button compact size="mini" icon onClick={() => handleToggle('fullScreen')}>
                    {!fullScreen && <Icon color="blue" name="expand" />}
                    {fullScreen && <Icon color="blue" name="compress" />}
                  </Button>
                </OverlayTrigger>
              </div>
            )}
        </div>
      )} */}
    </div>
  )
}

export default DoneTopBar
