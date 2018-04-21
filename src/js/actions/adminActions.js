import axiosInstance from '../utils/axiosInstance'

export function createUserRequest(data){
    return function action(dispatch){
        debugger;
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/admin/add/user",data);
     }
}

export function deleteUserRequest(data){
    return function action(dispatch){
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/admin/delete/user",data);
     }
}

export function editUserRequest(data){
    return function action(dispatch){
        return axiosInstance.post("/admin/edit/user",data);
     }
}

export function viewUsersRequest(data){
    return function action(dispatch){
        data["token"] = localStorage.jwtToken;
        return axiosInstance.post("/admin/view/users",data);
     }
}