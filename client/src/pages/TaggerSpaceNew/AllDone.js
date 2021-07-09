/*
 * @Author: Azhou
 * @Date: 2021-05-28 14:03:43
 * @LastEditors: Azhou
 * @LastEditTime: 2021-05-28 14:03:43
 */
import React from 'react'
import { Button, Segment } from 'semantic-ui-react'
import { useHistory, useParams } from 'react-router-dom'

const NotDone = () => {
  let history = useHistory()
  let { orgName, projectName } = useParams()
  return (
    <Segment color="green" className="marginTopExtra">
      <h4> All items are tagged, You can check the project stats. </h4>
      <Button onClick={() => history.push(`/userHome/projects/${orgName}/${projectName}`)}>
        Show project stats
      </Button>
      <div style={{ height: '30px' }} />
<<<<<<< HEAD
      <Button onClick={() => history.push(`/projects/new/${orgName}/${projectName}/space?type=done`)}>
=======
      <Button onClick={() => history.push(`/projects/${orgName}/${projectName}/space?type=done`)}>
>>>>>>> tmp
        Show Completed HITs
      </Button>
      <div style={{ height: '30px' }} />
      <Button
<<<<<<< HEAD
        onClick={() => history.push(`/projects/new/${orgName}/${projectName}/space?type=skipped`)}
=======
        onClick={() => history.push(`/projects/${orgName}/${projectName}/space?type=skipped`)}
>>>>>>> tmp
      >
        Show Skipped HITs
      </Button>
    </Segment>
  )
}

export default NotDone
