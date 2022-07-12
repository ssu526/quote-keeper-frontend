import React from 'react'
import { useState } from 'react';
import authService from '../services/auth-service';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext'
import { useContext } from 'react'
import logotree from '../images/logotree.PNG'

const AuthLogin = () => {
    let navigate = useNavigate();
    const {setCurrentUser} = useContext(UserContext)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [hideError, setHideError] = useState("hide");

    const handleEmailInputChange = e =>{
      setEmail(e.target.value);
      setError("");
      setHideError("hide");
    }

    const handlePasswordInputChange = e =>{
      setPassword(e.target.value);
      setError("");
      setHideError("hide");
    }

    const handleLogin = (e) => {
      e.preventDefault();

      if(email.trim()==="" || email.trim()===""){
        setError("All fields are required.");
        setHideError("");
      }else{
        authService.login(email, password).then(()=>{
          setCurrentUser(authService.getCurrentUser);
          navigate('/profile');
        })
        .catch(e=>{
          setHideError("");
          
          if(e.response.status===401){
            setError("Incorrect email or password.");
          }else{
            setError(e.message);
          }
        })
      }
    }

  return (
    <div className='auth-form-container'>
      <div className={`auth-error ${hideError}`}>
          <p>{error}</p>
      </div>

      <div className='auth-form'>
          <div className='auth-form-title'>
            <img className="logo-tree" src={logotree} alt="logo"/>
            <h1>LOGIN</h1>
          </div>
          <form onSubmit={(e=>handleLogin(e))}>
              <label>Email</label>
              <input type="email" value={email} onChange={e=>handleEmailInputChange(e)}/>
              <label>Password</label>
              <input type="password" value={password} onChange={e=>handlePasswordInputChange(e)}/>
              <button className='auth-button'>Login</button>
          </form>
      </div>
    </div>

  )
}

export default AuthLogin