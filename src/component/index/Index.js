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

const IncomeTitleRight = () => {
    return (
        <React.Fragment>
            <h6>{intl.get('INCOME_DETAIL')}</h6>
            <svg className="icon svg-icon detail-icon" aria-hidden="true">
                <use xlinkHref="#iconicon_more"></use>
            </svg>
        </React.Fragment>
    )
}

const DetailCommon = (props) => {
    return (
        <div className={"panel-detail-common"}>{props.children}</div>
    );
}

const IncomeDetail = (props) => {
    const [incomeTotal, incomeBalance, myTotal, myBalance] = props.inner;
    return (
        <DetailCommon>
            {/*<h4 style={{left: "183px"}}>{intl.get('INCOME_BALANCE')}</h4>*/}
            {/*<h4 style={{left: "396px"}}>{intl.get('INCOME_BALANCE')}</h4>*/}
            {/*<h4 style={{left: "781px"}}>{intl.get('MY_TOTAL_INCOME')}</h4>*/}
            {/*<h4 style={{left: "1004px"}}>{intl.get('MY_TOTAL_INCOME')}</h4>*/}
            {/*<h3 style={{left: "183px"}}>{incomeTotal}</h3>*/}
            {/*<h3 style={{left: "396px"}}>{incomeBalance}</h3>*/}
            {/*<h3 style={{left: "781px"}}>{myTotal}</h3>*/}
            {/*<h3 style={{left: "1004px"}}>{myBalance}</h3>*/}

            <h4 style={{left: "321px"}}>{intl.get('INCOME_BALANCE')}</h4>
            <h4 style={{left: "800px"}}>{intl.get('MY_TOTAL_INCOME')}</h4>

            <h3 style={{left: "321px"}}>{incomeBalance}</h3>
            <h3 style={{left: "800px"}}>{myTotal}</h3>

        </DetailCommon>
    );
}

const PowerDetail = (props) => {
    const [totalStorage, currentPower, alreadyMemory] = props.inner;
    return (
        <DetailCommon>
            <h4 style={{left: "197px"}}>{intl.get('TOTAL_MEMORY')}</h4>
            <h4 style={{left: "590px"}}>{intl.get('CURRENT_POWER')}</h4>
            <h4 style={{left: "985px"}}>{intl.get('ALREADY_MEMORY')}</h4>
            <h3 style={{left: "197px"}}>{Func.powerUnitChange(totalStorage)}</h3>
            <h3 style={{left: "590px"}}>{Func.powerUnitChange(currentPower)}</h3>
            <h3 style={{left: "985px"}}>{Func.powerUnitChange(alreadyMemory)}</h3>
        </DetailCommon>
    );
}

const MinerDetail = (props) => {
    const [online, all, offline] = props.inner
    return (
        <DetailCommon>
            <h4 style={{left: "197px"}}>{intl.get('ONLINE_MINER')}</h4>
            <h4 style={{left: "590px"}}>{intl.get('TOTAL_MINER')}</h4>
            <h4 style={{left: "985px"}}>{intl.get('OUTLINE_MINER')}</h4>
            <h3 style={{left: "197px"}}>{online}</h3>
            <h3 style={{left: "590px"}}>{all}</h3>
            <h3 style={{left: "985px"}}>{offline}</h3>
        </DetailCommon>
    );
}

const MainArea = (props) => {
    return (
        <div className={`main-panel ${props.className}`} style={props.style}>
            <svg className="icon svg-icon" aria-hidden="true">
                <use xlinkHref={`#${props.icon}`}></use>
            </svg>
            <h5>{props.title}</h5>
            {props.right}
            <div className={"hr-mid"}></div>
            {props.children}
        </div>
    )
}

class MainAreaList extends Component {
    state = {
        income: 0,
        balance: 0,
        diskAll: 0,
        powerAll: 0,
        diskUsed: 0,
        deviceOn: 0,
        deviceAll: 0,
        deviceOff: 0
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/pool/index", {user_id: uid, token: token}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {
                Income_all: income, Balance_all: balance, Disk_space_all: diskAll, device_num: deviceAll,
                device_offline: deviceOff, device_online: deviceOn, disk_sapce_used: diskUsed, power_all: powerAll
            } = data.data.data;
            this.state.income = income;
            this.state.balance = balance;
            this.state.diskAll = diskAll;
            this.state.deviceAll = deviceAll;
            this.state.deviceOff = deviceOff;
            this.state.deviceOn = deviceOn;
            this.state.diskUsed = diskUsed;
            this.state.powerAll = powerAll;
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
        return (
            <React.Fragment>
                <Link to={"/poolweb/wallet/"}>
                    <MainArea className={"income-panel"}
                              title={intl.get('INCOME')}
                              right={<IncomeTitleRight/>}
                              icon={"iconhome_icon_earnings"}
                              style={{marginTop: "78px"}}>
                        <IncomeDetail
                            inner={[this.state.income, this.state.balance, this.state.income, this.state.balance]}/>
                    </MainArea>
                </Link>
                <MainArea className={"power-panel"}
                          title={intl.get('POWER')}
                          icon={"iconhome_icon_power"}
                          style={{marginTop: "26px"}}>
                    <PowerDetail inner={[this.state.diskAll, this.state.powerAll, this.state.diskUsed]}/>
                </MainArea>
                <MainArea className={"miner-panel"}
                          title={intl.get('MINER')}
                          icon={"iconhome_icon_miner"}
                          style={{marginTop: "26px"}}>
                    <MinerDetail inner={[this.state.deviceOn, this.state.deviceAll, this.state.deviceOff]}/>
                </MainArea>
            </React.Fragment>
        )
    }
}

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
        this.props.commonUpdateUser(3,Key.changeUserIndexMenu);
        this.props.history.push("/userweb/index/")
    }

    render() {
        let billRecord = Func.changeName(Rows.IndexBill());
        const collapseText = this.state.warning;
        const tableText = this.state.bill;

        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <MainAreaList/>
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