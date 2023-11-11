import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import Navbar from '../components/Navbar'
import { USER_TYPES } from '../utils/Constants'

const AdminRoute = () => {
  const { user } = useUser()

  return !user ? (
    <Navigate to='/login' />
  ) : user.type === 'Admin' ? (
    <>
      <Navbar userRole={USER_TYPES.admin} />
      <Outlet />
    </>
  ) : (
    <Navigate to='/' />
  )
}

export default AdminRoute
