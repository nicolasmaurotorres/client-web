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

export function doctorRenamePacient(data){
    return function action(dispatch){
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/rename/folder",data);
     }
}

export function doctorRemovePacient(data){
    return function action(dispatch){
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/delete/folder",data);
     }
}

export function doctorAddFolder(data){
    return function action(dispatch){
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/add/folder",data);
     }
}

export function doctorAddFile(data){
    return function action(dispatch){
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/add/file",data);
     }
}