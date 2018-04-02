import axiosInstance from '../utils/axiosInstance'

export function userLoginRequest(data){
    return function action(dispatch){
        return axiosInstance.post('/login',data);
    }
}