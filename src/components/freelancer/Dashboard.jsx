import { Fragment, useEffect, useState } from 'react'
import Loading from '../Loading'
import Modal from '../Modal'
import Project from './Project'
import { useUser } from '../../contexts/UserContext'
import { PROJECT_STATUS } from '../../utils/Constants'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])

  const [error, setError] = useState('')

  const [submitModal, setSubmitModal] = useState(false)
  const [bidModal, setBidModal] = useState(false)

  const getProjects = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/freelancer/projects?id=${
          user._id
        }`,
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
  useEffect(() => {
    getProjects()
  }, [user])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className='dashboard'>
          <span>{error}</span>
          <div className='projects'>
            <div className='left'>
              <div className='heading'>Projects</div>
              {projects
                .filter((p) => p.status === PROJECT_STATUS.posted)
                .map((p, idx) => {
                  return (
                    <Project
                      key={`project-${idx}`}
                      project={p}
                      setShowModal={setBidModal}
                      bidModal={bidModal}
                    />
                  )
                })}
            </div>
            <div className='middle'>
              <div className='heading'>Current Projects</div>
              {projects
                .filter(
                  (p) =>
                    p.freelancerId === user._id &&
                    p.status !== PROJECT_STATUS.approved
                )
                .map((p, idx) => {
                  return (
                    <Fragment key={`current-project-${idx}`}>
                      <Modal
                        showModal={submitModal}
                        setShowModal={setSubmitModal}
                      >
                        <SubmitForm
                          setShowModal={setSubmitModal}
                          projectId={p._id}
                          clientId={p.clientId}
                          id={user._id}
                        />
                      </Modal>
                      <Project project={p} setShowModal={setSubmitModal} />
                    </Fragment>
                  )
                })}
            </div>
            <div className='right'>
              <div className='heading'>Approved Projects</div>
              {projects
                .filter(
                  (p) =>
                    p.freelancerId === user._id &&
                    p.status === PROJECT_STATUS.approved
                )
                .map((p, idx) => {
                  return (
                    <Project key={`approved-projects-${idx}`} project={p} />
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const SubmitForm = ({ setShowModal, projectId, clientId, id }) => {
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    sourceCodeUrl: '',
    demoUrl: '',
    hostedUrl: '',
  })

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/freelancer/submit`,
        data: { id, submission: { ...form, projectId }, clientId },
        withCredentials: true,
      })

      if (data.success) {
        setShowModal(false)
      }
    } catch (e) {
      setError('Could not submit')
    }
  }

  return (
    <form className='submit'>
      {error && <div className='error'>{error}</div>}
      <div className='group'>
        <label htmlFor='sourceCodeUrl'>Source Code URL: </label>
        <input name='sourceCodeUrl' type='url' onChange={handleChange} />
      </div>
      <div className='group'>
        <label htmlFor='demoUrl'>Demo Video URL: </label>
        <input name='demoUrl' type='url' onChange={handleChange} />
      </div>
      <div className='group'>
        <label htmlFor='hostedUrl'>Hosted Project URL: </label>
        <input name='hostedUrl' type='url' onChange={handleChange} />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </form>
  )
}

export default Dashboard
