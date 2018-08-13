import { combineReducers } from 'redux'
import flashMessages from './flashMessages'
import auth from './auth'
import table from './tableReducer'
import modals from './modalReducer'
import spinner from './spinnerReducer'

export default combineReducers({
    modals,
    table,
    flashMessages,
    auth,
    spinner
});