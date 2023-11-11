import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Loading from '../components/Loading'
import { USER_TYPES } from '../utils/Constants'
import { useUser } from '../contexts/UserContext'
import ProjectList from '../components/admin/ProjectList'

const FreelancerProfile = () => {
  const { user } = useUser()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [freelancer, setFreelancer] = useState()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  const getFreelancer = async () => {
    setLoading(true)
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/${
          user.type === USER_TYPES.admin ? 'admin' : 'client'
        }/freelancer?id=${queryParams.get('id')}`,
        withCredentials: true,
      })

      if (data.success) {
        setFreelancer(data.freelancer)
        setLoading(false)
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  const getProjects = async () => {
    setLoading(true)
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/${
          user.type === USER_TYPES.admin ? 'admin' : 'client'
        }/projects?id=${queryParams.get('id')}`,
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
    getFreelancer()
    getProjects()
  }, [])

  return !projects || !freelancer || loading ? (
    <Loading />
  ) : (
    <div className='freelancer-profile'>
      <h2>
        Freelancer: {freelancer.first_name} {freelancer.last_name}
      </h2>
      <p>Completed Projects: {freelancer.completedProjects}</p>
      <div className='skills'>
        <h3>Skills:</h3>
        <ul>
          {freelancer.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <ProjectList projects={projects} />
    </div>
  )
}

export default FreelancerProfile
