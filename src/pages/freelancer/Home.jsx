import { useEffect, useState } from 'react'
import axios from 'axios'
import Dashboard from '../../components/freelancer/Dashboard'

const Home = () => {
  const [earnings, setEarnings] = useState(0)
  const [error, setError] = useState('')

  const getEarnings = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/freelancer/earnings`,
        withCredentials: true,
      })

      if (data.success) {
        setEarnings(data.earnings)
      }
    } catch (e) {
      setError('Could not get earnings')
    }
  }

  useEffect(() => {
    getEarnings()
  }, [])

  return (
    <div className='home'>
      {error && <div className='error'>{error}</div>}
      <div className='earnings'>Total Earnings: {earnings}</div>
      <Dashboard />
    </div>
  )
}

export default Home
