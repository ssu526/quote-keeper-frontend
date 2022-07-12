import React, { useEffect, useState } from 'react'
import api from '../services/api';

const RandomQuote = ({randomQuote, setRandomQuote}) => {
  const [quote, setQuote] = useState(randomQuote);

  const handleRandomQuoteClick = () => {
    api.getRandomQuote()
    .then(response=>{
      setRandomQuote(response.data);
    })
  }

  useEffect(()=>{
    setQuote(randomQuote);
  },[randomQuote]);

  return (
    <div className='randomQuote-container'>
        {
          quote ? 
          <div className='quote-info'>
            <p className='quote'>{quote.quote}</p>
            <div className='quote-source'>
                  <p className='source-type-title'>{quote.sourceType==='book' ? "Book":"Movie"}: </p>
                  <p className='source-type'>{quote.sourceTitle}</p>
                  <span className='source-author-title'>{quote.sourceType==='book' ? "Author":"Character"}: </span>
                  <p className='source-author'>{quote.sourceAuthor}</p>
              </div>
          </div>

          :
          <div></div>
        }
        <i className="fa-solid fa-arrows-rotate getRandomQuote" onClick={handleRandomQuoteClick}></i>
    </div>
  )
}

export default RandomQuote