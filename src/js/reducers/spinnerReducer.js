import { SET_SPINNER_STATE } from "../actions/types";

const initialState = {
    loading : false
}


export default (state = initialState, action = {}) => {
    switch(action.type){
        case SET_SPINNER_STATE:{
            return {
                ...state,
                loading : action.obj.state
            }
        }
        default:
            return state;
    }
}