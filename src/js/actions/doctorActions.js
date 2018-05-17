import axiosInstance from '../utils/axiosInstance'

export function doctorGetPacients(){
    return function action(dispatch){
        var obj = {};
        obj["token"] = localStorage.jwtToken;
        return axiosInstance.post("/doctor/get/files",obj);
     }
}