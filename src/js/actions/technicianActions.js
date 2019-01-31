import axiosInstance from '../utils/axiosInstance'

export function technicianGetAllFolders(param){
    param["token"] = localStorage.jwtToken;
    return axiosInstance.post("/technician/search/files",param);
}

export function technicianAddFolder(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/add/folder",data);
}

export function technicianAddFile(data){
    data.append("token",localStorage.jwtToken);
    return axiosInstance.post("/add/file",data);
}

export function technicianGetFile(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/technician/get/file",data,{
        responseType : 'arraybuffer'
    });
}


