import axiosInstance from '../utils/axiosInstance'

export function doctorGetPacients(){
    return function action(dispatch){
        var obj = {};
        obj["token"] = localStorage.jwtToken;
        return axiosInstance.post("/doctor/get/files",obj);
     }
}

export function doctorAddPacient(data){
    return function action(dispatch){
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/add/folder",data);
     }
}