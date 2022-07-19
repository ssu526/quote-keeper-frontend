import React, {useState, useContext, useEffect} from 'react'
import { UserContext } from '../context/UserContext';
import { useNavigate } from "react-router-dom";
import authService from '../services/auth-service';
import api from '../services/api'

const AddEditQuoteForm = () => {
  const {hideAddEditQuoteForm, setHideAddEditQuoteForm, setCurrentUser, editQuote, setEditQuote, update, setUpdate} = useContext(UserContext);
  const navigate = useNavigate();

  /***************** States for the add and edit quote form *****************/
  const [quoteInput, setQuoteInput] = useState("");
  const [sourceTitleInput, setSourceTitleInput] = useState("");
  const [sourceAuthorInput, setSourceAuthorInput] = useState("");
  const [sourceTypeInput, setSourceTypeInput] = useState("book");
  
  /***************** handler for the add and edit quote form *****************/
  const handleAddEditQuote = (e) => {
    e.preventDefault();
    const quoteId = editQuote===null ? -1 : editQuote.quoteId;

    // quoteId==-1: addQuote() is for adding a new quote; Otherwise, it is for updating an existing quote
    api.addQuote(quoteId, quoteInput, sourceTypeInput, sourceTitleInput, sourceAuthorInput)
    .then(()=>{
      setUpdate(!update);
    })
    .catch(()=>{
      authService.logout();
      setCurrentUser(null);
      navigate("/login");
    })
    .finally(()=>{
      resetAddEditForm();
    })
  }

  const resetAddEditForm = () =>{
    setQuoteInput("");
    setSourceAuthorInput("");
    setSourceTitleInput("");
    setSourceTypeInput("book");
    setHideAddEditQuoteForm("hide-form");
    setEditQuote(null);
  }

 
  /*
    If editQuote in the context is null, it is a add new quote request
    If editQuote in the context is not null, it is a edit exsiting quost request. Populate the form with the selected quote
  */
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
      <form onSubmit={e=>handleAddEditQuote(e)}>
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
            <button type='button' className='cancel-btn' onClick={resetAddEditForm}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddEditQuoteForm