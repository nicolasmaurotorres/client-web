import { SET_TABLE_STATE, SET_TABLE_LEVEL } from "../actions/types";

const initialState = {
    content : {},
    level : {
        files : [],
        folders: [],
        path: [],
        position : 0
    }
}


export default (state = initialState, action = {}) => {
    switch(action.type){
        case SET_TABLE_STATE:
            return {
                ...state,
                content : action.content
            }
        case SET_TABLE_LEVEL : 
        return {
            ...state,
            level : {
                files : action.level.files,
                folders : action.level.folders,
                path : action.level.path,
                position : action.level.position
            }
        }
        default:
            return state;
    }
}