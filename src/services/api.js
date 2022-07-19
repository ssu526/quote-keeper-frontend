import axios from "axios";
import authHeader from "./auth-header";

const URL = 'http://localhost:8080/';

class UserService{
    getRandomQuote(){
        return axios.get(URL+"quotes/random");
    }

    getUserById(userid){
        return axios.get(URL+"user/"+userid)
    }

    getUserQuotes(userid){
        return axios.get(URL+"quotes/user-quotes/"+userid, {headers: authHeader()});
    }

    likeQuote(quoteId){
        return axios.post(URL+"user/like", {quoteId}, {headers: authHeader()});
    }

    unlikeQuote(quoteId){
        return axios.post(URL+"user/unlike", {quoteId}, {headers: authHeader()});
    }

    addQuote(quoteId, quote, sourceType, sourceTitle, sourceAuthor){
        return axios.post(URL+"user/add", {quoteId, quote, sourceType, sourceTitle, sourceAuthor}, {headers: authHeader()});
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

