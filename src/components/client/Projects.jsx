import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useUser } from '../../contexts/UserContext'
import Loading from '../Loading'
import Modal from '../Modal'
import { PROJECT_STATUS } from '../../utils/Constants'
import PostedProject from './PostedProject'
import ProjectDetails from './ProjectDetails'
import CompletedProject from './CompletedProject'

import DeleteIcon from '../../assets/delete.svg'

const Projects = () => {
  const { user } = useUser()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [submissions, setSubmissions] = useState([])

  const [showModal, setShowModal] = useState(false)

  const getProjects = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/client/projects`,
        withCredentials: true,
      })

      if (data.success) {
        setProjects(data.projects)
        setLoading(false)
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  const getSubmissions = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/client/submissions`,
        withCredentials: true,
      })

      if (data.success) {
        setSubmissions(data.submissions)
        setLoading(false)
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProjects()
    getSubmissions()
  }, [user])

  return (
    <>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <AddProjectForm setShowModal={setShowModal} getProjects={getProjects} />
      </Modal>
      {loading ? (
        <Loading />
      ) : (
        <div className='projects'>
          <div className='left'>
            <span>{error}</span>
            <div className='heading'>Posted Proects</div>
            <div>
              {projects
                .filter((p) => p.status === PROJECT_STATUS.posted)
                .map((p, idx) => {
                  return (
                    <PostedProject
                      key={`posted-project-${idx}`}
                      project={p}
                      getProjects={getProjects}
                    />
                  )
                })}
            </div>

            <button
              onClick={() => {
                setShowModal(true)
              }}
            >
              Add Project
            </button>
          </div>
          <div className='middle'>
            <div className='heading'>Current Projects</div>
            <div>
              {projects
                .filter((p) => p.status === PROJECT_STATUS.inProgress)
                .map((p, idx) => {
                  return (
                    <ProjectDetails
                      key={`project-details-${idx}`}
                      project={p}
                    />
                  )
                })}
            </div>
          </div>
          <div className='right'>
            <div className='top'>
              <div className='heading'>Completed Projects</div>
              <div>
                {projects
                  .filter((p) => p.status === PROJECT_STATUS.completed)
                  .map((p, idx) => {
                    return (
                      <CompletedProject
                        key={`completed-project-${idx}`}
                        project={p}
                        submission={submissions.find(
                          (s) => s.projectId === p._id
                        )}
                        getProjects={getProjects}
                      />
                    )
                  })}
              </div>
            </div>
            <div className='bottom'>
              <div className='heading'>Approved Projects</div>
              <div>
                {projects
                  .filter((p) => p.status === PROJECT_STATUS.approved)
                  .map((p, idx) => {
                    return (
                      <CompletedProject
                        key={`completed-project-${idx}`}
                        project={p}
                        submission={submissions.find(
                          (s) => s.projectId === p._id
                        )}
                      />
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const AddProjectForm = ({ setShowModal, getProjects }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    technologies: [],
    duration: 0,
  })

  const technologyInputRef = useRef()

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const addTechnology = (e) => {
    setForm((f) => ({
      ...f,
      technologies: [...f.technologies, technologyInputRef.current.value],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/client/add-project`,
        data: { project: { ...form } },
        withCredentials: true,
      })

      if (data.success) {
        setShowModal(false)
        getProjects()
      }
    } catch (e) {}
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
        <div className='technologies'>
          {form.technologies.map((t, idx) => {
            return (
              <div className='technology' key={`tech-${idx}`}>
                {t}{' '}
                <img
                  onClick={() => {
                    deleteTechnology(idx)
                  }}
                  src={DeleteIcon}
                  alt='delete'
                />
              </div>
            )
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
        <button onClick={handleSubmit}>Add</button>
      </form>
    </>
  )
}

export default Projects
