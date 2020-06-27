import React, {Component} from "react";
import cookie from "react-cookies";
import ReconnectingWebSocket from 'reconnecting-websocket';
import * as Func from "../common/common";
import {connect} from "react-redux";
import * as CommonAction from "../action/common";
import * as Key from "../store/config/config";

class Initialize extends Component {
    state = {
        on: 0,
    }

    constructor(props) {
        super(props);
        this.checkToken();
    }

    checkToken = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/user/checkToken", {user_id: uid, token: token}, this.checkCallBack)
    }

    checkCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code !== 0) {
            this.props.history.push("/")
        } else {
            if (!window.ws) {
                this.initWebsocket();
            } else {
                this.state.on = 1;
                this.setState(this.state);
            }
        }
    }

    initWebsocket = () => {
        const {uid, token} = cookie.loadAll();
        // window.ws = new ReconnectingWebSocket('ws://192.168.1.212:8081/ws');
        window.ws = new ReconnectingWebSocket('wss://devppool.arsyun.com/ws');
        window.ws.onopen = () => {
            console.log(`{"from":"html","act":"start","act_code":"codeNew","user_id":${uid},"token":"${token}"}`);
            window.ws.send(`{"from":"html","act":"start","act_code":"codeNew","user_id":${uid},"token":"${token}"}`);
        };
        window.ws.onmessage = (data) => {
            const {data: info} = data;
            const {action, code} = JSON.parse(info);
            if (action === "start" && code === 0) {
                this.startHeartBeat();
                this.state.on = 1;
                this.setState(this.state);
            } else if (action === "heartbeat") {

            } else {
                this.props.changeSocketBack(info, Key.changeGlobalsSocket);
            }
        };
    }

    startHeartBeat = () => {
        setInterval(function () {
                console.log(`{"from":"html","act":"heartbeat","act_code":"codeNew"}`)
                window.ws.send(`{"from":"html","act":"heartbeat","act_code":"codeNew"}`)
            }, 13000
        )
    }

    componentWillUnmount() {
        // 新增销毁ws的操作
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        return (
            <React.Fragment>
                {this.state.on == 0 ?
                    <React.Fragment></React.Fragment> :
                    this.props.children
                }
            </React.Fragment>
        )
    }
}

const commonStateToProps = (state) => {
    return {value: state};
}

const dispatchToProps = (dispatch) => {
    return {
        changeSocketBack: (gid, key) => {
            dispatch(CommonAction.makeActionObject(gid, key))
        }
    }
}

const InitializeApp = connect(
    commonStateToProps,
    dispatchToProps
)(Initialize)

export default InitializeApp;