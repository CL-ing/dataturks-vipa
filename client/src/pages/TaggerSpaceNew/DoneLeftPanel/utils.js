/*
 * @Author: Azhou
 * @Date: 2021-05-28 14:35:04
 * @LastEditors: Azhou
 * @LastEditTime: 2021-07-06 20:53:14
 */
import {
  hitStateNameMap,
  HIT_STATE_DELETED,
  HIT_STATE_PRE_TAGGED,
  HIT_STATE_REQUEUED,
  HIT_STATE_SKIPPED,
  timeConverter,
} from '@/helpers/Utils'
import React from 'react'
import { Label, Card, Button, Icon } from 'semantic-ui-react'

export const getHitDetails = (hit, contributorDetailsMap) => {
  if (hit && hit.hitResults && contributorDetailsMap) {
    const hr = hit.hitResults[0] || {}
    const { fileName, status, evaluation } = hit
    const userName = contributorDetailsMap[hr.userId]?.firstName || ''
    const userEmail = contributorDetailsMap[hr.userId]?.email || ''
    return (
      <Card
        color="teal"
        style={{ minHeight: '15em', maxHeight: '20em', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <Card.Content>
          <Card.Header style={{ fontSize: 'smaller' }} content={userEmail} />
          {userName && <Card.Meta style={{ fontSize: 'small' }} content={userName} />}
          <Card.Description style={{ fontSize: 'x-small' }}>
            {fileName && (
              <p style={{ fontSize: 'x-small', width: 'min-content' }}>
                File Name: <b> {fileName} </b>
              </p>
            )}

            <p style={{ fontSize: 'x-small' }}>
              Last Updated <b> {timeConverter(hit.hitResults[0].updatedTimestamp / 1000)} </b>
            </p>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          {status && <Label size="mini">{hitStateNameMap[status]}</Label>}
          {evaluation && (
            <Label style={{ textTransform: 'capitalize' }} color="green" size="mini">
              {evaluation}
            </Label>
          )}
          <Label size="mini" color="teal" attached="top right">
            Annotator Info
          </Label>
        </Card.Content>
      </Card>
    )
  }
}

export const showButtonsMini = (
  changesInSession,
  type,
  isHitted,
  saveElement,
  handleChangeHitStatus,
  nextRow,
  currentIndex,
  projectHits
) => {
  const nextButtonDisabled = currentIndex < 0 || currentIndex >= projectHits.length - 1
  return (
    <div className="marginTopExtra" style={{ display: 'flex', justifyContent: 'space-around' }}>
      <Button
        title="Previous Element"
        size="mini"
        color="grey"
        icon
        onClick={() => nextRow('previous')}
        disabled={currentIndex <= 0}
      >
        <Icon name="arrow left" />
      </Button>
      {changesInSession > 0 && isHitted && (
        <Button
          size="mini"
          color="green"
          title="Save Changes"
          icon
          onClick={saveElement}
          disabled={currentIndex < 0}
        >
          <Icon name="save" />
        </Button>
      )}
      {type === 'notDone' && (
        <Button
          size="mini"
          color="grey"
          icon
          onClick={() => handleChangeHitStatus('skipped')}
          disabled={currentIndex < 0}
        >
          <Icon name="mail forward" />
        </Button>
      )}
      <Button
        title="Next Element"
        size="mini"
        color="blue"
        icon
        onClick={() => nextRow('next')}
        disabled={nextButtonDisabled}
      >
        <Icon name="arrow right" />
      </Button>
    </div>
  )
}

export const showActionButtons = (type, isHitted, handleChangeHitStatus) => {
  return (
    <div
      style={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {(type === HIT_STATE_SKIPPED ||
        type === HIT_STATE_PRE_TAGGED ||
        type === HIT_STATE_REQUEUED) && (
        <Button compact size="mini" color="blue" icon onClick={() => handleChangeHitStatus('done')}>
          <Icon name="save" />
          Mark as Done
        </Button>
      )}
      <br />
      {(isHitted ||
        type === HIT_STATE_PRE_TAGGED ||
        type === HIT_STATE_REQUEUED ||
        type === HIT_STATE_DELETED) && (
        <Button
          compact
          size="mini"
          color="blue"
          title="Mark as skipped"
          icon
          onClick={() => handleChangeHitStatus('skipped')}
        >
          <Icon name="mail forward" />
          Mark as Skipped
        </Button>
      )}
      <br />
      {(type === HIT_STATE_SKIPPED ||
        isHitted ||
        type === HIT_STATE_PRE_TAGGED ||
        type === HIT_STATE_REQUEUED) && (
        <Button
          compact
          size="mini"
          color="red"
          icon
          onClick={() => handleChangeHitStatus('deleted')}
        >
          <Icon name="delete" />
          Delete
        </Button>
      )}
      <br />
      {(isHitted ||
        type === HIT_STATE_SKIPPED ||
        type === HIT_STATE_PRE_TAGGED ||
        type === HIT_STATE_DELETED) && (
        <Button
          title="Move HIT to Re-tagging Queue"
          compact
          size="mini"
          color="blue"
          icon
          onClick={() => handleChangeHitStatus('reQueued')}
        >
          <Icon name="undo" />
          Requeue
        </Button>
      )}
    </div>
  )
}
