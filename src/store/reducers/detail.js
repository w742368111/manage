import {combineReducers} from 'redux'
import * as Config from "../config/config"

// 集群当前选中的集群ID
const poolIDCurrent = (state, action) =>
    (action.type === Config.changeIndexPoolId) ? {"current": action.info} : state ? state : {"current": 0};

export default combineReducers({
    poolIDCurrent
})
