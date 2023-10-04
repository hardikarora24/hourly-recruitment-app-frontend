import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { AuthProvider } from './contexts/AuthContext'

import PublicRoute from './routes/PublicRoute'
import AdminRoute from './routes/AdminRoute'
import ClientRoute from './routes/ClientRoute'
import FreelancerRoute from './routes/FreelancerRoute'

import Admin from './pages/switch/Admin'
import Client from './pages/switch/Client'
import Freelancer from './pages/switch/Freelancer'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import './styles/styles.scss'

function App() {
  return (
    <>
      <Router>
        <UserProvider>
          <AuthProvider>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Route>
              <Route path='/a' element={<AdminRoute />}>
                <Route path='/a' element={<Admin />} />
              </Route>
              <Route path='/c' element={<ClientRoute />}>
                <Route path='/c' element={<Client />} />
              </Route>
              <Route path='/f' element={<FreelancerRoute />}>
                <Route path='/f' element={<Freelancer />} />
              </Route>
              <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
          </AuthProvider>
        </UserProvider>
      </Router>
    </>
  )
}

export default App
