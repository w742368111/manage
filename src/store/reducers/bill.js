import { combineReducers } from 'redux'
import * as Config from "../config/config"

const ifCreateNewBill = (state, action) => 
    (action.type === Config.openCreateBillOperate) ? {"current": action.info} : state ? state : {"current": 0};


export default combineReducers({
    ifCreateNewBill
})