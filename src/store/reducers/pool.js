import {combineReducers} from 'redux'
import * as Config from "../config/config"

// 矿池首页group title的状态
const poolIndexGroupTitle = (state, action) =>
    (action.type === Config.changePoolGroupMenu) ? {"current": action.info} : state ? state : {"current": 0};

// 钱包页首页wallet title的状态
const walletIndexTitle = (state, action) =>
    (action.type === Config.changeWalletIndexMenu) ? {"current": action.info} : state ? state : {"current": 1};

// 矿池首页选中的矿池ID状态
const poolIndexCurrentPid = (state, action) =>
    (action.type === Config.changePoolIndexPid) ? {"current": action.info} : state ? state : {"current": 0};

// 钱包页首页中的矿池ID状态
const walletIndexPid = (state, action) =>
    (action.type === Config.changeWalletIndexPid) ? {"current": action.info} : state ? state : {"current": 0};

// 矿机首页设置矿机为计算，存储
const poolIndexDefaultType = (state, action) =>
    (action.type === Config.changeMinerTypeOperate) ? {"current": action.info} : state ? state : {"current": 1};

// 矿池的组列表强制更新
const ifGroupForceUpdate = (state,action) =>
    (action.type === Config.ifForceUpdateGroupList) ? {"current": action.info} : state ? state : {"current": 0};

// 矿机将要移动至的分组ID
const minerMoveGroupId = (state, action) => {
    state = state ? state : {"current": 0}
    if (action.type === Config.moveMinerGroupId) {
        state = {"current": action.info}
    }
    if (action.type === Config.changePoolIndexPid) {
        state = {"current": 0}
    }
    return state
}

// 当前正在操作的分组ID
const currentOperateGid = (state, action) => {
    state = state ? state : {"current": 0}
    if (action.type === Config.changePoolIndexPid) {
        state = {"current": 0}
    }
    if (action.type === Config.changeCurrentOpGid) {
        state = {"current": action.info}
    }
    return state
}


export default combineReducers({
    poolIndexGroupTitle,
    walletIndexTitle,
    ifGroupForceUpdate,
    poolIndexCurrentPid,
    walletIndexPid,
    poolIndexDefaultType,
    minerMoveGroupId,
    currentOperateGid
})

