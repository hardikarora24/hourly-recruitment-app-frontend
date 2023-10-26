import React from 'react'

const Project = ({ project, setShowModal }) => {
  return (
    <>
      <div>Title: {project.title}</div>
      <div>Description: {project.description}</div>
      <div>Technologies: {project.technologies.join(', ')}</div>
      <div>Estimated Duration: {project.duration}</div>
      <button
        onClick={() => {
          setShowModal(true)
        }}
      >
        Bid
      </button>
    </>
  )
}

export default Project
