import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Loading from '../Loading'
import ProjectDetails from './ProjectDetails'
import Modal from '../Modal'
import { PROJECT_STATUS } from '../../utils/Constants'

const PostedProject = ({ project }) => {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const getBids = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/client/bids?projectId=${
          project._id
        }`,
        withCredentials: true,
      })

      if (data.success) {
        setBids(data.bids)
        setLoading(false)
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBids()
  }, [])

  const handleSubmit = async (b) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/client/accept-bid`,
        data: {
          bidId: b._id,
          projectId: project._id,
          freelancerId: b.freelancerId,
        },
        withCredentials: true,
      })
    } catch (e) {
      console.log('Could not accept')
    }
  }

  const deleteProject = async (id) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/client/delete`,
        data: { id },
        withCredentials: true,
      })
    } catch (e) {
      console.log('Could not delete')
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Modal setShowModal={setShowModal} showModal={showModal}>
            <EditModal />
          </Modal>
          <div className='posted'>
            <div className='project-details'>
              <ProjectDetails project={project} />
            </div>
            {bids.map((b, index) => (
              <div className='bid' key={index}>
                <span>Rate: {b.hourly_rate}</span>
                <button onClick={(e) => handleSubmit(b)}>Accept</button>
              </div>
            ))}
            {project.status === PROJECT_STATUS.posted && (
              <div className='button-container'>
                <button onClick={(e) => handleEdit()}>Edit</button>
                <button onClick={() => deleteProject(project._id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

const EditModal = ({ p, setShowModal }) => {
  const [project, setProject] = useState(p)

  const handleSubmit = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/client/edit`,
        data: {
          project,
        },
        withCredentials: true,
      })

      setShowModal(false)
    } catch (e) {
      console.log('Could not edit')
    }
  }

  const technologyInputRef = useRef()

  const handleChange = (e) => {
    setProject((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const addTechnology = (e) => {
    setProject((p) => ({
      ...p,
      technologies: [...p.technologies, technologyInputRef.current.value],
    }))
  }

  return (
    <>
      <form>
        <div>
          <label htmlFor='title'>Title: </label>
          <input type='text' name='title' onChange={handleChange} />
        </div>
        <div>
          <label htmlFor='description'>Description: </label>
          <input type='text' name='description' onChange={handleChange} />
        </div>
        <div>
          {form.technologies.map((t) => {
            return <div>{t}</div>
          })}
          <label htmlFor='technologies'>Technologies: </label>
          <input ref={technologyInputRef} type='text' name='technologies' />
          <button onClick={addTechnology} type='button'>
            Add
          </button>
        </div>
        <div>
          <label htmlFor='duration'>Duration: </label>
          <input type='number' name='duration' onChange={handleChange} />
        </div>
        <button onClick={handleSubmit}>Save</button>
      </form>
    </>
  )
}

export default PostedProject
