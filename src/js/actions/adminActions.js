import axiosInstance from '../utils/axiosInstance'

export function createUserRequest(data){
    return function action(dispatch){
        return axiosInstance.post("/admin/add/user",data);
     }
}

export function deleteUserRequest(data){
    return function action(dispatch){
        return axiosInstance.post("/admin/delete/user",data);
     }
}

export function editUserRequest(data){
    return function action(dispatch){
        return axiosInstance.post("/admin/edit/user",data);
     }
}

export function viewUsersRequest(data){
    debugger;
    return function action(dispatch){
        return axiosInstance.post("/admin/view/users",data);
     }
}