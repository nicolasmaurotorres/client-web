import { combineReducers } from 'redux'
import flashMessages from './flashMessages'
import auth from './auth';
import table from './tableReducer';
import modals from './modalReducer'

export default combineReducers({
    modals,
    table,
    flashMessages,
    auth
});