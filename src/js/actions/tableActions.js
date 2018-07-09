import { SET_TABLE_STATE } from './types'

export function setTableState(table){
    return {
        type: SET_TABLE_STATE,
        table
    }
}