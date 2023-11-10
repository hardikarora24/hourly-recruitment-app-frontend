import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import Navbar from '../components/Navbar'
import { USER_TYPES } from '../utils/Constants'

const FreelancerRoute = () => {
  const { user } = useUser()

  return !user ? (
    <Navigate to='/login' />
  ) : user.type === 'Freelancer' ? (
    <>
      <Navbar userRole={USER_TYPES.freelancer} />
      <Outlet />
    </>
  ) : (
    <Navigate to='/' />
  )
}

export default FreelancerRoute
