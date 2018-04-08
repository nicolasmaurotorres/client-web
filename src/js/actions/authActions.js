import axiosInstance from '../utils/axiosInstance'
import { SET_CURRENT_USER } from './types';
import setAuthorizationInfo from '../utils/setAuthorizationInfo';
import jwt from 'jsonwebtoken';

export function setCurrentUser(user) {
    return {
        type : SET_CURRENT_USER,
        user
    };
}

export function userLogoutRequest(){
    return function action(dispatch){
        var data = {};
        data["token"] = localStorage.jwtToken;
        axiosInstance.post("/logout",data)
        setAuthorizationInfo(false)
        dispatch(setCurrentUser({}));
    }
}

export function userLoginRequest(data,contextReact){
    return function action(dispatch){
        return axiosInstance.post('/login',data)
            .then(response => { 
                contextReact.setState({loading:false});
                contextReact.props.addFlashMessage({
                    type:"success",
                    text:"login success"
                });
                const token = response.data.message;
                const category = response.data.category;
                setAuthorizationInfo(token);
                dispatch(setCurrentUser(jwt.decode(token)));
                switch (category) {
                    case 0: // doctor
                        contextReact.context.router.history.push("/doctor");
                        break;
                    case 1: // pladema
                        contextReact.context.router.history.push("/pladema");
                        break;
                    case 2: // admin
                        contextReact.context.router.history.push("/admin");
                        break; 
                };
            })
            .catch(error => {
                var e = error.response.data.message;
                var _errors = contextReact.state.errors;
                _errors['submit'] = e;
                contextReact.setState({loading:false,errors:_errors});
            });
    }
}