/*
 * @Author: Azhou
 * @Date: 2021-05-31 09:51:14
 * @LastEditors: Azhou
<<<<<<< HEAD
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
=======
 * @LastEditTime: 2021-07-08 16:33:35
 */
import React, { useMemo, useState } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import qs from 'qs'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Popover from 'react-bootstrap/lib/Popover'
import { getDetaultShortcuts, HIT_STATE_NOT_DONE } from '@/helpers/Utils'
import { getHitInfo, getKeyboardShortcuts, renderSelectorArr } from './utils'
import { useSelector } from 'react-redux'
import { Select, Tag, Tooltip, Checkbox } from 'antd'

const DoneTopBar = ({ globalFlag, setGlobalFlag, filterValue }) => {
  let history = useHistory()
  const { pathname } = useLocation()
  // @ts-ignore
  let { orgName, projectName } = useParams()
  const [instruction, setInstruction] = useState('')

  const { currentHit, projectDetails, entities } = useSelector(
    // @ts-ignore
    state => state.project
  )
  const taskType = projectDetails.task_type

  const keyobardPopover = useMemo(() => {
    if (projectDetails?.taskRules) {
      const rules = JSON.parse(projectDetails.taskRules)
      setInstruction(rules.instructions)
      let shortcuts = getDetaultShortcuts(taskType, entities)
      if ('shortcuts' in rules) {
        shortcuts = rules.shortcuts
      }
      return (
        <Popover id="popover-positioned-top" style={{ whiteSpace: 'pre' }}>
          {getKeyboardShortcuts(shortcuts)}
        </Popover>
      )
    }
  }, [projectDetails])

  const handleChange = (value, selectItem) => {
    if (value === 'all') value = ''
    const trueFilterValue = {}
    filterValue[selectItem.valueKey] = value
    for (const key in filterValue) {
      if (filterValue[key]) trueFilterValue[key] = filterValue[key]
    }
    history.replace(`${pathname}?${qs.stringify(trueFilterValue)}`)
  }
  return (
    <div style={{ display: 'flex' }}>
      <Button
        icon
        title="Back"
        className="pull-left"
        onClick={() => history.push('/userHome/projects/' + orgName + '/' + projectName)}
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
      {filterValue.status !== HIT_STATE_NOT_DONE && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {renderSelectorArr(projectDetails.contributorDetails, entities).map(selectItem => (
            <Select
              key={selectItem.valueKey}
              placeholder={selectItem.placeholder}
              value={filterValue[selectItem.valueKey] || undefined}
              style={{ width: '200px', marginRight: '5px' }}
              onChange={value => handleChange(value, selectItem)}
            >
              {selectItem.options.map((opt, index) => (
                <Select.Option value={opt.value} key={index}>
                  {opt.text}
                </Select.Option>
              ))}
            </Select>
          ))}
        </div>
      )}

      {filterValue.status === HIT_STATE_NOT_DONE && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Tooltip placement="bottomLeft" title={instruction}>
            <Tag color="geekblue" style={{ cursor: 'default' }}>
              Project Guidelines
            </Tag>
          </Tooltip>
          <div style={{ flex: 1, textAlign: 'center' }}>{getHitInfo(currentHit)}</div>
          <Checkbox
            checked={globalFlag.keepEntitySelected}
            onChange={() =>
              setGlobalFlag({ ...globalFlag, keepEntitySelected: !globalFlag.keepEntitySelected })
            }
          >
            Keep Entity Selected
          </Checkbox>
          <OverlayTrigger
            trigger={['hover']}
            placement="bottom"
            overlay={
              <Popover id="popover-positioned-top" title="How to Bound">
                <li>Click on the image to mark each point of the polygon.</li>
                <li>
                  When you select "Close Polygon" button, last point is auto-connected to the first
                  point to complete the polygon.
                </li>
                <li>
                  More queries?
                  <a href="https://dataturks.com/help/help.php" target="_blank">
                    See Demo Videos
                  </a>
                </li>
              </Popover>
            }
          >
            <Icon size="small" name="help circle" color="teal" />
          </OverlayTrigger>
          {keyobardPopover && (
            <OverlayTrigger trigger={['hover']} placement="bottom" overlay={keyobardPopover}>
              <Button
                size="mini"
                icon
                onClick={() =>
                  history.push('/userHome/projects/' + orgName + '/' + projectName + '/keybind')
                }
                compact
              >
                <Icon aria-label="Keyboard Shortcuts" name="keyboard" />
              </Button>
            </OverlayTrigger>
          )}
          <OverlayTrigger
            trigger={['hover']}
            placement="bottom"
            overlay={<Popover id="popover-positioned-top" title="Full Screen" />}
          >
            <Button
              compact
              size="mini"
              icon
              onClick={() =>
                setGlobalFlag({
                  ...globalFlag,
                  fullScreen: !globalFlag.fullScreen,
                })
              }
            >
              <Icon color="blue" name={globalFlag.fullScreen ? 'compress' : 'expand'} />
            </Button>
          </OverlayTrigger>
        </div>
      )}
>>>>>>> tmp
    </div>
  )
}

export default DoneTopBar
