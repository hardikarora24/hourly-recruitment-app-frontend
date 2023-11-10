import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import Loading from '../../components/Loading'

const FreelancerProfile = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [freelancer, setFreelancer] = useState()
  const [loading, setLoading] = useState(true)

  const getFreelancer = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/client/freelancer?id=${queryParams.get('id')}`,
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

  useEffect(() => {
    getFreelancer()
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <div className='freelancer-profile'>
      <h2>
        {freelancer.first_name} {freelancer.last_name}
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
    </div>
  )
}

export default FreelancerProfile
