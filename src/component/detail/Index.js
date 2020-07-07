import React, {Component} from "react";
import * as Common from "../index/common/Public";
import {Menu, Dropdown, Button, message} from 'antd';
import cookie from "react-cookies";
import * as Func from "../../common/common";
import {Link} from "react-router-dom";

class TopBanner extends Component {
    state = {
        id: 0,
        menu: 1,
        info: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getPoolList()
    }

    componentWillUnmount() {
        console.log("组件将要销毁")
    }

    getPoolList = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/pool/list", {user_id: uid, token: token}, this.syncCallBack)
    }
    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            this.state.info = info;
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }
    changeTitle = (n) => {
        this.state.menu = n;
        this.setState(this.state);
    }

    render() {
        const info = this.state.info.map((value, key) => {
            const {mining_name:miner,id} = value;
            return (
                <Menu.Item key={key}>
                    <Link to={`/poolweb/index/?id=${id}`}>
                        {miner}
                    </Link>
                </Menu.Item>
            )
        })

        const menu = (
            <Menu>
                {info}
            </Menu>
        );
        const style = (this.state.menu === 1) ? ["on", ""] : ["", "on"]
        return (
            <div className={"new-pool-banner"}>
                <div className={"coin"}></div>
                <div className={"check"}>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            <span className={"title"}>t01102 &nbsp;</span>
                            <svg className="icon svg-icon oper-icon coin-top" aria-hidden="true">
                                <use xlinkHref="#iconico_arrow-down"></use>
                            </svg>
                        </a>
                    </Dropdown>
                </div>
                <Button onClick={this.changeTitle.bind(this, 1)} className={style[0]}
                        style={{left: "238px"}}>矿池面板</Button>
                <Button onClick={this.changeTitle.bind(this, 2)} className={style[1]}
                        style={{left: "353px"}}>矿机管理</Button>
            </div>
        )
    }
}

export default class Index extends Component {
    render() {
        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <TopBanner/>
            </React.Fragment>
        )
    }
}