import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const FreelancerRoute = () => {
  const { user } = useUser()

  return !user ? (
    <Navigate to='/login' />
  ) : user.type === 'Freelancer' ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to='/' />
  )
}

export default FreelancerRoute
