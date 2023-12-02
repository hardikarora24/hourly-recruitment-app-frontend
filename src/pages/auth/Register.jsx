import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { USER_TYPES } from '../../utils/Constants'
import DeleteIcon from '../../assets/delete.svg'

const DEFAULT_FORM = {
  first_name: '',
  last_name: '',
  username: '',
  password: '',
  confirmPassword: '',
  type: 'Client',
  skills: [],
}

const Register = () => {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [error, setError] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const skillsInputRef = useRef()

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
    if (e.target.name === 'type') {
      setForm({ ...DEFAULT_FORM, type: e.target.value })
    } else {
      setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    }
  }

  const addSkill = (e) => {
    const value = skillsInputRef.current.value
    setForm((f) => ({
      ...f,
      skills: [...f.skills, value],
    }))

    skillsInputRef.current.value = ''
  }

  const deleteSkill = (i) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.filter((s, idx) => idx !== i),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !isValidName(form.first_name) ||
      !isValidName(form.last_name) ||
      !isValidUsername(form.username) ||
      !isValidPassword(form.password, form.confirmPassword)
    )
      return

    const data = await register({
      first_name: form.first_name,
      last_name: form.last_name,
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
    <div className='register'>
      <h1>Hourly Recruitment</h1>
      <form className='register-form'>
        <div className='group'>
          <label htmlFor='type'>Type</label>
          <select id='type' name='type' onChange={handleChange}>
            <option value={USER_TYPES.client}>{USER_TYPES.client}</option>
            <option value={USER_TYPES.freelancer}>
              {USER_TYPES.freelancer}
            </option>
          </select>
        </div>
        <div className='group'>
          {error.name}
          <label htmlFor='name'>First Name: </label>
          <input
            type='text'
            name='first_name'
            id='first_name'
            value={form.first_name}
            onChange={handleChange}
          />
          <label htmlFor='name'> Last Name: </label>
          <input
            type='text'
            name='last_name'
            id='last_name'
            onChange={handleChange}
          />
        </div>
        <div className='group'>
          {error.username}
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            name='username'
            id='username'
            onChange={handleChange}
            value={form.last_name}
          />
        </div>
        <div className='group'>
          {error.password}
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            onChange={handleChange}
            value={form.password}
          />
        </div>
        <div className='group'>
          {error.confirmPassword}
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            type='password'
            name='confirmPassword'
            id='confirmPassword'
            onChange={handleChange}
            value={form.confirmPassword}
          />
        </div>
        {form.type === USER_TYPES.freelancer && (
          <div className='group'>
            {form.skills.map((s, idx) => {
              return (
                <div key={idx} className='skill'>
                  {s}{' '}
                  <img
                    onClick={() => {
                      deleteSkill(idx)
                    }}
                    src={DeleteIcon}
                    alt='delete'
                  />
                </div>
              )
            })}
            <label htmlFor='skills'>Skills: </label>
            <input ref={skillsInputRef} type='text' name='technologies' />
            <button onClick={addSkill} type='button'>
              Add
            </button>
          </div>
        )}
        <button onClick={handleSubmit}>Register</button>
        <div className='prompt'>
          Already have an account? <Link to='/login'>Login</Link>
        </div>
      </form>
    </div>
  )
}

export default Register
