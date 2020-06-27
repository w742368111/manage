import {combineReducers} from 'redux'
import * as Config from "../config/config"

const globalSocketBack = (state, action) =>
    (action.type === Config.changeGlobalsSocket) ? {"current": action.info} : state ? state : {"current": ""};

export default combineReducers({
    globalSocketBack
})