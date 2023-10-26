import { useState, useEffect } from 'react'
import axios from 'axios'

import Project from './Project'
import Loading from '../Loading'
import { useUser } from '../../contexts/UserContext'
import Modal from '../Modal'

const Projects = () => {
  const { user } = useUser()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)

  const getProjects = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/freelancer/projects`,
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
      {loading ? (
        <Loading />
      ) : (
        <div>
          <span>{error}</span>
          <div>
            {projects.map((p) => {
              return (
                <>
                  <Modal showModal={showModal} setShowModal={setShowModal}>
                    <BidForm
                      setShowModal={setShowModal}
                      projectId={p._id}
                      clientId={p.clientId}
                    />
                  </Modal>
                  <Project project={p} setShowModal={setShowModal} />
                </>
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
      )}
    </>
  )
}

const BidForm = ({ projectId, clientId }) => {
  const [rate, setRate] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault()

    axios({
      method: 'POST',
      url: `${import.meta.env.VITE_SERVER_URL}/freelancer/bid`,
      data: { projectId, clientId, rate },
      withCredentials: true,
    })
  }

  return (
    <form>
      <div className='group'>
        <label htmlFor='rate'>Rate: </label>
        <input
          type='number'
          onChange={(e) => {
            setRate(e.target.value)
          }}
        />
      </div>
      <button onClick={handleSubmit}>Bid</button>
    </form>
  )
}

export default Projects
