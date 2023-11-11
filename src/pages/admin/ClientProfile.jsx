import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Loading from '../../components/Loading'
import ProjectList from '../../components/admin/ProjectList'

const ClientProfile = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [client, setClient] = useState()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])

  const getClient = async () => {
    setLoading(true)
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/admin/client?id=${queryParams.get('id')}`,
        withCredentials: true,
      })

      if (data.success) {
        setClient(data.client)
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
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/admin/projects?id=${queryParams.get('id')}`,
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
    getClient()
    getProjects()
  }, [])

  const deleteProject = async () => {}

  return loading || !client || !projects ? (
    <Loading />
  ) : (
    <div className='client-profile'>
      <h2>
        Client: {client.first_name} {client.last_name}
      </h2>
      <ProjectList projects={projects} deleteProject={deleteProject} />
    </div>
  )
}

export default ClientProfile
