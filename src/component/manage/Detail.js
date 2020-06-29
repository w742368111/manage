import React, {Component} from "react";
import store from "../../store";
import * as Common from "../index/common/Public";
import BannerTitleApp from "./common/Common";
import {Button, Checkbox, message} from "antd";
import {Link} from "react-router-dom";
import intl from "react-intl-universal";
import {node} from "prop-types";
import Initialize from "../Initialize";
import cookie from "react-cookies";
import * as Func from "../../common/common";
import * as Key from "../../store/config/config";

const LocationBanner = () => {
    return (
        <div className={"page-position"} style={{marginTop: "26px"}}>
            <p>
                <Link to={"/index/index"}>{intl.get("INDEX_PAGE")}</Link>
                <span>></span>
                <Link to={"/manageweb/index"}>{intl.get("MANAGE_PAGE")}</Link>
                <span>></span>
                {intl.get("POWER_EDIT")}
            </p>
        </div>
    )
}

const OperateButtonPanel = (props) => {
    return (
        <React.Fragment>
            <div className={"power-button-area"}>
                <h4>{intl.get("ROLE_DETAIL_NAME", {name: props.name})}</h4>
                <Button type="primary" disabled={props.change} onClick={props.click}>{intl.get("SAFE")}</Button>
            </div>
        </React.Fragment>
    )
}

const Item = (name, key, id, props) => {
    let val;
    if (name === "check") {
        val = props[0]
    }
    if (name === "create") {
        val = props[1]
    }
    if (name === "edit") {
        val = props[2];
    }
    if (name === "del") {
        val = props[3];
    }
    switch (key) {
        case 0:
            return <svg className="icon svg-icon" aria-hidden="true">
                <use xlinkHref="#iconicon_line"></use>
            </svg>
        case 1:
            return <svg className="icon svg-icon" aria-hidden="true">
                <use xlinkHref="#iconicon_gou"></use>
            </svg>
        case 2:
            return <Checkbox value={val} style={{margin: "0px auto"}}></Checkbox>
        case 3:
            return <Checkbox value={val} style={{margin: "0 auto"}}></Checkbox>
        default:
            return <svg className="icon svg-icon" aria-hidden="true">
                <use xlinkHref="#iconicon_line"></use>
            </svg>
    }
}


class BasePowerPanel extends Component {
    state = {
        info: [],
    }

    componentDidMount() {
        this.props.onRef(this);
        const list = ["INCOME_VIEW", "GROUP_VIEW", "GROUP_ADD", "GROUP_EDIT", "GROUP_DELETE", "DEVICE_VIEW", "DEVICE_ADD", "DEVICE_EDIT", "USER_VIEW", "USER_ADD", "USER_EDIT", "USER_DELETE", "ROLE_VIEW", "ROLE_ADD", "ROLE_EDIT", "ROLE_DELETE", "PERMISSION_VIEW", "", "PERMISSION_EDIT", "WARNING_VIEW", "WORKORDER_VIEW", "WORKORDER_ADD", "WORKORDER_EDIT", "WORKORDER_DELETE"]
        this.state.info = this.props.base.split(",").filter((value) => list.includes(value))
    }

    onChange = (value) => {
        this.state.info = value;
        this.props.change();
    }

    getStateList = () => {
        return this.state.info
    }

    render() {
        const list = this.props.power.map((val, key) => {
            const [name, check, create, edit, del, id, ...oper] = val;
            return (
                <div className="list" key={key}>
                    <div style={{width: "113px"}} className="in">{intl.get(name)}</div>
                    <div className="right">
                        <div className="all">
                            {Item("check", check, id, oper)}
                        </div>
                        <div className="all">
                            {Item("create", create, id, oper)}
                        </div>
                        <div className="all">
                            {Item("edit", edit, id, oper)}
                        </div>
                        <div className="all">
                            {Item("del", del, id, oper)}
                        </div>
                    </div>
                </div>
            )
        })

        return (
            <React.Fragment>
                <Checkbox.Group onChange={this.onChange.bind(this)} defaultValue={this.props.base.split(",")}>
                    <div className={"base-power-info"}>
                        <h4>{intl.get("BASE_INFO")}</h4>
                        <div className={"base-table"}>
                            <div className="banner">
                                <div className="left"></div>
                                <div className="right">
                                    <div className="top">
                                        {intl.get("BASE_POWER")}
                                    </div>
                                    <div className="bottom">
                                        <div className={"single"}>{intl.get("BASE_POWER_CHECK")}</div>
                                        <div className={"single"}>{intl.get("BASE_POWER_CREATE")}</div>
                                        <div className={"single"}>{intl.get("BASE_POWER_EDIT")}</div>
                                        <div style={{borderRight: "none"}}
                                             className={"single"}>{intl.get("BASE_POWER_DELETE")}</div>
                                    </div>
                                </div>
                            </div>
                            {list}
                        </div>
                    </div>
                </Checkbox.Group>
            </React.Fragment>
        )
    }
}


class OperatePower extends Component {
    state = {
        list: []
    }

    componentDidMount() {
        this.props.onRef(this);
        const list = ["POWEROFF", "REBOOT", "TYPE_SET", "DISK_FORMAT", "MOVE", "DELETE", "ADD_DISK", "DELETE_DISK"];
        this.state.list = this.props.base.split(",").filter((value) => list.includes(value))
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    onChange = (value) => {
        this.state.list = value;
        this.props.change()
    }

    getStateList = () => {
        return this.state.list;
    }

    render() {
        const power = [
            [intl.get("REMOTE_SHUTDOWN"), "POWEROFF"],
            [intl.get("REMOTE_RELOAD"), "REBOOT"],
            [intl.get("DISTRIBUTE_ROLE"), "TYPE_SET"],
            [intl.get("FORMAT_DISK"), "DISK_FORMAT"],
            [intl.get("BATCH_MOVE_MACHINE"), "MOVE"],
            [intl.get("BATCH_DELETE_MACHINE"), "DELETE"],
            [intl.get("ADD_DISK_GROUP"), "ADD_DISK"],
            [intl.get("DEL_DISK_GROUP"), "DELETE_DISK"],
        ]

        const list = power.map((value, key) => {
            const [content, val] = value;
            return (
                <div className={"block"} key={key}>
                    <Checkbox value={val} className="operate">{content}</Checkbox>
                </div>
            )
        })

        return (
            <React.Fragment>
                <div className="operate-power-info" style={{display:"none"}}>
                    <h4>{intl.get("OPERATE_POWER")}</h4>
                    <div className={"inner"}>
                        <Checkbox.Group style={{width: '100%'}} onChange={this.onChange.bind(this)}
                                        defaultValue={this.props.base.split(",")}>
                            {list}
                        </Checkbox.Group>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


class PoolPowerPanel extends Component {
    state = {
        list: []
    }

    componentDidMount() {
        this.props.onRef(this);
        this.state.list = this.props.base.split(",").filter((value) => value.includes("POOL_"))
    }

    getStateList = () => {
        return this.state.list;
    }

    onChange = (value) => {
        this.state.list = value;
        this.props.change()
    }

    render() {
        const info = this.props.power;
        const list = info.map((val, key) => {
            const [name, has, pid] = val;
            return (
                <div key={key} className={"block"}>
                    <Checkbox value={`POOL_${pid}`} defaultChecked={has} className="operate">
                        {name}
                    </Checkbox>
                </div>
            )
        })

        return (
            <React.Fragment>
                <div className="operate-power-info" style={{marginTop: "-60px"}}>
                    <h4>{intl.get("POOL_OPERATE_POWER")}</h4>
                    <Checkbox.Group style={{width: '100%'}} onChange={this.onChange.bind(this)}
                                    defaultValue={this.props.base.split(",")}>
                        <div className={"inner"}>
                            {list}
                        </div>
                    </Checkbox.Group>
                </div>
            </React.Fragment>
        )
    }
}

class PowerEditMain extends Component {
    state = {
        power: "",
        pool: [],
        show: false,
        name:"",
        change:true
    }

    componentDidMount() {
        this.getRolePower();
    }

    getRolePower = () => {
        const {uid, token} = cookie.loadAll();
        const role = parseInt(Func.getQueryVariable("id"));
        Func.axiosPost("/user/role/get", {user_id: uid, token: token, role_id: role}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {Permission: power,Name:name} = info;
            this.state.power = power;
            this.state.name = name;
            this.setState(this.state);
            this.getPoolList()
        } else {
            message.error(description);
        }
    }

    getPoolList = () => {
        const {uid, token} = cookie.loadAll();
        this.state.pool = [];
        Func.axiosPost("/pool/pool/list", {user_id: uid, token: token}, this.poolCallBack)
    }

    poolCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            for (const val of info) {
                const {id, name} = val;
                this.state.pool.push([name, this.state.power.includes(`POOL_${id}`), id])
            }
            this.state.show = true;
            this.setState(this.state);
        } else {
            message.error(description);
        }
    }

    onBase = (ref) => {
        this.base = ref;
    }
    onOper = (ref) => {
        this.oper = ref;
    }
    onPool = (ref) => {
        this.pool = ref
    }
    onChange = () => {
        if(this.state.change){
            this.state.change = false;
            this.setState(this.state);
        }
    }

    uploadNewPower = () => {
        const base = this.base.getStateList();
        const oper = this.oper.getStateList();
        const pool = this.pool.getStateList();
        const total = [...base, ...oper, ...pool];
        const {uid, token} = cookie.loadAll();
        const role = parseInt(Func.getQueryVariable("id"));
        Func.axiosPost("/user/role/editPermission", {
            user_id: uid,
            token: token,
            role_id: role,
            permission: total.join(",")
        }, this.editCallBack)
    }

    editCallBack = (data) =>{
        const {code, data: info, description} = data.data;
        if (code === 0) {
            message.success(intl.get("MODIFY_SUCCESS"));
        } else {
            message.error(description);
        }
    }

    render() {
        const base = Func.getBaseInfoPower(this.state.power);
        return (
            <div className={"power-edit-main"}>
                {this.state.show ?
                    <React.Fragment>
                        <OperateButtonPanel change={this.state.change} click={this.uploadNewPower} name={this.state.name} />
                        <BasePowerPanel change={this.onChange} onRef={this.onBase} base={this.state.power} power={base}/>
                        <OperatePower change={this.onChange} onRef={this.onOper} base={this.state.power}/>
                        <PoolPowerPanel change={this.onChange} onRef={this.onPool} base={this.state.power} power={this.state.pool}/>
                    </React.Fragment> : <React.Fragment></React.Fragment>
                }
            </div>
        )
    }
}

class DetailMain extends Component {
    constructor(props) {
        super(props);
        store.subscribe(this.storeChange.bind(this));
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    storeChange() {
        this.setState(store.getState())
    }

    render() {
        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <BannerTitleApp history={this.props.history} href={1}/>
                <LocationBanner/>
                <PowerEditMain/>
            </React.Fragment>
        )
    }
}

export default class Back extends Component {
    render() {
        return (
            <Initialize history={this.props.history}>
                <DetailMain history={this.props.history}/>
            </Initialize>
        )
    }
}

