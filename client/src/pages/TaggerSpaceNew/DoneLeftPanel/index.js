/*
 * @Author: Azhou
 * @Date: 2021-05-28 14:28:27
 * @LastEditors: Azhou
 * @LastEditTime: 2021-06-18 17:36:13
 */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Segment } from 'semantic-ui-react'
import { getContributorDetailsMap } from '../help'
import { getHitDetails, showActionButtons, showButtonsMini } from './utils'
import { addHitEvaluation } from '@/request/actions/project'
import { message } from 'antd'

const DoneLeftPanel = ({
  handleChangeHitStatus,
  isHitted,
  saveElement,
  nextRow,
  type,
  changesInSession,
}) => {
  const { currentHit, projectDetails, currentIndex, projectHits } = useSelector(
    // @ts-ignore
    state => state.project
  )
  const dispatch = useDispatch()
  const contributorDetailsMap = getContributorDetailsMap(projectDetails.contributorDetails)

  const evaluateHit = async value => {
    const res = await addHitEvaluation(currentHit.id, projectDetails.id, value)
    if (!res.err) {
      message.success('operate success！')
      dispatch({
        type: 'UPDATE_CURRENT_HITS',
        payload: {
          ...currentHit,
          evaluation: value,
        },
      })
    }
  }

  return (
    <Segment raised style={{ width: '20%' }}>
      <h4 style={{ textTransform: 'capitalize', marginTop: '0.5rem' }}>HITs Overview </h4>
      {getHitDetails(currentHit, contributorDetailsMap)}
      {showButtonsMini(
        changesInSession,
        type,
        isHitted,
        saveElement,
        handleChangeHitStatus,
        nextRow,
        currentIndex,
        projectHits
      )}
      {showActionButtons(type, isHitted, handleChangeHitStatus)}
      <br />
      {isHitted && (
        <div>
          <h4> Evaluate Tagging </h4>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button.Group size="mini">
              <Button onClick={() => evaluateHit('incorrect')} color="blue">
                Incorrect
              </Button>
              <Button.Or />
              <Button onClick={() => evaluateHit('correct')} color="blue">
                Correct
              </Button>
            </Button.Group>
          </div>
        </div>
      )}
    </Segment>
  )
}

export default DoneLeftPanel
