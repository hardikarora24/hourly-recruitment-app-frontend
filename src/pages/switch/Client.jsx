import { useAuth } from '../../contexts/AuthContext'
import Home from '../client/Home'

export default function Client() {
  const { logout } = useAuth()
  return (
    <div>
      <Home />
      <button
        onClick={() => {
          logout()
        }}
      >
        logout
      </button>
    </div>
  )
}
