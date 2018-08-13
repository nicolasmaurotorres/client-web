import {SET_SPINNER_STATE} from './types'

export function setSpinnerState(obj){
    return {
        type: SET_SPINNER_STATE,
        obj,
    }
}