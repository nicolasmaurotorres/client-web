import axiosInstance from '../utils/axiosInstance'

export function plademaGetAllFolders(param){
    param["token"] = localStorage.jwtToken;
    return axiosInstance.post("/pladema/search/files",param);
}

export function plademaAddFolder(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/add/folder",data);
}


