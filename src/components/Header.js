import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import logo from '../images/logo.PNG'
import authService from '../services/auth-service'

const Header = () => {
  const {currentUser, setCurrentUser, setHideAddEditQuoteForm} = useContext(UserContext);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  }

  if(!currentUser){
    document.title = "Quote Keeper";
  }else{
    document.title = "Quote Keeper - " + currentUser.name;
  }

  return (
    <div className='header'>
        <Link to="/"><img className="header-logo" src={logo} alt='logo'/></Link>
        {
            !currentUser && 
              <div className='auth-container'>
                <a href='/signup' className='header-link'>Sign Up</a>
                <a href='/login' className='header-link'>Login</a>
              </div>
          }

          {
            currentUser &&
              <div className='auth-container'>
                <Link to="/profile" className='header-link'>My Account</Link>
                <button onClick={()=>setHideAddEditQuoteForm("")} className='header-link'>New Quote</button>
                <Link to="/" onClick={handleLogout} className='header-link'>Logout</Link>
              </div>
          }
    </div>
  )
}

export default Header