import { useState, createContext } from "react";
import authService from "../services/auth-service";

export const UserContext = createContext();

function UserContextProvider(props){
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser);
    const [hideAddEditQuoteForm, setHideAddEditQuoteForm] = useState("hide-form");
    const [editQuote, setEditQuote] = useState(null);
    const [update, setUpdate] = useState(false);  //This is used to rerender the component after user like/unlike/add/edit a quote

    return(
        <UserContext.Provider value={{currentUser, setCurrentUser, hideAddEditQuoteForm, setHideAddEditQuoteForm, editQuote, setEditQuote, update, setUpdate}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;