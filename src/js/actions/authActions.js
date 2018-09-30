import axiosInstance from '../utils/axiosInstance'
import { SET_CURRENT_USER } from './types';

export function setCurrentUser(user) {
    debugger;
    return {
        type : SET_CURRENT_USER,
        user
    };
}

export function userLogoutRequest(){
    var data = {};
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/logout",data); 
}

export function userLoginRequest(data){
    return axiosInstance.post('/login',data);
}