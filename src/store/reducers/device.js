import {combineReducers} from 'redux'
import * as Config from "../config/config"

// 当前操作的矿机ID
const currentOperateDevice = (state, action) =>
    (action.type === Config.currentOperateDevice) ? {"current": action.info} : state ? state : {"current": ""};
// 当前操作的矿机Hardware id
const currentOperateHardware = (state, action) =>
    (action.type === Config.currentOperateHardware) ? {"current": action.info} : state ? state : {"current": ""};

const changeControlPanelMenu = (state,action) =>
    (action.type === Config.changeControlPanelMenu) ? {"current": action.info} : state ? state : {"current": 0};

const devicePerformanceMenu = (state,action) =>
    (action.type === Config.changePerformanceMenu) ? {"current": action.info} : state ? state : {"current": 0};

export default combineReducers({
    currentOperateDevice,
    currentOperateHardware,
    changeControlPanelMenu,
    devicePerformanceMenu
})