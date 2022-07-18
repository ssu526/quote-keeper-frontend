import React, {useState} from 'react'
import api from '../services/api'
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';
import { useEffect } from 'react';

const AddEditQuoteForm = () => {
    const {hideAddEditQuoteForm, setHideAddEditQuoteForm, editQuote, setEditQuote, update, setUpdate} = useContext(UserContext);

    /***************** States and handler for the add-quote form *****************/
    const [quoteInput, setQuoteInput] = useState("");
    const [sourceTitleInput, setSourceTitleInput] = useState("");
    const [sourceAuthorInput, setSourceAuthorInput] = useState("");
    const [sourceTypeInput, setSourceTypeInput] = useState("book");
  
  const handleAddQuote = (e) => {
    e.preventDefault();

    if(editQuote===null){
      api.addQuote(-1, quoteInput, sourceTypeInput, sourceTitleInput, sourceAuthorInput);
    }else{
      api.addQuote(editQuote.quoteId, quoteInput, sourceTypeInput, sourceTitleInput, sourceAuthorInput);
    }
    
    setUpdate(!update);
    setQuoteInput("");
    setSourceAuthorInput("");
    setSourceTitleInput("");
    setSourceTypeInput("book");
    setHideAddEditQuoteForm("hide-form");
    setEditQuote(null);
  }

  const handleCancel = (e) => {
    setQuoteInput("");
    setSourceAuthorInput("");
    setSourceTitleInput("");
    setSourceTypeInput("book");
    setHideAddEditQuoteForm("hide-form");
    setEditQuote(null);
  }

  useEffect(()=>{
    if(editQuote!==null){
      setQuoteInput(editQuote.quote);
      setSourceTitleInput(editQuote.sourceTitle);
      setSourceAuthorInput(editQuote.sourceAuthor);
      setSourceTypeInput(editQuote.sourceType);
    }
  }, [editQuote])
  
  return (
    <div className={`add-quote-form ${hideAddEditQuoteForm}`}>
      <form onSubmit={e=>handleAddQuote(e)}>
        <h1>{editQuote===null ? "Add Quote":"Edit Quote"}</h1>
        <textarea placeholder='New Quote *' value={quoteInput} onChange={e=>setQuoteInput(e.target.value)} required/>

        <div className='add-quote-info-container'>
          <input type="text" placeholder='Book/Movie Title *' value={sourceTitleInput} onChange={e=>setSourceTitleInput(e.target.value)} required/>
          <input type="text" placeholder='Author/Character' value={sourceAuthorInput} onChange={e=>setSourceAuthorInput(e.target.value)}/>

          <div className='selectType'>
            <input type="radio" value="book" name='type' checked={sourceTypeInput=== "book"} onChange={()=>setSourceTypeInput("book")}/><span>From Book</span>
            <input type="radio" value="movie" name='type' checked={sourceTypeInput==="movie"} onChange={()=>setSourceTypeInput("movie")}/><span>From Movie</span>
          </div>

          <div className='quote-form-buttons'>
            <button type='submit' className='add-quote-btn'>{editQuote===null ? "Add Quote":"Update Quote"}</button>
            <button type='button' className='cancel-btn' onClick={e=>handleCancel(e)}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddEditQuoteForm