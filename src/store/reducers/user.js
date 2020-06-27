import {combineReducers} from 'redux'
import * as Config from "../config/config"

// 用户中心目录的状态标示
const userIndexMenuSelect = (state, action) =>
    (action.type === Config.changeUserIndexMenu) ? {"current": action.info} : state ? state : {"current": 1};

const userStateForceUpdate = (state, action) =>
    (action.type === Config.userStateForceUpdate) ? {"current": action.info} : state ? state : {"current": false};

export default combineReducers({
    userIndexMenuSelect,
    userStateForceUpdate
})

