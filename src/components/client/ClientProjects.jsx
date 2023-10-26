import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useUser } from '../../contexts/UserContext'
import Loading from '../Loading'
import Project from './Project'
import Modal from '../Modal'

const ClientProjects = () => {
  const { user } = useUser()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      console.log(e)
      setError('No projects')
      setLoading(false)
    }
  }

  useEffect(() => {
    getProjects()
  }, [user])

  return (
    <>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <AddProjectForm setShowModal={setShowModal} />
      </Modal>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <span>{error}</span>
          <div>
            {projects.map((p) => {
              return <Project project={p} />
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
      )}
    </>
  )
}

const AddProjectForm = ({ setShowModal }) => {
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
        <button onClick={handleSubmit}>Add</button>
      </form>
    </>
  )
}

export default ClientProjects
