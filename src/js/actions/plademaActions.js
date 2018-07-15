import axiosInstance from '../utils/axiosInstance'

export function plademaGetData(param){
    return function action(dispatch){
        param["token"] = localStorage.jwtToken;
        return axiosInstance.post("/pladema/search/files",obj);
     }
}

export function plademaAddFolder(data){
    return function action(dispatch){
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/add/folder",data);
     }
}

