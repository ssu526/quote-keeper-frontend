import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext'
import api from '../services/api'
import authService from '../services/auth-service';
import ProfileBanner from './ProfileBanner'
import Quote from './Quote'

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const {currentUser, setCurrentUser, update} = useContext(UserContext);


  /************************* States for user profile and user quotes ****************/
  const [userName, setUserName] = useState("");
  const [userFavoriteQuote, setUserFavoriteQuote] = useState("");
  const [userProfileUrl, setUserProfileUrl] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [redirectToLoginPage, setRedirectToLoginPage] = useState(false);


  /************************* Fetch user data and user quotes ***************************/
  useEffect(() => {
    if(currentUser===null) navigate("/login");

    api.getUserQuotes(currentUser.userId)
    .then(response=>{
      const currentUserQuotes = response.data;
      setQuotes(currentUserQuotes.map(quote => {return {...quote, liked:true}}))
      setUserName(currentUser.name);
      setUserProfileUrl(currentUser.profileImageURL);
      if(currentUser.favoriteQuote) setUserFavoriteQuote(currentUser.favoriteQuote.quote);

      // If userid in the url param is not undefined, it means the current user is viewing another user's profile
      if(params.userid!==undefined){
        // Fetch the other's data
        api.getUserById(params.userid)
        .then(response => {
          const data = response.data;
          setUserName(data.name);
          setUserProfileUrl(data.profileImageUrl);
          if(data.favoriteQuote) setUserFavoriteQuote(data.favoriteQuote.quote);
        })
        .catch(e=>{throw e})

        // Fetch the other's quotes
        api.getUserQuotes(params.userid)
        .then(response =>{
          let otherUserQuotes = response.data;
          const currentUserQuotesId = currentUserQuotes.map(quote => quote.quoteId);

          // Indicate which quote the current user has liked among the other user's quotes
          const quotes = otherUserQuotes.map(quote =>{
            const newQuote = currentUserQuotesId.includes(quote.quoteId) ? {...quote, liked:true} : {...quote, liked:false};
            return newQuote;
          })
          setQuotes(quotes);
        })
        .catch(e=>{throw e})}
    })
    .catch(err=>{
      if(err.response.status===401 || err.response.status===403){
        setRedirectToLoginPage(true);
      }
    }); 
  },[update, params.userid, currentUser]);


  /*********** Redirect to login page if token expired *********/
  useEffect(()=>{
    if(redirectToLoginPage){
      navigate("/login");
      authService.logout();
      setCurrentUser(null);
    }
  },[redirectToLoginPage])

  
  return (
    // Only a logged in user can view her own profile and other users' profile
    <div className='main-container'>
      {
        currentUser!==null &&
        <div className='profile-container'>
            <ProfileBanner userid={params.userid} 
                            userName={userName} 
                            userFavoriteQuote={userFavoriteQuote} 
                            userProfileUrl={userProfileUrl}
                            setredirectToLoginPage={setRedirectToLoginPage}/>

            <h1>{params.userid===undefined || params.userid === currentUser.userId ? "My ":userName+"'s "} Quotes</h1>

            <div className='quotes-container'>
              {
                  quotes.map(q=><Quote key={q.quoteId} quote={q} setRedirectToLoginPage={setRedirectToLoginPage}/>)
              }
            </div>
        </div>
      }
    </div>
  )
}

export default Profile