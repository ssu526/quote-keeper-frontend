import React, {useState, useContext, useEffect} from 'react'
import { UserContext } from '../context/UserContext'
import { Link } from 'react-router-dom'
import api from '../services/api'

const Quote = ({quote, setRedirectToLoginPage}) => {
  const {currentUser,setCurrentUser, setHideAddEditQuoteForm, setEditQuote, update, setUpdate} = useContext(UserContext);
  const [hideClass, setHideClass] = useState("hide");

  useEffect(()=>{
    if(currentUser===null){
      setHideClass("hide");
    }
  },[currentUser])

  /********************************** Event Handlers************************************/
  const handleLike = () => {
    if(currentUser!==null){
      api.likeQuote(quote.quoteId)
      .then(()=>{
          quote.like=true;
          setUpdate(!update);
      })
      .catch(e=>{
        if(e.response.status===403){
          setRedirectToLoginPage(true);
        }
      })
    }
  }

  const handleUnlike = () => {
    if(currentUser!==null){
      api.unlikeQuote(quote.quoteId)
      .then(()=>{
        quote.like=false;
        setUpdate(!update);
      })
      .catch(e=>{
        if(e.response.status===403){
          setRedirectToLoginPage(true);
        }
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

  const handleEditButton = () => {
    setHideAddEditQuoteForm("");
    setEditQuote(quote);
  }

  /*********************************** Helper Functions ********************************/
  const changeFavoriteQuote = () =>{
    const quoteId = quote.quoteId;
    api.changeFavoriteQuote(quoteId)
    .then(()=>{
      let user = JSON.parse(localStorage.getItem("user"));
      user.favoriteQuote={quoteId:quoteId, quote:quote.quote}
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      setUpdate(!update);
    })
    .catch(e=>{
      if(e.response.status===403){
        setRedirectToLoginPage(true);
      }
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
                  <p className='source-type-title'>{quote.sourceType==='book' ? "Book":"Movie"}: </p>
                  <p className='source-type'>{quote.sourceTitle}</p>
                  <span className='source-author-title'>{quote.sourceType==='book' ? "Author":"Character"}: </span>
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
            </div>

            <div className={`quote-operations ${hideClass}`}>
              <button className="favoriteBtn" onClick={changeFavoriteQuote}>Make it your favourite quote</button>
              <button className="editQuoteBtn" onClick={handleEditButton}>Edit Quote</button>
              <Link className="added-by" to={`/profile/${quote.userId}`}>Added by: {quote.name}</Link>
            </div>
        </div>
      }
    </div>
  )
}

export default Quote