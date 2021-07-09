import useQuery from '@/hooks/useQuery'
import React, { useState } from 'react'
import BaseInfo from './BaseInfo'
import Finished from './Finished'
import UploadType from './UploadType'

const CreateProject = () => {
  let { type, shape } = useQuery()

  const [currentProject, setCurrentProject] = useState('')
  const [projectCreationComplete, setProjectCreationComplete] = useState(false)
  const [fileUploadStats, setFileUploadStats] = useState()

  return (
    <div style={{ textAlign: 'center' }}>
      {!currentProject && (
        <BaseInfo type={type} shape={shape} handleProjectCreated={setCurrentProject} />
      )}
      {currentProject && !projectCreationComplete && (
        <UploadType
          type={type}
          currentProject={currentProject}
          handleUploaded={(isComplete, fileUploadStats) => {
            setProjectCreationComplete(isComplete)
            if (isComplete) setFileUploadStats(fileUploadStats)
          }}
        />
      )}
      {projectCreationComplete && fileUploadStats && (
        <Finished type={type} fileUploadStats={fileUploadStats} />
      )}
    </div>
  )
}

export default CreateProject
