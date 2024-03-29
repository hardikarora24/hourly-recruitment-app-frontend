import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { USER_TYPES } from '../utils/Constants'

const Navbar = ({ userRole }) => {
  const { logout } = useAuth()
  return (
    <nav className='navbar'>
      <div className='nav-container'>
        <div className='left-section'>
          <Link to='/' className='logo'>
            Hourly Recruitment
          </Link>
          <span className='user-role'>Role: {userRole}</span>
        </div>
        <div className='right-section'>
          {userRole !== USER_TYPES.admin && (
            <Link className='link' to='/profile'>
              Profile
            </Link>
          )}{' '}
          <button onClick={logout} className='logout-button'>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
