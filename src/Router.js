import React, {Component} from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import intl from 'react-intl-universal';

import ReconnectingWebSocket from 'reconnecting-websocket';
// import {createBrowserHistory} from 'history';

import LoginIndex from "./component/user/Login";
import ResetIndex from "./component/user/Reset";
import IndexIndex from "./component/index/Index";
import PoolIndex from "./component/pool/Index";
import MyWallet from "./component/pool/MyWallet";
import UserIndex from "./component/user/Index";
import BillIndex from "./component/bill/Index";
import TestIndex from "./component/test/Index";
import ManageIndex from "./component/manage/Index";
import BillDetail from "./component/bill/Detail";
import ManageDetail from "./component/manage/Detail";

// const history = createBrowserHistory();

// const ws = new ReconnectingWebSocket('ws://192.168.1.212:8081/ws');
// ws.onopen = function () {
//     ws.send("发送数据");
// };
// ws.onmessage = function (data) {
//     console.log(2323232332,data,454545454545);
// };

const locales = {
    "en-US": require('./lang/en-US'),
    "zh-CN": require('./lang/zh-CN'),
};

export default class Basic extends React.Component {
    state = {
        initDone: false,
        wsDone: 1
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadLocales();
    }

    componentWillUnmount() {
    }

    loadLocales() {
        intl.init({
            currentLocale: 'zh-CN',
            locales,
        }).then(() => {
            this.setState({initDone: true});
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.wsDone === 0 ?
                    <React.Fragment></React.Fragment> :
                    <Router>
                        <Switch>
                            <Route path="/userweb/login" component={LoginIndex}/>
                            <Route path="/userweb/reset" component={ResetIndex}/>
                            <Route path="/index/index" component={IndexIndex}/>
                            <Route path="/poolweb/index" component={PoolIndex}/>
                            <Route path="/poolweb/wallet" component={MyWallet}/>
                            <Route path="/userweb/index" component={UserIndex}/>
                            <Route path="/billweb/index" component={BillIndex}/>
                            <Route path="/manageweb/index" component={ManageIndex}/>
                            <Route path="/testweb/index" component={TestIndex}/>
                            <Route path="/billweb/detail" component={BillDetail}/>
                            <Route path="/manageweb/detail" component={ManageDetail}/>
                            <Route path="/" component={LoginIndex}/>
                        </Switch>
                    </Router>
                }
            </React.Fragment>
        )
    }
}