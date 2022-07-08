import React, {useState, useContext} from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
import api from '../services/api'


const Quote = ({quote, update, setUpdate}) => {
  const {currentUser,setCurrentUser} = useContext(UserContext);
  const [hideClass, setHideClass] = useState("hide");

  /********************************** Event Handlers************************************/
  const handleLike = () => {
    if(currentUser!==null){
      api.likeQuote(quote.quoteId)
      .then(response=>{
        quote.like=true;
        setUpdate(!update);
      })
    }
  }

  const handleUnlike = () => {
    if(currentUser!==null){
      api.unlikeQuote(quote.quoteId)
      .then(response=>{
        quote.like=false;
        setUpdate(!update);
      })
    }
  }

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

  /*********************************** Helper Functions ********************************/
  const changeFavoriteQuote = () =>{
    const quoteId = quote.quoteId;
    api.changeFavoriteQuote(quoteId).then(()=>{
      let user = JSON.parse(localStorage.getItem("user"));
      user.favoriteQuote={quoteId:quoteId, quote:quote.quote}
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      setUpdate(!update);
    })
  }


  /**************************************** JSX ****************************************/
  return (
    <div className='quote-main-container' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {
        quote!==null && quote!==undefined &&
        <div className='quote-container'>
            <div className='quote-info'>
              <p className='quote'>{quote.quote}</p>
              <div className='quote-source'>
                  <p className='book'>{quote.sourceTitle} <span className='source-type'>({quote.sourceType})</span></p>
                  <p className='source-author'>{quote.sourceAuthor}</p>
              </div>
            </div>

            <div className='likes-container'>
              {
                !quote.liked || quote.liked===false ?
                <div>
                  <i className={`fa-regular fa-heart heart-icon ${currentUser ? "pointer":""}`} onClick={handleLike}></i>
                  <span className='numberOfLikes'>{quote.likes}</span>
                </div>
                :
                <div>
                  <i className={`fa-solid fa-heart heart-icon ${currentUser ? "pointer":""}`} onClick={handleUnlike}></i>
                  <span className='numberOfLikes'>{quote.likes}</span>
              </div>
              }
              <Link className='added-by' to={`/profile/${quote.userId}`}>Added by: {quote.name}</Link>

            </div>

            <button className={`favoriteBtn ${hideClass}`} onClick={changeFavoriteQuote}>Make this your favourite quote</button>
        </div>
      }
    </div>
  )
}

export default Quote