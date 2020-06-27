import {combineReducers} from 'redux'
import * as Config from "../config/config"

// 矿机产测页Title状态标记
const testIndexTitleStatus = (state, action) =>
    (action.type === Config.changeTestIndexTitle) ? {"current": action.info} : state ? state : {"current": 1};

export default combineReducers({
    testIndexTitleStatus
})

