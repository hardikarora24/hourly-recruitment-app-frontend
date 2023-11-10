import React from 'react'
import businessHours from '../../utils/businessHours'
import { PROJECT_STATUS } from '../../utils/Constants'

const ProjectDetails = ({ project }) => {
  return (
    <div className='project'>
      <div className='title'>Title: {project.title}</div>
      <div className='description'>Description: {project.description}</div>
      <div className='technologies'>
        Technologies: {project.technologies.join(', ')}
      </div>
      {project.status === PROJECT_STATUS.posted ||
      project.status === PROJECT_STATUS.inProgress ? (
        <>
          <div className='duration'>Estimated Duration: {project.duration}</div>
        </>
      ) : (
        <>
          <div className='rate'>Rate: {project.accepted_bid.hourly_rate}</div>
          <div className='time'>
            Time Taken:{' '}
            {businessHours(
              new Date(project?.accepted_bid?.accepted_at),
              new Date(project?.approved_submission?.accepted_at)
            )}{' '}
            hrs
          </div>
        </>
      )}{' '}
    </div>
  )
}

export default ProjectDetails
