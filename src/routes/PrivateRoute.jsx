import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

const PublicRoute = () => {
  const { user } = useUser()

  return user ? <Outlet /> : <Navigate to='/login' />
}

export default PublicRoute
