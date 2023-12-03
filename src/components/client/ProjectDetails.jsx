import React from 'react'
import businessHours from '../../utils/businessHours'
import { PROJECT_STATUS } from '../../utils/Constants'
import { useEffect, useState } from 'react'

const ProjectDetails = ({ project }) => {
  const [submission, setSubmission] = useState()
  const [error, setError] = useState('')

  const getSubmission = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/freelancer/submission?id=${id}&projectId=${project._id}`,
        withCredentials: true,
      })

      if (data.success) {
        setSubmission(data.submission)
      }
    } catch (e) {
      setError('Could not submit')
    }
  }

  useEffect(() => {
    getSubmission()
  }, [])

  return (
    <li className='project'>
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
              new Date(submission?.created_at)
            )}{' '}
            hrs
          </div>
        </>
      )}
    </li>
  )
}

export default ProjectDetails
