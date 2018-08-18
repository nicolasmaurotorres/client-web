import axiosInstance from '../utils/axiosInstance'

export function doctorGetPacients(){
    var obj = {};
    obj["token"] = localStorage.jwtToken;
    return axiosInstance.post("/doctor/get/files",obj);
}

export function doctorRenamePacient(data){
    return function action(dispatch){
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/rename/folder",data);
     }
}

export function doctorRemovePacient(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/delete/folder",data);
}

export function doctorAddFolder(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/add/folder",data);
}

export function doctorAddFile(data){
    data.append("token",localStorage.jwtToken);
    return axiosInstance.post("/add/file",data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export function doctorRenameFolder(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/rename/folder",data);
}

export function doctorRenameFile(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/rename/file",data);
}

export function doctorRemoveFile(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/delete/file",data);
}

export function doctorRemoveFolder (data){
    return function action(dispatch){
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/delete/folder",data);
    }
}