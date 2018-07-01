import axiosInstance from '../utils/axiosInstance'

export function plademaGetData(param){
    return function action(dispatch){
        param["token"] = localStorage.jwtToken;
        return axiosInstance.post("/pladema/search/files",obj);
     }
}
