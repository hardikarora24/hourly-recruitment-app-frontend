import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Register = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirmPassword: '',
    type: 'Client',
  })
  const [error, setError] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const { register } = useAuth()

  const isValidName = (name) => {
    if (name.length === 0) {
      setError((e) => ({ ...e, name: 'Name cannot be empty' }))
      return false
    }
    setError((e) => ({ ...e, name: '' }))
    return true
  }

  const isValidUsername = (username) => {
    if (username.length < 8) {
      setError((e) => ({
        ...e,
        username: 'Username should be at least 8 characters',
      }))
      return false
    }

    setError((e) => ({ ...e, username: '' }))
    return true
  }

  const isValidPassword = (password, confirmPassword) => {
    if (password.length < 8) {
      setError((e) => ({
        ...e,
        password: 'Password should be at least 8 characters',
      }))
      return false
    }

    let capital = false
    let number = false
    let specialCharacter = false
    const specialCharacters = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~'

    for (const c of password) {
      if (c === c.toUpperCase()) capital = true
      if (c >= '0' && c <= '9') number = true
      if (specialCharacters.includes(c)) specialCharacter = true
    }

    if (!capital) {
      setError((e) => ({
        ...e,
        password: 'Password should contain at least one capital letter',
      }))
      return false
    }
    if (!number) {
      setError((e) => ({
        ...e,
        password: 'Password should contain at least one number',
      }))
      return false
    }
    if (!specialCharacter) {
      setError((e) => ({
        ...e,
        password: 'Password should contain at least one special character',
      }))
      return false
    }
    setError((e) => ({ ...e, password: '' }))

    if (password !== confirmPassword) {
      setError((e) => ({ ...e, confirmPassword: 'Passwords should match' }))
      return false
    }

    setError((e) => ({ ...e, confirmPassword: '' }))
    return true
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !isValidName(form.name) ||
      !isValidUsername(form.username) ||
      !isValidPassword(form.password, form.confirmPassword)
    )
      return

    const data = await register({
      name: form.name,
      username: form.username,
      password: form.password,
      type: form.type,
    })

    if (data.success) {
      navigate('/login')
    } else {
      setError(data.message)
    }
  }

  return (
    <div>
      <form>
        <div>
          {error.name}
          <label htmlFor='name'>First Name: </label>
          <input type='text' name='first_name' onChange={handleChange} />
          <label htmlFor='name'> Last Name: </label>
          <input type='text' name='last_name' onChange={handleChange} />
        </div>
        <div>
          {error.username}
          <label htmlFor='username'>Username: </label>
          <input type='text' name='username' onChange={handleChange} />
        </div>
        <div>
          {error.password}
          <label htmlFor='password'>Password: </label>
          <input type='password' name='password' onChange={handleChange} />
        </div>
        <div>
          {error.confirmPassword}
          <label htmlFor='confirmPassword'>Confirm Password: </label>
          <input
            type='password'
            name='confirmPassword'
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='type'>Type: </label>
          <select name='type' onChange={handleChange}>
            <option value='Client'>Client</option>
            <option value='Freelancer'>Freelancer</option>
          </select>
        </div>
        <button onClick={handleSubmit}>Register</button>
        Already have an account? <Link to='/login'>Login</Link>
      </form>
    </div>
  )
}

export default Register
