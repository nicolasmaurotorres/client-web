import axiosInstance from '../utils/axiosInstance'

export function createUserRequest(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/admin/add/user",data);
}

export function deleteUserRequest(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/admin/delete/user",data);
}

export function editUserRequest(data){
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/admin/edit/user",data);
}

export function viewUsersRequest(){
    var data = {};
    data["token"] = localStorage.jwtToken;
    return axiosInstance.post("/admin/view/users",data);
}