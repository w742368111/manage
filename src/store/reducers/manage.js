import {combineReducers} from 'redux'
import * as Config from "../config/config"

const manageIndexOperateTitle = (state, action) =>
    (action.type === Config.manageIndexTitleChange) ? {"current": action.info} : state ? state : {"current": 1};

const popupAddStaffPanel = (state, action) => {
    state = state ? state : {current: ""}
    if (action.type === Config.manageAddStaffShow) {
        state = {current: action.info}
    }
    if (action.type === Config.manageAddRoleShow) {
        state = {current: ""}
    }
    return state
}

const popupAddRolePanel = (state, action) => {
    state = state ? state : {current: ""}
    if (action.type === Config.manageAddStaffShow) {
        state = {current: ""}
    }
    if (action.type === Config.manageAddRoleShow) {
        state = {current: action.info}
    }
    return state
}

export default combineReducers({
    manageIndexOperateTitle,
    popupAddStaffPanel,
    popupAddRolePanel
})