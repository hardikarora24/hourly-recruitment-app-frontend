import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import Home from '../client/Home'

export default function Client() {
  const { logout } = useAuth()
  return (
    <>
      <Navbar userRole='Client' />
      <Home />
    </>
  )
}
