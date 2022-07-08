import React, { useState } from 'react'
import authService from '../services/auth-service';
import logotree from '../images/logotree.PNG'
import {Link} from 'react-router-dom'

const AuthSignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hideSuccessMessage, setHideSuccessMessage] = useState("hide");
    const [hideError, setHideError] = useState("hide");
    const [error, setError] = useState("");

    const handleRegister = (e) => {
      e.preventDefault();
      if(name.trim()==="" || email.trim()==="" || password.trim()===""){
        setError("All fields are required.");
        setHideError("");
      }else{
        authService.register(name, email, password)
        .then((response)=>{
          setHideSuccessMessage("");
        })
        .catch(err=>{
          setHideError("");
          setError(err.response.data.message);
        })

        setName("");
        setEmail("");
        setPassword("");
      }
    }

    const handleNameInputChange = e =>{
      setName(e.target.value);
      setError("");
      setHideSuccessMessage("hide");
      setHideError("hide");
    }

    const handleEmailInputChange = e =>{
      setEmail(e.target.value);
      setError("");
      setHideSuccessMessage("hide");
      setHideError("hide");
    }

    const handlePasswordInputChange = e =>{
      setPassword(e.target.value);
      setError("");
      setHideSuccessMessage("hide");
      setHideError("hide");
    }

  return (
    <div className='auth-form-container'>
      <div className={`registration-success ${hideSuccessMessage}`}>
          <p>Registered Successfully! Click <Link to="/login">here</Link> to log in.</p>
      </div>

      <div className={`auth-error ${hideError}`}>
          <p>{error}</p>
      </div>

      <div className='auth-form'>
          <div className='auth-form-title'>
            <img className="logo-tree" src={logotree} alt="logo"/>
            <h1>SIGN UP</h1>
          </div>

          <form onSubmit={e=>handleRegister(e)}>
              <label>Name</label>
              <input type="text" value={name} onChange={e=>handleNameInputChange(e)}/>
              <label>Email</label>
              <input type="text" value={email} onChange={e=>handleEmailInputChange(e)}/>
              <label>Password</label>
              <input type="text" value={password} onChange={e=>handlePasswordInputChange(e)}/>
              <button className='auth-button'>Register</button>
          </form>
      </div>
    </div>

  )
}

export default AuthSignUp