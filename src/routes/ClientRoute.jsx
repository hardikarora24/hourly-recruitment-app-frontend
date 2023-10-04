import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const ClientRoute = () => {
  const { user } = useUser()

  return !user ? (
    <Navigate to='/login' />
  ) : user.type === 'Client' ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to='/' />
  )
}

export default ClientRoute
