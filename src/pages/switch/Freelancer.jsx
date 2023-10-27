import Home from '../freelancer/Home'
import { useAuth } from '../../contexts/AuthContext'

export default function Freelancer() {
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
