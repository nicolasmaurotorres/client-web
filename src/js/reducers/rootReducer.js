import { combineReducers } from 'redux'
import flashMessages from './flashMessages.js'
import auth from './auth';

export default combineReducers({
    flashMessages,
    auth
});