import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import Navbar from '../components/Navbar'
import { USER_TYPES } from '../utils/Constants'

const ClientRoute = () => {
  const location = useLocation()
  const { user } = useUser()

  return !user ? (
    <Navigate to='/login' />
  ) : user.type === 'Client' ? (
    <>
      <Navbar userRole={USER_TYPES.client} />
      <Outlet />
    </>
  ) : (
    <Navigate to='/' />
  )
}

export default ClientRoute
