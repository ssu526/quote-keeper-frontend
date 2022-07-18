import React, { useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { useContext } from 'react'
import RandomQuote from './RandomQuote';
import Quote from './Quote'
import api from '../services/api';

const Home = () => {
  const {currentUser, update} = useContext(UserContext);
  const [quotes, setQuotes] = useState([]);
  const [originalQuotes, setOriginalQuotes] = useState([]);
  const [randomQuote, setRandomQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Fetch all quotes
  useEffect(()=>{
    const ALL_QUOTES_API_URL = "http://localhost:8080/quotes/all";
    const fetchQuotes = async () => {
      try{
        const response = await fetch(ALL_QUOTES_API_URL);
        if(!response.ok) throw Error('Did not receive data');
        const quotes = await response.json();
        setQuotes(quotes);
        setOriginalQuotes(quotes);
        setFetchError(null);

        // If there's a logged in user, indicate the quotes that the user has already liked.
        if(currentUser){
          api.getUserQuotes(currentUser.userId)
          .then(response => {
            const userQuotes = response.data.map(quote => quote.quoteId);
            const allQuotes = quotes.map(quote => {
              const newQuote = userQuotes.includes(quote.quoteId) ? {...quote, liked:true} : {...quote, liked:false};
              return newQuote;
            })
            
            setQuotes(allQuotes);
            setOriginalQuotes(allQuotes);
            
          })
          .catch(err => {
            console.log(err.message)
          })
        }
      }catch(err){
        setFetchError(err.message);
      }finally{
        setIsLoading(false);
      }
    }

    fetchQuotes();

  },[update, currentUser]);

  // Fetch a random quote
  useEffect(()=>{
    api.getRandomQuote()
    .then(response=>{
      setRandomQuote(response.data);
    })
  },[])

  // Search quotes
  useEffect(()=>{
    let searchTextTrimmed = searchText.trim().toLocaleLowerCase();

    // let searchResult= originalQuotes.filter(quote => quote.quote.toLowerCase().includes(searchTextTrimmed));

    let searchResult_searchByQuote = originalQuotes.filter(quote => quote.quote.toLowerCase().includes(searchTextTrimmed));
    let searchResult_searchByTitle = originalQuotes.filter(quote => quote.sourceTitle.toLocaleLowerCase().includes(searchTextTrimmed));
    // let searchResult = [...searchResult_searchByQuote, ...searchResult_searchByTitle];
    let searchResult = new Set([...searchResult_searchByQuote, ...searchResult_searchByTitle]);

    if(searchText.trim()===""){
      setQuotes(originalQuotes);
    }else{
      setQuotes(Array.from(searchResult));
    }
  }, [searchText])


  return (
    <div className='main-container'>

        <RandomQuote randomQuote={randomQuote} setRandomQuote={setRandomQuote}/>

        <div className="search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder='Search quote...' value={searchText} onChange={e=>setSearchText(e.target.value)}/>
        </div>

        {isLoading && <p>Loading...</p>}
        {fetchError && <p>{`Error: ${fetchError}`}</p>}

        {
          !fetchError && !isLoading &&
          <div className='quotes-container'>
          {
              quotes.map(q=><Quote quote={q} key={q.quoteId}/>)
          }
        </div>  
        }  
  </div>
  )
}

export default Home