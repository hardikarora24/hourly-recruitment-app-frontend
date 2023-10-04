import { useAuth } from '../../contexts/AuthContext'

export default function Client() {
  const { logout } = useAuth()
  return (
    <div>
      Client
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
