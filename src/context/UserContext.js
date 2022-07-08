import { useState, createContext } from "react";
import authService from "../services/auth-service";

export const UserContext = createContext();

function UserContextProvider(props){
    const[currentUser, setCurrentUser] = useState(authService.getCurrentUser);

    return(
        <UserContext.Provider value={{currentUser, setCurrentUser}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContextProvider;