/*
 * @Author: Azhou
 * @Date: 2021-05-31 09:51:14
 * @LastEditors: Azhou
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
    </div>
  )
}

export default DoneTopBar
