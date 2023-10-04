import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { useUser } from './UserContext'
import { errorMessages } from '../utils/ErrorMessages.js'

const AuthContext = React.createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const { setUser, user, setLoading } = useUser()

  useEffect(() => {
    defaultLogin()
    // eslint-disable-next-line
  }, [])

  const login = async ({ username, password, remember = false }) => {
    try {
      const { data } = await axios({
        method: 'POST',
        data: { username, password, remember },
        url: `${import.meta.env.VITE_SERVER_URL}/login`,
        withCredentials: true,
      })

      if (data.success) {
        setUser({ ...data.user._doc })
        return { success: true, user: data.user._doc }
      } else {
        return { success: false, message: data.message }
      }
    } catch (err) {
      return { success: false, message: errorMessages.SERVER_CONNECTION_ERROR }
    }
  }

  const register = async ({ name, username, password, type }) => {
    try {
      const { data } = await axios({
        method: 'POST',
        data: { name, username, password, type },
        url: `${import.meta.env.VITE_SERVER_URL}/register`,
        withCredentials: true,
      })

      console.log(data)

      if (data.success) {
        setUser({ ...data.user })
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (err) {
      return { success: false, message: errorMessages.SERVER_CONNECTION_ERROR }
    }
  }

  const logout = async () => {
    setUser(null)

    try {
      const response = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/logout`,
        withCredentials: true,
      })

      const { data } = response
      if (data.success) {
        console.log('User logged out successfully')
      } else {
        console.error(data.message)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const defaultLogin = async () => {
    if (user) {
      return
    }
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/user`,
        withCredentials: true,
      })

      if (data.success) {
        setUser(data.user)
      }
    } catch (err) {
      console.log('Logged in session expired/logged out')
    }

    setLoading(false)
  }

  const reset = async (password, token) => {
    try {
      const response = await axios({
        method: 'POST',
        data: {
          password: password,
          token: token,
        },
        url: `${import.meta.env.VITE_SERVER_URL}/reset`,
        withCredentials: true,
      })

      const data = response.data

      if (data.success) {
        setUser(null)
        await logout()
        return { success: true }
      } else {
        return { error: !data.success, message: data.message }
      }
    } catch (err) {
      return { error: true, message: errorMessages.SERVER_CONNECTION_ERROR }
    }
  }

  const value = { login, logout, reset, register }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
