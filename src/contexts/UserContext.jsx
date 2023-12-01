import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [user, setUserState] = useState(undefined)
  const [loading, setLoading] = useState(true)

  const setUser = (user) => {
    localStorage.setItem('user_id', user._id)
    setUserState(user)
  }

  const logoutUser = () => {
    localStorage.setItem('user_id', '')
    setUserState(null)
  }

  const value = { user, setUser, loading, setLoading, logoutUser }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
