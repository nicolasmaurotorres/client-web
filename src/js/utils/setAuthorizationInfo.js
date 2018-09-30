export default function setAuthorizationInfo(token){
    if(token){
        localStorage.setItem('jwtToken',token);
    } else {
        localStorage.removeItem('jwtToken');
    }
}

