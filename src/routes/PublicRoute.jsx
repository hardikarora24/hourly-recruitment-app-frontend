import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const PublicRoute = () => {
  const { user } = useUser()

  return user ? (
    user.type === 'Admin' ? (
      <Navigate to='/a' />
    ) : user.type === 'Client' ? (
      <Navigate to='/c' />
    ) : (
      <Navigate to='/f' />
    )
  ) : (
    <Outlet />
  )
}

export default PublicRoute
