import axiosInstance from '../utils/axiosInstance'

export function specialistGetPacients(){
    var obj = {};
    obj["token"] = localStorage.jwtToken;
    return axiosInstance.post("/specialist/get/files",obj);
}

export function specialistAddFolder(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/add/folder",data);
}

export function specialistAddFile(data){
    data.append("token",localStorage.jwtToken);
    return axiosInstance.post("/add/file",data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function specialistRenameFolder(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/rename/folder",data);
}

export function specialistRenameFile(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/rename/file",data);
}

export function specialistRemoveFile(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/delete/file",data);
}

export function specialistRemoveFolder (data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/delete/folder",data);
}