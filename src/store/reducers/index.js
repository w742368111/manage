import { combineReducers } from 'redux'

import pool from './pool'
import user from "./user";
import device from "./device";
import test from "./test";
import bill from "./bill";
import manage from "./manage";
import socket from "./socket";

export default combineReducers({
    pool,
    user,
    device,
    test,
    bill,
    manage,
    socket
})