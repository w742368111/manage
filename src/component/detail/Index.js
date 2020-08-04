import React, {Component} from "react";
import * as Common from "../index/common/Public";
import {Menu, Dropdown, Button, message, Pagination, Input} from 'antd';
import cookie from "react-cookies";
import * as Func from "../../common/common";
import {connect} from "react-redux";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";
import {Line as LineChart} from "react-chartjs";
import intl from "react-intl-universal";
import DeviceIndex from "../device/Index";
import Initialize from "../Initialize";

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

class TopBanner extends Component {
    state = {
        info: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onRef(this)
        this.getPoolList()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    getPoolList = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/pool/list", {user_id: uid, token: token}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            let {detail: {poolIDCurrent: {current}}} = this.props.value;
            this.state.info = info;
            const [{id: pid}] = info;
            (current === 0) && this.props.commonUpdateUser(pid, Key.changeIndexPoolId)
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    changeTitle = (n) => {
        this.props.change(n);
    }

    changePid = (id) => {
        this.props.commonUpdateUser(id, Key.changeIndexPoolId)
    }

    render() {
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        let mName = "";

        const info = this.state.info.map((value, key) => {
            const {mining_name: miner, id} = value;
            let style = {paddingLeft:"33px",paddingRight:"33px",fontSize:"14px"};
            if (id === current) {
                mName = miner
                style = {paddingLeft:"33px",paddingRight:"33px",fontSize:"14px",color:"#1E87F0"};
            }
            return (
                <Menu.Item key={key}>
                    <a onClick={this.changePid.bind(this, id)} style={style}>
                        {miner}
                    </a>
                </Menu.Item>
            )
        })

        const menu = (
            <Menu>
                {info}
            </Menu>
        );

        const style = (this.props.menu === 1) ? ["on", ""] : ["", "on"]
        return (
            <div className={"new-pool-banner"}>
                <div className={"coin"}></div>
                <div className={"check"}>
                    <Dropdown overlay={menu} trigger={['click']} placement={"bottomCenter"}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            <span className={"title"}>{mName} &nbsp;</span>
                            <svg className="icon svg-icon oper-icon coin-top" aria-hidden="true">
                                <use xlinkHref="#iconico_arrow-down"></use>
                            </svg>
                        </a>
                    </Dropdown>
                </div>
                <Button onClick={this.changeTitle.bind(this, 1)} className={style[0]}
                        style={{left: "238px"}}>集群面板</Button>
                <Button onClick={this.changeTitle.bind(this, 2)} className={style[1]}
                        style={{left: "353px"}}>机器管理</Button>
            </div>
        )
    }
}

const TopBannerApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(TopBanner)

class PanelIncome extends Component {
    render() {
        const [today, total, account, wiredraw, left, income, pledge] = this.props.data;
        return (
            <div className={"top"}>
                <h3>账户收益</h3>
                <h4>今日收益 <span>{today ? Func.coinExchange(today) : 0}</span></h4>
                <div className={"hr"}></div>
                <p style={{left: "211px", top: "161px"}}>累计收益：{total ? Func.coinExchange(total) : 0}</p>
                <p style={{left: "211px", top: "212px"}}>账户余额：{account ? Func.coinExchange(account) : 0}</p>
                <p style={{left: "553px", top: "161px"}}>抽成支出：{wiredraw ? Func.coinExchange(wiredraw) : 0}</p>
                <p style={{left: "553px", top: "212px"}}>可用余额：{left ? Func.coinExchange(left) : 0}</p>
                <p style={{left: "882px", top: "161px"}}>我的收入：{income ? Func.coinExchange(income) : 0}</p>
                <p style={{left: "882px", top: "212px"}}>抵押金额：{pledge ? Func.coinExchange(pledge) : 0}</p>
            </div>
        )
    }
}

class PanelPower extends Component {
    render() {
        const [total, source, canUse, increase, time] = this.props.data;
        return (
            <div className={"left"}>
                <h3>算力</h3>
                <h4>有效算力 <span>{total ? Func.powerUnitChange(total) : `0GB`}</span></h4>
                <div style={{width: "668px"}} className={"hr"}></div>
                <p style={{left: "127px", top: "168px"}}>原值算力：{source ? Func.powerUnitChange(source) : '0GB'}</p>
                <p style={{left: "127px", top: "219px"}}>可储存算力：{canUse ? Func.powerUnitChange(canUse) : '0GB'}</p>
                <p style={{
                    left: "409px",
                    top: "168px"
                }}>近24h算力增量：{increase ? Func.powerUnitChange(increase) : '0GB'}</p>
                <p style={{left: "409px", top: "219px"}}>预计存满所需时间：{time} 天</p>
            </div>
        )
    }
}

class PanelMiner extends Component {
    getMinerList = (n) => {
        this.props.change(2, 0, n);
    }

    render() {
        const [allOnline, allOffline, sealOnline, sealOffline, proveOnline, proveOffline, storageOnline, storageOffline] = this.props.data;
        return (
            <div className={"right"}>
                <h3>机器</h3>
                <div className={"table"}>
                    <ul>
                        <li>
                            <p></p>
                            <p style={{fontSize: "15px"}}>在线</p>
                            <p style={{fontSize: "15px"}}>离线</p>
                        </li>
                        <li>
                            <p style={{fontWeight: 600}}>机器数：{(allOnline + allOffline) ? (allOnline + allOffline) : 0}</p>
                            <p>{allOnline ? allOnline : 0}</p>
                            {(allOffline > 0) ?
                                <p onClick={this.getMinerList.bind(this, -1)}
                                   style={{
                                       cursor: "pointer",
                                       color: "#F02C1E",
                                       textDecoration: "underline"
                                   }}>{allOffline}</p> :
                                <p>0</p>
                            }
                        </li>
                        <li>
                            <p>算力机：{(sealOnline + sealOffline) ? (sealOnline + sealOffline) : 0}</p>
                            <p>{sealOnline ? sealOnline : 0}</p>
                            {(sealOffline > 0) ?
                                <p onClick={this.getMinerList.bind(this, 1)}
                                   style={{
                                       cursor: "pointer",
                                       color: "#F02C1E",
                                       textDecoration: "underline"
                                   }}>{sealOffline}</p> :
                                <p>0</p>
                            }
                        </li>
                        <li>
                            <p>证明机：{(proveOnline + proveOffline) ? (proveOnline + proveOffline) : 0}</p>
                            <p>{proveOnline ? proveOnline : 0}</p>
                            {(proveOffline > 0) ?
                                <p onClick={this.getMinerList.bind(this, 10)}
                                   style={{
                                       cursor: "pointer",
                                       color: "#F02C1E",
                                       textDecoration: "underline"
                                   }}>{proveOffline}</p> :
                                <p>0</p>
                            }
                        </li>
                        <li>
                            <p>存储机：{(storageOnline + storageOffline) ? (storageOnline + storageOffline) : 0}</p>
                            <p>{storageOnline ? storageOnline : 0}</p>
                            {(storageOffline > 0) ?
                                <p onClick={this.getMinerList.bind(this, 3)}
                                   style={{
                                       cursor: "pointer",
                                       color: "#F02C1E",
                                       textDecoration: "underline"
                                   }}>{storageOffline}</p> :
                                <p>0</p>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

class PoolPanel extends Component {
    state = {
        info: {}
    }

    componentDidMount() {
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        (current !== 0) && this.getPoolInfo(current)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {detail: {poolIDCurrent: {current}}} = nextProps.value;
        let {detail: {poolIDCurrent: {current: oldValue}}} = this.props.value;
        if (current !== oldValue) {
            this.getPoolInfo(current)
        }
    }

    getPoolInfo = (pid) => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/pool/get", {user_id: uid, token: token, pool_id: pid}, this.syncCallBack)
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
        const {
            today_income: todayIncome, income_all: incomeAll, balance, income_poundage: incomePoundage, balance_free: balanceFree,
            income_my: incomeMy, mortgage
        } = this.state.info;
        const IncomeTotal = [todayIncome, incomeAll, balance, incomePoundage, balanceFree, incomeMy, mortgage];

        const {power, rb_power: rbPower, full_power: fullPower, power_add: powerAdd, power_full_days: days} = this.state.info
        const powerTotal = [power, rbPower, fullPower, powerAdd, days];

        const {
            device_count_online: allOnline, device_count_offline: allOffline, seal_count_online: sealOnline, seal_count_offline: sealOffline,
            prove_count_online: proveOnline, prove_count_offline: proveOffline, storage_count_online: storageOnline, storage_count_offline: storageOffline
        } = this.state.info;
        const minerTotal = [allOnline, allOffline, sealOnline, sealOffline, proveOnline, proveOffline, storageOnline, storageOffline];

        return (
            <div className={"panel-three"}>
                <PanelIncome data={IncomeTotal}/>
                <PanelPower data={powerTotal}/>
                <PanelMiner data={minerTotal} change={this.props.change}/>
                <div className={"clear"}></div>
            </div>
        )
    }
}

const PoolPanelApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(PoolPanel)


const chartOptions = {
    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: true,
    //String - Colour of the grid lines
    scaleGridLineColor: "rgba(0,0,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth: 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: false,
    //Boolean - Whether the line is curved between points
    bezierCurve: true,
    //Number - Tension of the bezier curve between points
    bezierCurveTension: 0.4,
    //Boolean - Whether to show a dot for each point
    pointDot: true,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 2,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth: 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius: 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke: true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth: 2,
    //Boolean - Whether to fill the dataset with a colour
    datasetFill: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",
    //Boolean - Whether to horizontally center the label and point dot inside the grid
    offsetGridLines: true
};

function add0(m) {
    return m < 10 ? '0' + m : m
}

class PowerTablePanel extends Component {
    state = {
        socket: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        title: ['','','','','','','','','','','','','','','','','','','','','','','',''],
    }

    componentDidMount() {
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        (current !== 0) && this.getPowerPanel(current)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {detail: {poolIDCurrent: {current}}} = nextProps.value;
        let {detail: {poolIDCurrent: {current: oldValue}}} = this.props.value;
        if (current !== oldValue) {
            this.getPowerPanel(current)
        }
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    getPowerPanel = (pid) => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/miner/powerLine", {user_id: uid, token: token, pool_id: pid}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            info.reverse();
            for (const key in info) {
                const {add_time: time, power} = info[key];
                if (key > 23) {
                    continue;
                }
                let date = new Date(time * 1000)
                this.state.socket[key] = power;
                this.state.title[key] = `${add0(date.getHours())}:${add0(date.getMinutes())}`;
            }
        } else {
            this.state = {
                socket: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                title: ['','','','','','','','','','','','','','','','','','','','','','','',''],
            }
            this.setState(this.state);
            message.error(description);
        }
        this.setState(this.state);
    }

    render() {
        const chartData = {
            labels: this.state.title,
            datasets: [
                {
                    label: intl.get("CPU_USE_RATE"),
                    fillColor: "rgba(0,216,160,0)",
                    strokeColor: "rgba(0,216,160,0.6)",
                    pointColor: "rgba(0,216,160,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.state.socket
                }
            ]
        };
        return (
            <div className={"pic-panel"}>
                <h3>算力曲线</h3>
                <div className={"svg"}>
                    <p style={{position:"absolute",left:"42px",top:"69px"}}>GB</p>
                    <LineChart data={chartData} options={chartOptions} width={1122} height={320}/>
                </div>
            </div>
        )
    }
}

const PowerTablePanelApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(PowerTablePanel)


class IncomeTablePanel extends Component {
    state = {
        socket: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        title: ['','','','','','','','','','','','','',''],
    }

    componentDidMount() {
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        (current !== 0) && this.getIncomeInfo(current)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {detail: {poolIDCurrent: {current}}} = nextProps.value;
        let {detail: {poolIDCurrent: {current: oldValue}}} = this.props.value;
        if (current !== oldValue) {
            this.getIncomeInfo(current)
        }
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    getIncomeInfo = (pid) => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/miner/incomeLine", {user_id: uid, token: token, pool_id: pid}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            info.reverse();
            for (const key in info) {
                if (key > 14) {
                    continue;
                }
                const {add_time: time, income} = info[key];
                let date = new Date(time * 1000)
                this.state.socket[key] = income;
                this.state.title[key] = `${add0(date.getMonth() + 1)}-${add0(date.getDate())}`;
            }
        } else {
            this.state = {
                socket: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                title: ['','','','','','','','','','','','','',''],
            }
            this.setState(this.state);
            message.error(description);
        }
        this.setState(this.state);
    }

    render() {
        const chartData = {
            labels: this.state.title,
            datasets: [
                {
                    label: intl.get("CPU_USE_RATE"),
                    fillColor: "rgba(64,129,216,0)",
                    strokeColor: "rgba(64,129,216,0.6)",
                    pointColor: "rgba(64,129,216,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.state.socket
                }
            ]
        };
        return (
            <div className={"pic-panel"}>
                <h3>收益曲线</h3>
                <div className={"svg"}>
                    <p style={{position:"absolute",left:"42px",top:"69px"}}>FIL</p>
                    <LineChart data={chartData} options={chartOptions} width={1122} height={320}/>
                </div>
            </div>
        )
    }
}

const IncomeTablePanelApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(IncomeTablePanel)


class IncomeIntoDetail extends Component {
    state = {
        menu: 1,
        page: 1,
        pageSize: 10,
        total: 0,
        info: []
    }

    componentDidMount() {
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        (current !== 0) && this.getIncomeInfo(current)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {detail: {poolIDCurrent: {current}}} = nextProps.value;
        let {detail: {poolIDCurrent: {current: oldValue}}} = this.props.value;
        if (current !== oldValue) {
            this.getIncomeInfo(current)
        }
    }

    getIncomeInfo = (pid) => {
        const {uid, token} = cookie.loadAll();
        let url = (this.state.menu === 1) ? `/pool/miner/incomeList` : `/pool/miner/payList`;
        const data = {
            user_id: uid,
            token: token,
            pool_id: pid,
            page: this.state.page,
            page_size: this.state.pageSize,
        }
        Func.axiosPost(url, data, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {total, data: list} = info;
            this.state.total = total;
            this.state.info = list;
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    changeMenu = (n) => {
        this.state.menu = n;
        this.state.page = 1;
        this.setState(this.state);
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        this.getIncomeInfo(current)
    }

    onChangePage = (e, f) => {
        this.state.page = (e === 0) ? 1 : e;
        this.state.pageSize = f
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        this.getIncomeInfo(current)
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }
    copyLong = (add) =>{
        Func.success(add);
    }

    render() {
        const style = (this.state.menu === 1) ? ["on", ""] : ["", "on"]
        const info = this.state.info.map((value, key) => {
            if (this.state.menu === 1) {
                const {pay_id: pid, from_mining_address: from, to_mining_address: to, add_time: time, amount} = value;
                return (
                    <div className={"single"} key={key}>
                        <p onClick={this.copyLong.bind(this,pid)} title={pid} style={{left: "60px", width: "260px"}}>{pid}</p>
                        <p style={{left: "439px"}}>{time}</p>
                        <p onClick={this.copyLong.bind(this,from)} title={from} style={{textAlign: "center", left: "671px", width: "270px"}}>{from}</p>
                        <p style={{textAlign: "center", left: "883px", width: "137px"}}>{to}</p>
                        <p style={{left: "1034px"}}>{amount} FIL</p>
                    </div>
                )
            } else {
                const {pay_id: pid, from_mining_id: from, to_mining_id: to, add_time: time, real_amount: amount} = value;
                return (
                    <div className={"single"} key={key}>
                        <p onClick={this.copyLong.bind(this,pid)} title={pid} style={{left: "60px", width: "260px"}}>{pid}</p>
                        <p style={{left: "439px"}}>{time}</p>
                        <p onClick={this.copyLong.bind(this,from)} title={from} style={{textAlign: "center", left: "671px", width: "270px"}}>{from}</p>
                        <p style={{textAlign: "center", left: "883px", width: "137px"}}>{to}</p>
                        <p style={{left: "1034px"}}>{amount} FIL</p>
                    </div>
                )
            }
        })
        return (
            <div className={"income-new-table"}>
                <h3>收益明细</h3>
                <Button onClick={this.changeMenu.bind(this, 1)} className={style[0]}
                        style={{left: "284px", top: "25px"}}>转入</Button>
                <Button onClick={this.changeMenu.bind(this, 2)} className={style[1]}
                        style={{left: "324px", top: "25px"}}>转出</Button>

                <div className={"table"}>
                    <div className={"title"}>
                        <p style={{left: "60px"}}>区块ID</p>
                        <p style={{left: "425px"}}>时间</p>
                        <p style={{left: "649px"}}>发送者</p>
                        <p style={{left: "862px"}}>收款者</p>
                        <p style={{left: "1020px"}}>金额</p>
                    </div>
                    <div className={"list"}>
                        {info}
                        <Pagination showQuickJumper defaultCurrent={1} total={this.state.total}
                                    onChange={this.onChangePage.bind(this)}
                                    onShowSizeChange={this.onChangePage.bind(this)}/>
                    </div>
                </div>
            </div>
        )
    }
}

const IncomeIntoDetailApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(IncomeIntoDetail)

class MinerManage extends Component {
    state = {
        page: 1,
        pageSize: 10,
        keyword: "",
        edit: 0,
        online: (this.props.online >= 0) ? this.props.online : -1,
        role: (this.props.type) ? this.props.type : -1,
        info: [],
        total: 0,
        on: 0,
        off: 0,
        cAddress: "",
        cLastId: 0,
        uAddress: "",
        uLastId: 0,
    }

    componentDidMount() {
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        (current !== 0) && this.getPoolDevice(current);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {detail: {poolIDCurrent: {current}}} = nextProps.value;
        let {detail: {poolIDCurrent: {current: oldValue}}} = this.props.value;
        if (current !== oldValue) {
            this.getPoolDevice(current)
        }
    }

    getPoolDevice = (n) => {
        const {uid, token} = cookie.loadAll();
        let data = {
            user_id: uid,
            token: token,
            pool_id: n,
            group_id: -1,
            is_online: this.state.online,
            page: this.state.page,
            miner_type: this.state.role,
            page_size: this.state.pageSize,
            keyword: this.state.keyword
        }
        this.state.info = [];
        this.setState(this.state);
        Func.axiosPost("/pool/device/list", data, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {current_page: page, data: list, device_offline: offline, device_online: online, total} = info;
            this.state.page = page;
            this.state.total = total;
            this.state.on = online;
            this.state.off = offline;
            this.state.info = list;
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    onChangePage = (page, size) => {
        this.state.page = page;
        this.state.pageSize = size;
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        this.getPoolDevice(current)
    }

    changeEdit = (n) => {
        this.state.edit = n;
        this.setState(this.state)
        if (n === 0) {
            let {detail: {poolIDCurrent: {current}}} = this.props.value;
            this.getPoolDevice(current)
        }
    }

    openPanel = (id, hid) => {
        this.props.commonUpdateUser(id, Key.currentOperateDevice);
        this.props.commonUpdateUser(hid, Key.currentOperateHardware);
    }

    changeKeyWord = (e) => {
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        this.getPoolDevice(current)
    }

    changeValue = (e) => {
        this.state.keyword = e.target.value;
        this.setState(this.state);
    }

    clearKeyword = () => {
        this.state.keyword = "";
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        this.setState(this.state);
        this.getPoolDevice(current)
    }

    changeState = (key, value) => {
        if(key === 'role'){
            this.state.page = 1;
        }
        this.state[key] = value;
        this.setState(this.state);
        let {detail: {poolIDCurrent: {current}}} = this.props.value;
        this.getPoolDevice(current)
    }

    changeAddressState = (name, id, e) => {
        if (name === 'cAddress') {
            this.state.cLastId = id;
        } else if (name === 'uAddress') {
            this.state.uLastId = id;
        }
        this.state[name] = e.target.value;
    }

    changeUAddress = (name, id, def) => {
        if ((name === 'box' && id !== this.state.cLastId) || (name === 'box' && def === this.state.cAddress)) {
            message.error("未作修改");
            return;
        }
        if ((name === 'u' && id !== this.state.uLastId) || name === 'u' && def === this.state.uAddress) {
            message.error("未作修改");
            return;
        }
        const {uid, token} = cookie.loadAll();
        const data = {
            user_id: uid,
            token: token,
            device_id: id,
            cabinet_address: (name === 'box') ? this.state.cAddress : "NULL",
            u_address: (name === 'u') ? this.state.uAddress : "NULL",
        }
        Func.axiosPost("/pool/device/editCabinet", data, this.editCallBack)
    }

    editCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            message.success("修改成功");
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
        const title = (this.state.edit === 0) ? [22, 136, 225, 334, 415, 543, 639, 766, 910, 1053, 1151] :
            [22, 128, 219, 356, 459, 580, 668, 788, 924, 1045, 1151];
        const text = (this.state.edit === 0) ? [22, 136, 225, 334, 415, 543, 666, 766, 910, 1069, 1153] :
            [22, 128, 211, 346, 459, 580, 694, 788, 924, 1063, 1153];
        const role = (
            <Menu>
                <Menu.Item onClick={this.changeState.bind(this, "role", -1)}>
                    全部
                </Menu.Item>
                <Menu.Item onClick={this.changeState.bind(this, "role", 10)}>
                    证明机
                </Menu.Item>
                <Menu.Item onClick={this.changeState.bind(this, "role", 1)}>
                    算力机
                </Menu.Item>
                <Menu.Item onClick={this.changeState.bind(this, "role", 3)}>
                    存储机
                </Menu.Item>
            </Menu>
        );

        const online = (
            <Menu>
                <Menu.Item onClick={this.changeState.bind(this, "online", -1)}>
                    全部
                </Menu.Item>
                <Menu.Item onClick={this.changeState.bind(this, "online", 1)}>
                    在线
                </Menu.Item>
                <Menu.Item onClick={this.changeState.bind(this, "online", 0)}>
                    离线
                </Menu.Item>
            </Menu>
        );

        const info = this.state.info.map((value, key) => {
            const {
                address, cabinet_address: cabinetAddress, disk_rate: diskRate, disk_space_all: spaceAll, disk_space_used: spaceUsed,
                hardware_id: hardwareId, id, in_ip: inIp, ip_manage: ipManage, is_online: isOnline, last_offline: offline,
                last_online: online, miner_type: type, name, pool_id: pid, pool_name: pName, u_address: uAddress
            } = value;
            return (
                <div className={"single"} key={key}>
                    <p style={{left: `${text[0]}px`}}>{name}</p>
                    <p style={{left: `${text[1]}px`, transform: "none"}}>
                        {(type === 1) ? "算力机" : <></>}
                        {(type === 3) ? "存储机" : <></>}
                        {(type === 5) ? "证明机" : <></>}
                        {(type === 7) ? "证明机" : <></>}
                        {(type === 9) ? "证明机" : <></>}
                        {(type === 0) ? "未设定" : <></>}
                    </p>
                    {(this.state.edit === 0) ?
                        <p className={"tran"} style={{left: `${text[2]}px`, transform: "none"}}>{cabinetAddress}</p> :
                        <p className={"tran"} style={{left: `${text[2]}px`, transform: "none", width: "120px"}}>
                            <Input onPressEnter={this.changeUAddress.bind(this, "box", id, cabinetAddress)}
                                // onBlur={this.changeUAddress.bind(this, "box", id, cabinetAddress)}
                                   onClick={this.changeAddressState.bind(this, "cAddress", id)}
                                   onChange={this.changeAddressState.bind(this, "cAddress", id)} className={"mod"}
                                   defaultValue={cabinetAddress}/>
                            <svg onClick={this.changeUAddress.bind(this, "box", id, cabinetAddress)}
                                 style={{marginLeft: "10px"}}
                                 className="icon svg-icon oper-icon coin1"
                                 aria-hidden="true">
                                <use xlinkHref="#iconicon_save"></use>
                            </svg>
                        </p>
                    }
                    {(this.state.edit === 0) ?
                        <p className={"tran"} style={{left: `${text[3]}px`, transform: "none"}}>{uAddress}</p> :
                        <p className={"tran"} style={{left: `${text[3]}px`, transform: "none", width: "80px"}}>
                            <Input style={{height: "20px"}}
                                   onPressEnter={this.changeUAddress.bind(this, "u", id, uAddress)}
                                // onBlur={this.changeUAddress.bind(this, "u", id, uAddress)}
                                   onClick={this.changeAddressState.bind(this, "uAddress", id)}
                                   onChange={this.changeAddressState.bind(this, "uAddress", id)} style={{width: "52px"}}
                                   className={"mod"} defaultValue={uAddress}/>
                            <svg onClick={this.changeUAddress.bind(this, "u", id, uAddress)}
                                 style={{marginLeft: "10px"}}
                                 className="icon svg-icon oper-icon coin1"
                                 aria-hidden="true">
                                <use xlinkHref="#iconicon_save"></use>
                            </svg>
                        </p>
                    }
                    <p style={{left: `${text[4]}px`, transform: "none"}}>{ipManage}</p>
                    <p style={{left: `${text[5]}px`, transform: "none"}}>{inIp}</p>
                    <p style={{left: `${text[6]}px`, transform: "none"}}>{parseInt(diskRate)}%</p>
                    <p style={{left: `${text[7]}px`, transform: "none"}}>{online.substring(5)}</p>
                    <p style={{left: `${text[8]}px`, transform: "none"}}>{offline.substring(5)}</p>
                    <p style={{left: `${text[9]}px`, transform: "none"}}>
                        {(isOnline === 1) ?
                            <React.Fragment>在线</React.Fragment> : <span style={{color: "#F02C1E"}}>离线</span>
                        }
                    </p>
                    <p style={{left: `${text[10]}px`, transform: "none",paddingLeft:"6px"}}>
                        <svg onClick={this.openPanel.bind(this, id, hardwareId)}
                             className="icon svg-icon oper-icon coin1"
                             aria-hidden="true">
                            <use xlinkHref="#iconlist_icon_arrow_nor"></use>
                        </svg>
                    </p>
                </div>
            )
        })

        return (
            <div className={"income-new-table"} style={{overflow: "hidden"}}>
                <div className={"coin"}></div>
                <h3 style={{left: "91px", top: "21px"}}>机器管理</h3>
                {(this.state.edit === 0) ?
                    <Button onClick={this.changeEdit.bind(this, 1)} className={"edit"}>机位编辑</Button> :
                    <Button onClick={this.changeEdit.bind(this, 0)} className={"edit"}>退出编辑</Button>
                }
                <Input value={this.state.keyword} onChange={this.changeValue.bind(this)}
                       onPressEnter={this.changeKeyWord.bind(this)} className={"key"} placeholder={"机器名称/机柜"} suffix={
                    <svg onClick={this.changeKeyWord.bind(this)} className="icon svg-icon oper-icon coin1"
                         aria-hidden="true"
                         style={{height: "25px", width: "25px", marginTop: "3px"}}>
                        <use xlinkHref="#iconicon_search"></use>
                    </svg>
                }/>
                <Button onClick={this.clearKeyword.bind(this, "")} className={"clear"}>清除</Button>
                <div className={"table"} style={{marginTop: "50px", marginBottom: "0px"}}>
                    <div className={"title"}>
                        <p style={{left: `${title[0]}px`}}>机器名称</p>
                        <p style={{left: `${title[1]}px`}}>
                            <Dropdown overlay={role} trigger={['click']}>
                                <a style={{color: "#394565"}} className="ant-dropdown-link"
                                   onClick={e => e.preventDefault()}>
                                    角色
                                    <svg className="icon svg-icon oper-icon coin1" aria-hidden="true">
                                        <use xlinkHref="#iconico_arrow_pull2"></use>
                                    </svg>
                                </a>
                            </Dropdown>
                        </p>
                        <p style={{left: `${title[2]}px`}}>所在机柜</p>
                        <p style={{left: `${title[3]}px`}}>U位</p>
                        <p style={{left: `${title[4]}px`}}>管理IP</p>
                        <p style={{left: `${title[5]}px`}}>内网IP</p>
                        <p style={{left: `${title[6]}px`}}>存储使用占比</p>
                        <p style={{left: `${title[7]}px`}}>上线时间</p>
                        <p style={{left: `${title[8]}px`}}>离线时间</p>
                        <p style={{left: `${title[9]}px`}}>
                            <Dropdown overlay={online} trigger={['click']}>
                                <a style={{color: "#394565"}} className="ant-dropdown-link"
                                   onClick={e => e.preventDefault()}>
                                    机器状态
                                    <svg className="icon svg-icon oper-icon coin1" aria-hidden="true">
                                        <use xlinkHref="#iconico_arrow_pull2"></use>
                                    </svg>
                                </a>
                            </Dropdown>
                        </p>
                        <p style={{left: `${title[10]}px`}}>详情</p>
                    </div>
                    <div className={"list machine-list"}>
                        {info}
                        <div className={"box"}>
                            <p style={{left: "10px"}}>总数：{this.state.total}台</p>
                            <p style={{left: "102px"}}>在线：{this.state.on}台</p>
                            <p style={{left: "192px"}}>离线：{this.state.off}台</p>
                        </div>

                        <Pagination showQuickJumper defaultCurrent={1} total={this.state.total}
                                    onShowSizeChange={this.onChangePage.bind(this)}
                                    onChange={this.onChangePage.bind(this)}/>
                    </div>
                </div>
            </div>
        )
    }
}


const MinerManageApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(MinerManage)


class Index extends Component {
    state = {
        menu: 1,
        online: -1,
        type: -1
    }

    onRef = (ref) => {
        this.child = ref
    }

    changeMenu = (n, online, type) => {
        this.state.menu = n;
        this.state.online = online;
        this.state.type = type;
        this.setState(this.state);
    }

    render() {
        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <TopBannerApp menu={this.state.menu} change={this.changeMenu} onRef={this.onRef}/>
                {this.state.menu === 1 ?
                    <React.Fragment>
                        <PoolPanelApp change={this.changeMenu}/>
                        <PowerTablePanelApp/>
                        <IncomeTablePanelApp/>
                        <IncomeIntoDetailApp/>
                    </React.Fragment> : <MinerManageApp online={this.state.online} type={this.state.type}/>
                }
                <DeviceIndex/>
            </React.Fragment>
        )
    }
}


export default class Back extends Component {
    render() {
        return (
            <Initialize history={this.props.history}>
                <Index history={this.props.history}/>
            </Initialize>
        )
    }
}
