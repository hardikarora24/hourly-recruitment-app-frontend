import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const AdminRoute = () => {
  const { user } = useUser()

  return !user ? (
    <Navigate to='/login' />
  ) : user.type === 'Admin' ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to='/' />
  )
}

export default AdminRoute
