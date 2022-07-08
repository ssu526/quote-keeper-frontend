import axios from "axios";

const URL = 'http://localhost:8080/auth/';

class AuthService{
    login(email, password){
        return axios.post(URL+"login", {
            email,
            password
        })
        .then(response => {
            if(response.data.token){
                localStorage.setItem("user", JSON.stringify(response.data));
            }
        })
    }

    logout(){
        localStorage.removeItem("user");
    }

    register(name, email, password){
        return axios.post(URL+"signup", {
            name,
            email,
            password
        });
    }

    getCurrentUser(){
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();