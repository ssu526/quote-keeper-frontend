import React from 'react'
import { useContext, useCallback, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { useDropzone } from 'react-dropzone'
import profile_placeholder from '../images/profile_placeholder.png'
import api from '../services/api'

const ProfileBanner = ({userName, userFavoriteQuote, userProfileUrl, userid}) => {
  const {currentUser} = useContext(UserContext);
  const [hideClass, setHideClass] = useState("hide");

/********************** PROFILE PHOTO: DRAG & DROP, UPLOAD to AWS S3 ******************/
  const handleMouseEnter= () =>{
    if(currentUser){
      setHideClass("")
    }
  }

  const handleMouseLeave= () =>{
    if(currentUser){
      setHideClass("hide")
    }
  }


  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);
    api.uploadProfileImage(formData);
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop})


/**************************************** JSX ****************************************/
  return (
    <div className='profile-banner'>
        <div className='user-info-container' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img 
            src={userProfileUrl==="" || userProfileUrl===null ? profile_placeholder : userProfileUrl} 
            className='profile-image' 
            alt='profile'/>

            {
              userid!==undefined && userid !== currentUser.userId ?
              <div ></div>
              :
              <div className={`upload ${hideClass}`} {...getRootProps()}>
                <input {...getInputProps()} />
                <p>click to select files</p>
              </div>
            }

          <p className='username'>{userName}</p>
        </div>

        <div className='favorite-quote'>
            <p>{userFavoriteQuote}</p>
        </div>
    </div>
  )
}

export default ProfileBanner
