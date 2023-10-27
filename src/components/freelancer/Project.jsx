import { PROJECT_STATUS } from '../../utils/Constants'

const Project = ({ project, setShowModal = (b) => {} }) => {
  return (
    <>
      <div>Title: {project.title}</div>
      <div>Description: {project.description}</div>
      <div>Technologies: {project.technologies.join(', ')}</div>
      <div>Estimated Duration: {project.duration}</div>
      {project.status === PROJECT_STATUS.posted ? (
        <button
          onClick={() => {
            setShowModal(true)
          }}
        >
          Bid
        </button>
      ) : project.status === PROJECT_STATUS.inProgress ? (
        <button
          onClick={() => {
            setShowModal(true)
          }}
        >
          Submit
        </button>
      ) : (
        <></>
      )}
    </>
  )
}

export default Project
