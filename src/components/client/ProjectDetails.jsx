import React from 'react'

const ProjectDetails = ({ project }) => {
  return (
    <div className='project'>
      <div className='title'>Title: {project.title}</div>
      <div className='description'>Description: {project.description}</div>
      <div className='technologies'>
        Technologies: {project.technologies.join(', ')}
      </div>
      <div className='duration'>Estimated Duration: {project.duration}</div>
    </div>
  )
}

export default ProjectDetails
