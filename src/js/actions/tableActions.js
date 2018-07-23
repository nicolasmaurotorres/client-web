import { SET_TABLE_STATE,SET_TABLE_LEVEL} from './types'

export function setTableState(obj){
    return {
        type: SET_TABLE_STATE,
        content : obj.content
    }
}

export function setCurrentLevel(level){
    return {
        type : SET_TABLE_LEVEL,
        level
    }
}