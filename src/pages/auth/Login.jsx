import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { USER_TYPES } from '../../utils/Constants'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const { login } = useAuth()

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = await login({
      username: form.username,
      password: form.password,
    })

    setForm({ username: '', password: '' })

    if (!data.success) {
      setError('Entered email and/or password are incorrect!')
    } else {
      if (data.user.type === USER_TYPES.admin) {
        navigate('/a')
      } else if (data.user.type === USER_TYPES.client) {
        navigate('/c')
      } else if (data.user.type === USER_TYPES.freelancer) {
        navigate('/f')
      }
    }
  }

  return (
    <div>
      <form>
        <div>
          <label htmlFor='username'>Username: </label>
          <input type='text' name='username' onChange={handleChange} />
        </div>
        <div>
          <label htmlFor='password'>Password: </label>
          <input type='password' name='password' onChange={handleChange} />
        </div>
        <button onClick={handleSubmit}>Login</button>
        Don't have an account? <Link to='/register'>Register</Link> now
      </form>
    </div>
  )
}

export default Login
