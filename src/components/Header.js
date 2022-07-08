import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import logo from '../images/logo.PNG'
import authService from '../services/auth-service'

const Header = () => {
  const {currentUser, setCurrentUser} = useContext(UserContext);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  }

  return (
    <div className='header'>
        <Link to="/"><img className="header-logo" src={logo} alt='logo'/></Link>
        {
            !currentUser && 
              <div className='auth-container'>
                <a href='/signup'>Sign Up</a>
                <a href='/login'>Login</a>
              </div>
          }

          {
            currentUser &&
              <div className='auth-container'>
                <Link to="/profile">My Account</Link>
                <Link to="/" onClick={handleLogout}>Logout</Link>
              </div>
          }
    </div>
  )
}

export default Header