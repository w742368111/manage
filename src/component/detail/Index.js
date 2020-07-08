import React, {Component} from "react";
import * as Common from "../index/common/Public";
import {Menu, Dropdown, Button, message, Pagination} from 'antd';
import cookie from "react-cookies";
import * as Func from "../../common/common";
import {connect} from "react-redux";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";
import {Line as LineChart} from "react-chartjs";
import intl from "react-intl-universal";

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
            if (id === current) {
                mName = miner
            }
            return (
                <Menu.Item key={key}>
                    <a onClick={this.changePid.bind(this, id)}>
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
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            <span className={"title"}>{mName} &nbsp;</span>
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
    render() {
        const [allOnline, allOffline, sealOnline, sealOffline, proveOnline, proveOffline, storageOnline, storageOffline] = this.props.data;
        return (
            <div className={"right"}>
                <h3>矿机</h3>
                <div className={"table"}>
                    <ul>
                        <li>
                            <p></p>
                            <p style={{fontSize: "15px"}}>在线</p>
                            <p style={{fontSize: "15px"}}>离线</p>
                        </li>
                        <li>
                            <p style={{fontWeight: 600}}>矿机数：{(allOnline + allOffline) ? (allOnline + allOffline) : 0}</p>
                            <p>{allOnline ? allOnline : 0}</p>
                            {(allOffline > 0) ?
                                <p style={{color: "#F02C1E", textDecoration: "underline"}}>{allOffline}</p> :
                                <p>0</p>
                            }
                        </li>
                        <li>
                            <p>算力机：{(sealOnline + sealOffline) ? (sealOnline + sealOffline) : 0}</p>
                            <p>{sealOnline ? sealOnline : 0}</p>
                            {(sealOffline > 0) ?
                                <p style={{color: "#F02C1E", textDecoration: "underline"}}>{sealOffline}</p> :
                                <p>0</p>
                            }
                        </li>
                        <li>
                            <p>证明机：{(proveOnline + proveOffline) ? (proveOnline + proveOffline) : 0}</p>
                            <p>{proveOnline ? proveOnline : 0}</p>
                            {(proveOffline > 0) ?
                                <p style={{color: "#F02C1E", textDecoration: "underline"}}>{proveOffline}</p> :
                                <p>0</p>
                            }
                        </li>
                        <li>
                            <p>存储机：{(storageOnline + storageOffline) ? (storageOnline + storageOffline) : 0}</p>
                            <p>{storageOnline ? storageOnline : 0}</p>
                            {(storageOffline > 0) ?
                                <p style={{color: "#F02C1E", textDecoration: "underline"}}>{storageOffline}</p> :
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
                <PanelMiner data={minerTotal}/>
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
    pointDot: false,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 4,
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
    offsetGridLines: false
};


class PowerTablePanel extends Component {
    state = {
        socket: [10, 20, 15, 45, 2, 23, 54, 12, 40, 20, 10, 50, 10, 20, 10, 30, 12, 40, 20, 10, 50, 10, 20, 10, 30],
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {detail: {poolIDCurrent: {current}}} = nextProps.value;
        let {detail: {poolIDCurrent: {current: oldValue}}} = this.props.value;
        if (current !== oldValue) {
            this.getPowerPanel(current)
        }
    }

    getPowerPanel = (pid) => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/miner/powerLine", {user_id: uid, token: token, pool_id: pid}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        console.log(data);
    }

    render() {
        const chartData = {
            labels: [
                "14:00",
                "14:00",
                "14:00",
                "14:00",
                "14:00",

                "14:00",
                "14:00",
                "14:00",
                "14:00",
                "14:00",

                "14:00",
                "14:00",
                "14:00",
                "14:00",
                "14:00",

                "14:00",
                "14:00",
                "14:00",
                "14:00",
                "14:00",

                "14:00",
                "14:00",
                "14:00",
                "14:00"
            ],
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
        socket: [10, 20, 15, 45, 2, 23, 54, 12, 40, 20, 10, 50, 10, 20, 10, 30, 12, 40, 20, 10, 50, 10, 20, 10, 30],
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
        Func.axiosPost("/pool/miner/incomeLine", {user_id: uid, token: token, pool_id: pid}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        console.log(data);
    }

    render() {
        const chartData = {
            labels: [
                "14:00",
                "14:00",
                "14:00",
                "14:00",
                "14:00",

                "14:00",
                "14:00",
                "14:00",
                "14:00",
                "14:00",

                "14:00",
                "14:00",
                "14:00",
                "14:00",
                "14:00",

                "14:00",
                "14:00",
                "14:00",
                "14:00",
                "14:00",

                "14:00",
                "14:00",
                "14:00",
                "14:00"
            ],

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
        menu: 2
    }
    changeMenu = (n) => {
        this.state.menu = n;
        this.setState(this.state);
    }
    onChangePage = (e) =>{
        console.log(e);
    }

    render() {
        const style = (this.state.menu === 1) ? ["on", ""] : ["", "on"]
        return (
            <div className={"income-new-table"}>
                <h3>收益明细</h3>
                <Button onClick={this.changeMenu.bind(this, 1)} className={style[0]}
                        style={{left: "284px", top: "25px"}}>转入</Button>
                <Button onClick={this.changeMenu.bind(this, 2)} className={style[1]}
                        style={{left: "324px", top: "25px"}}>转出</Button>

                <div className={"table"}>
                    <div className={"title"}>
                        <p style={{left: "60px"}}>消息ID</p>
                        <p style={{left: "425px"}}>时间</p>
                        <p style={{left: "649px"}}>发送者</p>
                        <p style={{left: "862px"}}>收款者</p>
                        <p style={{left: "1020px"}}>金额</p>
                    </div>
                    <div className={"list"}>
                        <div className={"single"}>
                            <p style={{left: "60px"}}>bafy2bzacea2n52y7r3vqixb2vfpny</p>
                            <p style={{left: "439px"}}>2020-06-30 10:00:00</p>
                            <p style={{left: "671px"}}>baffdsfj234dfjfk11111</p>
                            <p style={{left: "883px"}}>t01001</p>
                            <p style={{left: "1034px"}}>104.123 FIL</p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "60px"}}>bafy2bzacea2n52y7r3vqixb2vfpny</p>
                            <p style={{left: "439px"}}>2020-06-30 10:00:00</p>
                            <p style={{left: "671px"}}>baffdsfj234dfjfk11111</p>
                            <p style={{left: "883px"}}>t01001</p>
                            <p style={{left: "1034px"}}>104.123 FIL</p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "60px"}}>bafy2bzacea2n52y7r3vqixb2vfpny</p>
                            <p style={{left: "439px"}}>2020-06-30 10:00:00</p>
                            <p style={{left: "671px"}}>baffdsfj234dfjfk11111</p>
                            <p style={{left: "883px"}}>t01001</p>
                            <p style={{left: "1034px"}}>104.123 FIL</p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "60px"}}>bafy2bzacea2n52y7r3vqixb2vfpny</p>
                            <p style={{left: "439px"}}>2020-06-30 10:00:00</p>
                            <p style={{left: "671px"}}>baffdsfj234dfjfk11111</p>
                            <p style={{left: "883px"}}>t01001</p>
                            <p style={{left: "1034px"}}>104.123 FIL</p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "60px"}}>bafy2bzacea2n52y7r3vqixb2vfpny</p>
                            <p style={{left: "439px"}}>2020-06-30 10:00:00</p>
                            <p style={{left: "671px"}}>baffdsfj234dfjfk11111</p>
                            <p style={{left: "883px"}}>t01001</p>
                            <p style={{left: "1034px"}}>104.123 FIL</p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "60px"}}>bafy2bzacea2n52y7r3vqixb2vfpny</p>
                            <p style={{left: "439px"}}>2020-06-30 10:00:00</p>
                            <p style={{left: "671px"}}>baffdsfj234dfjfk11111</p>
                            <p style={{left: "883px"}}>t01001</p>
                            <p style={{left: "1034px"}}>104.123 FIL</p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "60px"}}>bafy2bzacea2n52y7r3vqixb2vfpny</p>
                            <p style={{left: "439px"}}>2020-06-30 10:00:00</p>
                            <p style={{left: "671px"}}>baffdsfj234dfjfk11111</p>
                            <p style={{left: "883px"}}>t01001</p>
                            <p style={{left: "1034px"}}>104.123 FIL</p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "60px"}}>bafy2bzacea2n52y7r3vqixb2vfpny</p>
                            <p style={{left: "439px"}}>2020-06-30 10:00:00</p>
                            <p style={{left: "671px"}}>baffdsfj234dfjfk11111</p>
                            <p style={{left: "883px"}}>t01001</p>
                            <p style={{left: "1034px"}}>104.123 FIL</p>
                        </div>
                        <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.onChangePage.bind(this)} />
                    </div>
                </div>
            </div>
        )
    }
}

class MinerManage extends Component{
    onChangePage = (e) =>{
        console.log(e);
    }
    render() {
        return (
            <div className={"income-new-table"} style={{overflow:"hidden"}}>
                <h3>矿机管理</h3>
                <div className={"table"} style={{marginTop:"86px",marginBottom:"0px"}}>
                    <div className={"title"}>
                        <p style={{left: "22px"}}>矿机名称</p>
                        <p style={{left: "136px"}}>角色</p>
                        <p style={{left: "225px"}}>所在机柜</p>
                        <p style={{left: "334px"}}>U位</p>
                        <p style={{left: "415px"}}>管理IP</p>
                        <p style={{left: "543px"}}>内网IP</p>
                        <p style={{left: "639px"}}>存储使用占比</p>
                        <p style={{left: "766px"}}>上线时间</p>
                        <p style={{left: "910px"}}>离线时间</p>
                        <p style={{left: "1053px"}}>矿机状态</p>
                        <p style={{left: "1151px"}}>详情</p>
                    </div>
                    <div className={"list"}>
                        <div className={"single"}>
                            <p style={{left: "22px"}}>ARS-098</p>
                            <p style={{left: "136px",transform:"none"}}>证明机</p>
                            <p style={{left: "225px",transform:"none"}}>C1-04-01</p>
                            <p style={{left: "334px",transform:"none"}}>1+2U</p>
                            <p style={{left: "415px",transform:"none"}}>211.10.11.02</p>
                            <p style={{left: "543px",transform:"none"}}>10.0.0.2</p>
                            <p style={{left: "639px",transform:"none"}}>1.2%</p>
                            <p style={{left: "766px",transform:"none"}}>07-01 14:15:00</p>
                            <p style={{left: "910px",transform:"none"}}>07-01 14:15:00</p>
                            <p style={{left: "1053px",transform:"none"}}>在线</p>
                            <p style={{left: "1151px",transform:"none"}}>
                                <svg className="icon svg-icon oper-icon coin1" aria-hidden="true">
                                    <use xlinkHref="#iconlist_icon_arrow_nor"></use>
                                </svg>
                            </p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "22px"}}>ARS-098</p>
                            <p style={{left: "136px",transform:"none"}}>证明机</p>
                            <p style={{left: "225px",transform:"none"}}>C1-04-01</p>
                            <p style={{left: "334px",transform:"none"}}>1+2U</p>
                            <p style={{left: "415px",transform:"none"}}>211.10.11.02</p>
                            <p style={{left: "543px",transform:"none"}}>10.0.0.2</p>
                            <p style={{left: "639px",transform:"none"}}>1.2%</p>
                            <p style={{left: "766px",transform:"none"}}>07-01 14:15:00</p>
                            <p style={{left: "910px",transform:"none"}}>07-01 14:15:00</p>
                            <p style={{left: "1053px",transform:"none"}}>在线</p>
                            <p style={{left: "1151px",transform:"none"}}>
                                <svg className="icon svg-icon oper-icon coin1" aria-hidden="true">
                                    <use xlinkHref="#iconlist_icon_arrow_nor"></use>
                                </svg>
                            </p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "22px"}}>ARS-098</p>
                            <p style={{left: "136px",transform:"none"}}>证明机</p>
                            <p style={{left: "225px",transform:"none"}}>C1-04-01</p>
                            <p style={{left: "334px",transform:"none"}}>1+2U</p>
                            <p style={{left: "415px",transform:"none"}}>211.10.11.02</p>
                            <p style={{left: "543px",transform:"none"}}>10.0.0.2</p>
                            <p style={{left: "639px",transform:"none"}}>1.2%</p>
                            <p style={{left: "766px",transform:"none"}}>07-01 14:15:00</p>
                            <p style={{left: "910px",transform:"none"}}>07-01 14:15:00</p>
                            <p style={{left: "1053px",transform:"none"}}>在线</p>
                            <p style={{left: "1151px",transform:"none"}}>
                                <svg className="icon svg-icon oper-icon coin1" aria-hidden="true">
                                    <use xlinkHref="#iconlist_icon_arrow_nor"></use>
                                </svg>
                            </p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "22px"}}>ARS-098</p>
                            <p style={{left: "136px",transform:"none"}}>证明机</p>
                            <p style={{left: "225px",transform:"none"}}>C1-04-01</p>
                            <p style={{left: "334px",transform:"none"}}>1+2U</p>
                            <p style={{left: "415px",transform:"none"}}>211.10.11.02</p>
                            <p style={{left: "543px",transform:"none"}}>10.0.0.2</p>
                            <p style={{left: "639px",transform:"none"}}>1.2%</p>
                            <p style={{left: "766px",transform:"none"}}>07-01 14:15:00</p>
                            <p style={{left: "910px",transform:"none"}}>07-01 14:15:00</p>
                            <p style={{left: "1053px",transform:"none"}}>在线</p>
                            <p style={{left: "1151px",transform:"none"}}>
                                <svg className="icon svg-icon oper-icon coin1" aria-hidden="true">
                                    <use xlinkHref="#iconlist_icon_arrow_nor"></use>
                                </svg>
                            </p>
                        </div>
                        <div className={"single"}>
                            <p style={{left: "22px"}}>ARS-098</p>
                            <p style={{left: "136px",transform:"none"}}>证明机</p>
                            <p style={{left: "225px",transform:"none"}}>C1-04-01</p>
                            <p style={{left: "334px",transform:"none"}}>1+2U</p>
                            <p style={{left: "415px",transform:"none"}}>211.10.11.02</p>
                            <p style={{left: "543px",transform:"none"}}>10.0.0.2</p>
                            <p style={{left: "639px",transform:"none"}}>1.2%</p>
                            <p style={{left: "766px",transform:"none"}}>07-01 14:15:00</p>
                            <p style={{left: "910px",transform:"none"}}>07-01 14:15:00</p>
                            <p style={{left: "1053px",transform:"none"}}>在线</p>
                            <p style={{left: "1151px",transform:"none"}}>
                                <svg className="icon svg-icon oper-icon coin1" aria-hidden="true">
                                    <use xlinkHref="#iconlist_icon_arrow_nor"></use>
                                </svg>
                            </p>
                        </div>
                        






                        <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.onChangePage.bind(this)} />
                    </div>
                </div>
            </div>
        )
    }
}


export default class Index extends Component {
    state = {
        menu: 1
    }
    onRef = (ref) => {
        this.child = ref
    }
    changeMenu = (n) => {
        this.state.menu = n
        this.setState(this.state);
    }

    render() {
        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <TopBannerApp menu={this.state.menu} change={this.changeMenu} onRef={this.onRef}/>
                {this.state.menu === 1 ?
                    <React.Fragment>
                        <PoolPanelApp/>
                        <PowerTablePanelApp/>
                        <IncomeTablePanelApp/>
                        <IncomeIntoDetail/>
                    </React.Fragment> : <React.Fragment>
                        <MinerManage/>
                    </React.Fragment>
                }

            </React.Fragment>
        )
    }
}