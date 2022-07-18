import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext'
import ProfileBanner from './ProfileBanner'
import Quote from './Quote'
import api from '../services/api'

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();

  /************************ States for user profile and user quotes *************/
  const {currentUser, update} = useContext(UserContext);

  const [userName, setUserName] = useState("");
  const [userFavoriteQuote, setUserFavoriteQuote] = useState("");
  const [userProfileUrl, setUserProfileUrl] = useState("");
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    if(currentUser===null){navigate("/login");}

    if(params.userid!==undefined){
      api.getUserById(params.userid)
      .then(response => {
        const data = response.data;
        setUserName(data.name);
        setUserProfileUrl(data.profileImageUrl);
        if(data.favoriteQuote) setUserFavoriteQuote(data.favoriteQuote.quote);
      });  
    }else{
      setUserName(currentUser.name);
      setUserProfileUrl(currentUser.profileImageURL);
      if(currentUser.favoriteQuote) setUserFavoriteQuote(currentUser.favoriteQuote.quote);
    }

    api.getUserQuotes(currentUser.userId)
    .then(response=>{
      const currentUserQuotes = response.data;
      setQuotes(currentUserQuotes.map(quote => {return {...quote, liked:true}}))

      if(params.userid!==undefined){
        api.getUserQuotes(params.userid)
        .then(response =>{
          let otherUserQuotes = response.data;
          const currentUserQuotesId = currentUserQuotes.map(quote => quote.quoteId);

          const quotes = otherUserQuotes.map(quote =>{
            const newQuote = currentUserQuotesId.includes(quote.quoteId) ? {...quote, liked:true} : {...quote, liked:false};
            return newQuote;
          })

          setQuotes(quotes);

        })
      }
    })

  },[update, params.userid]);


  /************************************ JSX *************************************/
  return (
    // Only a logged in user can view her own profile or other's profile
    <div>
      {
        currentUser!==null &&
        <div className='profile-container main-container'>
            <ProfileBanner userid={params.userid} 
                            userName={userName} 
                            userFavoriteQuote={userFavoriteQuote} 
                            userProfileUrl={userProfileUrl}/>

            <h1>My Quotes</h1>
            <div className='quotes-container'>
              {
                  quotes.map(q=><Quote quote={q} key={q.quoteId}/>)
              }
            </div>
        </div>
      }
    </div>
  )
}

export default Profile