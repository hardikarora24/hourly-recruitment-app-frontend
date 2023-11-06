import { useState } from 'react'
import ProjectDetails from './ProjectDetails'
import { PROJECT_STATUS } from '../../utils/Constants'
import Modal from '../Modal'
import axios from 'axios'

const CompletedProject = ({ project, submission }) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <Submission
          setShowModal={setShowModal}
          project={project}
          clientId={project.clientId}
          submission={submission}
        />
      </Modal>
      <ProjectDetails project={project} />
      {project.status === PROJECT_STATUS.completed && (
        <button
          onClick={() => {
            setShowModal(true)
          }}
        >
          View Submission
        </button>
      )}
    </>
  )
}

const Submission = ({ submission, setShowModal, project }) => {
  const [error, setError] = useState('')

  const handleSubmit = async (approve) => {
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/client/${
          approve ? 'approve' : 'reject'
        }`,
        data: {
          submission: submission,
          projectId: project._id,
        },
        withCredentials: true,
      })

      if (data.success) {
        setShowModal(false)
      }
    } catch (e) {
      setError('Could not approve project')
    }
  }

  const handleReject = () => {
    handleSubmit(false)
  }
  const handleAccept = () => {
    handleSubmit(true)
  }

  return (
    <div className='completed-project'>
      {error && <div className='error'>{error}</div>}
      <div className='group'>
        <div className='label'>Source Code: </div>
        <div className='url'>{submission.sourceCodeUrl}</div>
      </div>
      <div className='group'>
        <div className='label'>Demo Video: </div>
        <div className='url'>{submission.demoUrl}</div>
      </div>
      <div className='group'>
        <div className='label'>Hosted Project: </div>
        <div className='url'>{submission.hostedUrl}</div>
      </div>
      {project.status === PROJECT_STATUS.completed && (
        <div className='button-container'>
          <button onClick={handleAccept}>Approve</button>
          <button onClick={handleReject}>Reject</button>
        </div>
      )}
    </div>
  )
}

export default CompletedProject
