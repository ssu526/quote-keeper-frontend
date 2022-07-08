import axios from "axios";
import authHeader from "./auth-header";

const URL = 'http://localhost:8080/';

class UserService{

    getUserById(userid){
        return axios.get(URL+"user/"+userid)
    }

    getUserQuotes(userid){
        return axios.get(URL+"quotes/user-quotes/"+userid, {headers: authHeader()});
    }

    getRandomQuote(){
        return axios.get(URL+"quotes/random");
    }

    likeQuote(quoteId){
        return axios.post(URL+"user/like", {quoteId}, {headers: authHeader()});
    }

    unlikeQuote(quoteId){
        return axios.post(URL+"user/unlike", {quoteId}, {headers: authHeader()});
    }

    addQuote(quote, sourceType, sourceTitle, sourceAuthor){
        return axios.post(URL+"quotes/add", {quote, sourceType, sourceTitle, sourceAuthor}, {headers: authHeader()});
    }

    changeFavoriteQuote(quoteId){
        return axios.post(URL+"user/change-favorite-quote", {quoteId}, {headers: authHeader()});
    }

    uploadProfileImage(formData){
        return axios.post(URL+"user/upload", formData, 
        {
            headers:{
                "Content-Type": "multipart/form-data",
                ...authHeader()
            }
        })
    }
}

export default new UserService();

