import React, {Component} from "react";
import * as Common from './common/Public';
import intl from "react-intl-universal";
import * as Table from "../common/Table"
import * as Icon from "../common/Icon"
import * as Rows from "../common/RowSet"
import * as Func from "../../common/common";

import Initialize from "../Initialize";
import {Link} from "react-router-dom";
import cookie from "react-cookies";
import {message} from "antd";
import * as Key from "../../store/config/config";
import TopTips from "../common/Href";
import {connect} from "react-redux";
import * as CommonAction from "../../action/common";


const commonStateToProps = (state) => {
    return {value: state};
}

const commonDispatchToProps = (dispatch) => {
    return {
        commonUpdateUser: (gid, key) => {
            dispatch(CommonAction.makeActionObject(gid, key))
        }
    }
}

class MainAreaList extends Component {
    state = {
        info: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getPoolList()
    }

    getPoolList = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/pool/list", {user_id: uid, token: token}, this.syncCallBack)
    }

    gotoPool = (id) =>{
        this.props.commonUpdateUser(id,Key.changeIndexPoolId)
        this.props.history.push("/poolweb/index")
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

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        const inner = this.state.info.map((value, key) => {
            const {id, name,owner_id:owner, mining_name: miner,miner_addtime:addTime, income, ars_mining_address: xhAddress, ars_mining_id: xhKey, power, device_count: count, seal_count: sealCount, prove_count: proveCount, storage_count: storageCount} = value;
            const left = key % 3 + 1
            const top = (key === 0)?74:18;
            return (
                <div className={"new-index-main"} key={key} style={{marginTop:`${top}px`}}>
                    <div className={`banner bg${left}`}>
                        <svg className="icon svg-icon oper-icon coin-top" aria-hidden="true">
                            <use xlinkHref="#iconnav_icon_logo"></use>
                        </svg>
                        <h3>{miner}</h3>
                    </div>
                    <div className={"text"}>
                        <p style={{top: "40px"}} className={"bold"}>{intl.get('TOTAL_INCOME')}：{Func.coinExchange(income)}</p>
                        <p style={{top: "84px"}} className={"bold"}>{intl.get('VALID_POWER')}：{Func.powerUnitChange(power)}</p>
                        <p style={{top: "128px"}} className={"bold"}>{intl.get('MINER_TOTAL',{count:count})}</p>
                        <p style={{top: "40px", left: "528px"}} className={"bold"}>{intl.get('SEAL_COUNT',{count:sealCount})}</p>
                        <p style={{top: "84px", left: "528px"}} className={"bold"}>{intl.get('PROVE_COUNT',{count:proveCount})}</p>
                        <p style={{top: "128px", left: "528px"}} className={"bold"}>{intl.get('STORAGE_COUNT',{count:storageCount})}</p>
                        <a onClick={this.gotoPool.bind(this,id)}>
                            <div className={`but but${left}`}><p>{intl.get("INCOME_POOL")}</p></div>
                        </a>
                        <div className={`icon-go icon-go${left}`}></div>
                        <div className={"hr"}></div>
                        <p style={{top: "239px"}} className={"thin"}>{intl.get("ADDRESS")}：{xhAddress}</p>
                        <p style={{top: "278px"}}
                           className={"thin"}>{intl.get("NODE_ID")}：{xhKey}</p>
                        <p style={{top: "239px", left: "839px"}} className={"thin"}>{intl.get("OWNER_ID")}：{owner}</p>
                        <p style={{top: "278px", left: "839px"}} className={"thin"}>{intl.get("CREATE_TIME")}：{addTime}</p>
                    </div>
                </div>
            )
        })
        return (
            <React.Fragment>
                {inner}
            </React.Fragment>
        )
    }
}

const MainAreaListApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(MainAreaList)

class Index extends Component {
    state = {
        warning: [],
        bill: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/warning/warning/list", {user_id: uid, token: token}, this.warnCallBack)
        Func.axiosPost("/workorder/workorder/list", {user_id: uid, token: token}, this.billCallBack)
    }

    billCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            if (info.data.length > 0) {
                for (const val of info.data) {
                    const {device_id: device, Info: info, status, add_time: addTime, id} = val;
                    const text = JSON.parse(info).info;
                    const type = (device > 0) ? intl.get("DIAGNOSE_BILL_NAME") : intl.get("SIMPLE_BILL_NAME");

                    const link = <Link to={`/billweb/detail?id=${id}`}>
                        [{type}] &nbsp;&nbsp;&nbsp;&nbsp; {text.substring(0, 40)} <span
                        style={{position: "absolute", left: "700px"}}>{addTime}</span>
                    </Link>

                    const deal = (status === 1) ? intl.get("NOT_DEAL_BILL") : intl.get("ALREADY_CLOSE_BILL");
                    const show = (status === 1) ? 1 : 0;
                    this.state.bill.push([link, deal, show])
                }
                this.setState(this.state);
            }
        } else {
            message.error(description);
        }
    }

    warnCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            if (info.data.length > 0) {
                for (const val of info.data) {
                    const {device_name: name, info, add_time: addTime} = val;
                    const inner = `[${name}] ${addTime} ${info}`;
                    this.state.warning.push([inner.substring(0, 80), inner, 1])
                }
                this.setState(this.state);
            }
        } else {
            message.error(description);
        }
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    goBill = () => {
        this.props.history.push("/billweb/index/")
    }

    goWarn = () => {
        this.props.commonUpdateUser(3, Key.changeUserIndexMenu);
        this.props.history.push("/userweb/index/")
    }

    render() {
        let billRecord = Func.changeName(Rows.IndexBill());
        const collapseText = this.state.warning;
        const tableText = this.state.bill;

        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <MainAreaListApp history={this.props.history}/>
                <Table.TableCommon
                    style={{marginTop: "79px"}}
                    icon={<Icon.WarningHomeIcon/>}
                    title={intl.get("WARNING")}
                    name={<TopTips history={this.props.history} go={"/userweb/index"} warning={intl.get("WARNING_SET")}
                                   set={Key.changeUserIndexMenu} int={2}/>}
                    type={"collapse"}
                    text={collapseText}
                    more={<SeeMore click={this.goWarn}/>}
                />
                <Table.TableCommon
                    icon={<Icon.MyBillHomeIcon/>}
                    class={"index-bill-main"}
                    style={{marginBottom: "100px"}}
                    title={intl.get("MY_BILL")}
                    row={billRecord}
                    type={"table"}
                    text={tableText}
                    more={<SeeMore click={this.goBill}/>}
                />
            </React.Fragment>
        )
    }
}

const IndexApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(Index)


const SeeMore = (props) => {
    return (
        <p onClick={props.click}
           style={{margin: "10px auto 0", textAlign: "center", cursor: "pointer", fontSize: "12px", color: "#A7B1CA"}}>
            {intl.get("SEE_MORE")}
        </p>
    )
}


export default class Back extends Component {
    render() {
        return (
            <Initialize history={this.props.history}>
                <IndexApp history={this.props.history}/>
            </Initialize>
        )
    }
}