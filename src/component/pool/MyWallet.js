import React, {Component} from "react";
import * as Common from "../index/common/Public";
import * as Icon from "../common/Icon";
import intl from "react-intl-universal";
import * as Table from "../common/Table";
import * as Scrollbar from "../common/Scrollbars";
import * as ScrollBlock from "./common/ScrollBlock";
import {Button, message, Pagination} from "antd";
import * as Func from "../../common/common";
import * as Rows from "../common/RowSet";
import store from "../../store";
import * as Config from "../../store/config/config"
import * as CommonAction from "../../action/common";
import cookie from "react-cookies";
import Initialize from "../Initialize";
import * as Key from "../../store/config/config";
import {connect} from "react-redux";

const PoolIndexBg = (props) => {
    return (
        <div className={"wallet-index-panel"}>
            {props.children}
        </div>
    )
}

class PoolIndexPanel extends Component {
    state = {
        source: []
    }

    componentDidMount() {
        this.getPoolList();
    }

    getPoolList() {
        const {uid, token} = cookie.loadAll();
        this.state.info = [];
        this.setState(this.state);
        Func.axiosPost("/pool/income/poolList", {user_id: uid, token: token}, this.syncCallBack)
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            for (const val of info) {
                const {
                    mining_name: miner, income_all: incomeAll, id, cli_mining_id: cliMiningId,
                    cli_balance: cliBalance, ars_mining_id: arsMiningId, ars_balance: arsBalance, name
                } = val;
                this.state.source.push(['', name, miner, arsMiningId, Func.coinExchange(incomeAll), Func.coinExchange(arsBalance),
                    cliMiningId, Func.coinExchange(incomeAll), Func.coinExchange(cliBalance), id])
            }
            this.setState(this.state);
        } else {
            message.error(description);
        }
    }

    render() {
        return (
            <PoolIndexBg>
                <Scrollbar.PoolList style={this.props.style}>
                    <ScrollBlock.WalletBlock source={this.state.source}/>
                </Scrollbar.PoolList>
            </PoolIndexBg>
        )
    }
}

class PagingInfo extends Component {
    getTransfer = (value) => {
        this.props.list(value);
    }

    render() {
        return (
            <div className={"wallet-index-page"} style={{width: "100%", height: "34px", margin: "0 auto"}}>
                <Pagination
                    hideOnSinglePage={true}
                    defaultCurrent={1}
                    total={this.props.total}
                    onChange={this.getTransfer.bind(this)}
                    style={{textAlign: "center"}}
                    showQuickJumper/>
            </div>
        )
    }
}

const GroupPanel = (props) => {
    let {pool: {walletIndexTitle: {current}}} = store.getState()
    let c1 = {b1: "", b2: ""};
    if (current === 1) {
        c1.b1 = "but-on";
    } else if (current === 2) {
        c1.b2 = "but-on";
    }
    return (
        <div className={"title-common"}>
            <Button block className={c1.b1} onClick={props.onclick.bind(this, 1, Config.changeWalletIndexMenu)}>
                {intl.get('POOL_WALLET')}
            </Button>
            <Button block className={c1.b2} onClick={props.onclick.bind(this, 2, Config.changeWalletIndexMenu)}>
                {intl.get('MY_WALLET')}
            </Button>
        </div>
    )
}

const MoreInfo = (props) => {
    return (
        <React.Fragment>
            <PagingInfo total={props.total} list={props.list}/>
            <GroupPanel onclick={CommonAction.changeCommonStatus}/>
        </React.Fragment>
    )
}

class MyWallet extends React.Component {
    state = {
        info: [],
        pid: 0,
        page: 1,
        total: 0
    }

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.props.changeCommon(0,Key.changeWalletIndexPid);
        this.setState = (state, callback) => {
            return
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {pool: {walletIndexPid: {current: old}}} = this.props.value;
        let {pool: {walletIndexPid: {current}}} = nextProps.value;
        this.state.pid = current;
        if (old !== current && current > 0) {
            this.getTranslateInfo()
        }
    }

    getTranslateInfo = (page = 1) => {
        const {uid, token} = cookie.loadAll();
        this.state.info = [];
        this.setState(this.state);
        Func.axiosPost("/pool/income/list", {
            user_id: uid,
            token: token,
            pool_id: this.state.pid,
            page: page
        }, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {total, data: list} = info;
            this.state.total = total;
            for (const value of list) {
                const {add_time:addTime,pay_id:pid,from_mining_id:from,to_mining_id:to,real_amount:amount,poundage,id} = value;
                this.state.info.push([addTime,pid,intl.get("SHIFT_OUT"),from,to,Func.coinExchange(amount),Func.coinExchange(poundage),1])
            }
            this.setState(this.state);
        } else {
            message.error(description);
        }
    }

    render() {
        let minerRow = Func.changeName(Rows.WalletList());
        const minerData = this.state.info;

        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <Table.TableCommon
                    style={{width: "1254px", marginTop: "78px"}}
                    icon={<Icon.MinerPoolIcon/>}
                    title={intl.get("POOL_PAGE")}
                    class={"pool-add-logo"}
                    type={"other"}
                >
                    <PoolIndexPanel/>
                </Table.TableCommon>
                <Table.TableCommon
                    style={{
                        width: "1254px",
                        height: "auto",
                        margin: "16px auto 100px",
                        position: "relative"
                    }}
                    icon={<Icon.MinerListIcon/>}
                    title={intl.get("INCOME_DETAIL")}
                    class={"wallet-roll-detail"}
                    row={minerRow}
                    type={"table"}
                    show={1}
                    text={minerData}
                    more={<MoreInfo total={this.state.total} list={this.getTranslateInfo.bind(this)}/>}
                    emptyStyle={{margin: "170px auto 0"}}
                />
            </React.Fragment>
        )
    }
}

const commonStateToProps = (state) => {
    return {value: state};
}

const indexDispatchToProps = (dispatch) => {
    return {
        changeCommon: (gid, key) => {
            dispatch(CommonAction.makeActionObject(gid, key))
        }
    }
}

const MyWalletApp = connect(
    commonStateToProps,
    indexDispatchToProps
)(MyWallet)

export default class Back extends Component {
    render() {
        return (
            <Initialize history={this.props.history}>
                <MyWalletApp history={this.props.history}/>
            </Initialize>
        )
    }
}