import React from 'react'

const ProjectDetails = ({ project }) => {
  return (
    <>
      <div>Title: {project.title}</div>
      <div>Description: {project.description}</div>
      <div>Technologies: {project.technologies.join(', ')}</div>
      <div>Estimated Duration: {project.duration}</div>
    </>
  )
}

export default ProjectDetails
