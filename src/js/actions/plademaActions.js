import axiosInstance from '../utils/axiosInstance'

export function plademaGetAllFolders(param){
    param["token"] = localStorage.jwtToken;
    return axiosInstance.post("/pladema/search/files",param);
}

export function plademaAddFolder(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/add/folder",data);
}

export function plademaAddFile(data){
    data.append("token",localStorage.jwtToken);
    return axiosInstance.post("/add/file",data);
}

export function plademaGetFile(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/pladema/get/file",data,{
        responseType : 'arraybuffer'
    });
}


