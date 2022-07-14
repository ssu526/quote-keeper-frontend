import React from 'react'
import { useContext, useCallback, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { useDropzone } from 'react-dropzone'
import profile_placeholder from '../images/profile_placeholder.png'
import api from '../services/api'

const ProfileBanner = ({userName, userFavoriteQuote, userProfileUrl, userid, update, setUpdate}) => {
  const {currentUser, setCurrentUser} = useContext(UserContext);
  const [hideUpload, setHideUpload] = useState("hide");
  const [uploadMessage, setUploadMessage] = useState("");
  const [hideUploadMessage, setHideUploadMessage] = useState("hide");

/********************** PROFILE PHOTO: DRAG & DROP, UPLOAD to AWS S3 ******************/
  const handleMouseEnter= () =>{
    if(currentUser){
      setHideUpload("")
    }
  }

  const handleMouseLeave= () =>{
    if(currentUser){
      setHideUpload("hide")
    }
  }

  const removeFavoriteQuote = () =>{
    api.changeFavoriteQuote(-1).then(()=>{
      let user = JSON.parse(localStorage.getItem("user"));
      user.favoriteQuote={quoteId:-1, quote:""}
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      setUpdate(!update);
    })
  }

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file);

    setHideUpload("hide");
    setUploadMessage("Uploading...");
    setHideUploadMessage("upload-in-progress");

    api.uploadProfileImage(formData)
    .then(()=>{
      setUploadMessage("Profile picture uploaded successfully. Please login again.");
      setHideUploadMessage("upload-ok");

      setTimeout(()=>{
        setUploadMessage("");
        setHideUploadMessage("hide")
      },3000);
    })
    .catch( e => {
      setUploadMessage("Upload failed.");
      setHideUploadMessage("upload-error");

      setTimeout(()=>{
        setUploadMessage("");
        setHideUploadMessage("hide")
      },3000);
    })
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
              <div className={`upload ${hideUpload}`} {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Click here to select files</p>
              </div>
            }
          <p className='username'>{userName}</p>
          <p className={`upload-message-container ${hideUploadMessage}`}>{uploadMessage}</p>
        </div>

        {
          userFavoriteQuote==="" ?
          <div></div>
          :
          <div className='favorite-quote'>
            <p>{userFavoriteQuote}</p>
            <p className='removeFavoriteQuote' onClick={removeFavoriteQuote}><i className="fa fa-trash"></i></p>
        </div>
        }
    </div>
  )
}

export default ProfileBanner
