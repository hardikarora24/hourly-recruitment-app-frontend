import { useState, useEffect } from 'react'
import axios from 'axios'
import Loading from '../../components/Loading.jsx'
import DeleteIcon from '../../assets/delete.svg'
import { PROJECT_STATUS } from '../../utils/Constants.js'
import { Link } from 'react-router-dom'
import ProjectList from '../../components/admin/ProjectList.jsx'

const Home = () => {
  const [clients, setClients] = useState([])
  const [freelancers, setFreelancers] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const { data: usersData } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/admin/users`,
        withCredentials: true,
      })

      if (usersData.success) {
        setClients(usersData.clients)
        setFreelancers(usersData.freelancers)
      }

      const { data: projectsData } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/admin/projects`,
        withCredentials: true,
      })

      if (projectsData.success) {
        setProjects(projectsData.projects)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const deleteClient = async (id) => {
    setLoading(true)
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/admin/delete-client`,
        data: { id },
        withCredentials: true,
      })

      if (data.success) {
        setLoading(false)
        fetchData()
      }
    } catch (e) {
      setLoading(false)
    }
  }

  const deleteFreelancer = async (id) => {
    setLoading(true)
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/admin/delete-freelancer`,
        data: { id },
        withCredentials: true,
      })

      if (data.success) {
        setLoading(false)
        fetchData()
      }
    } catch (e) {
      setLoading(false)
    }
  }

  const deleteProject = async (id) => {
    setLoading(true)
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/admin/delete-project`,
        data: { id },
        withCredentials: true,
      })

      if (data.success) {
        setLoading(false)
        setProjects((projects) => projects.filter((p) => p._id !== id))
      }
    } catch (e) {
      setLoading(false)
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <div className='list-display'>
      <div className='column'>
        <h2>Clients</h2>
        <ul>
          {clients.map((client) => (
            <li key={client._id}>
              {client.first_name} {client.last_name}
              <img
                src={DeleteIcon}
                alt='delete'
                onClick={() => handleDeleteClient(client.id)}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className='column'>
        <h2>Freelancers</h2>
        <ul>
          {freelancers.map((freelancer) => (
            <li key={freelancer._id}>
              {freelancer.first_name} {freelancer.last_name}
              <img
                src={DeleteIcon}
                alt='delete'
                onClick={() => handleDeleteFreelancer(freelancer.id)}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className='column'>
        <h2>Projects</h2>
        <ProjectList projects={projects} deleteProject={deleteProject} />
      </div>
    </div>
  )
}

export default Home
