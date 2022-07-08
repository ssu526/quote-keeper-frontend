import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext'
import ProfileBanner from './ProfileBanner'
import Quote from './Quote'
import api from '../services/api'

const Profile = () => {
  const navigate = useNavigate();
  const params = useParams();

  /***************** States and handler for the add-quote form *****************/
  const [quoteInput, setQuoteInput] = useState("");
  const [sourceTitleInput, setSourceTitleInput] = useState("");
  const [sourceAuthorInput, setSourceAuthorInput] = useState("");
  const [sourceTypeInput, setSourceTypeInput] = useState("book");

  const handleAddQuote = (e) => {
    e.preventDefault();
    api.addQuote(quoteInput, sourceTypeInput, sourceTitleInput, sourceAuthorInput);
    setQuoteInput("");
    setSourceAuthorInput("");
    setSourceTitleInput("");
    setSourceTypeInput("");
  }

  /************************ States for user profile and user quotes *************/
  const {currentUser} = useContext(UserContext);

  const [userName, setUserName] = useState("");
  const [userFavoriteQuote, setUserFavoriteQuote] = useState("");
  const [userProfileUrl, setUserProfileUrl] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [update, setUpdate] = useState(false);  // This is used in the 'Quote' component. This is used to refresh the component after user like/unlike a quote

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
        <div className='profile-container '>
          <ProfileBanner userid={params.userid} userName={userName} userFavoriteQuote={userFavoriteQuote} userProfileUrl={userProfileUrl}/>

          {
            // If user is viewing her own profile, show the add-quote form
            params.userid===undefined ?
            <div className='add-quote-form'>
              <h1>Add Quote</h1>
              <form onSubmit={e=>handleAddQuote(e)}>
                <textarea placeholder='New Quote' value={quoteInput} onChange={e=>setQuoteInput(e.target.value)}/>
  
                <div className='add-quote-info-container'>
                  <input type="text" placeholder='Book/Movie Title' value={sourceTitleInput} onChange={e=>setSourceTitleInput(e.target.value)}/>
                  <input type="text" placeholder='Author/Character' value={sourceAuthorInput} onChange={e=>setSourceAuthorInput(e.target.value)}/>
  
                  <div className='selectType'>
                    <input type="radio" value="book" name='type' checked={sourceTypeInput=== "book"} onChange={()=>setSourceTypeInput("book")}/><span>Book</span>
                    <input type="radio" value="movie" name='type' checked={sourceTypeInput==="movie"} onChange={()=>setSourceTypeInput("movie")}/><span>Movie</span>
                  </div>
  
                  <button className='add-quote-btn'>Add Quote</button>
                </div>
              </form>
            </div>
            :
            <div></div>
          }

          <h1>My Quotes</h1>
          <div className='quotes-container'>
            {
                quotes.map(q=><Quote quote={q} update={update} setUpdate={setUpdate} key={q.quoteId}/>)
            }
          </div>
        </div>
      }
    </div>
  )
}

export default Profile