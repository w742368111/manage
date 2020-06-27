import React, {Component} from "react";
import * as Common from "../index/common/Public";
import {Button, message, Pagination, Input} from "antd";
import intl from "react-intl-universal";
import * as Table from "../common/Table";
import * as Icon from "../common/Icon";
import * as Func from "../../common/common";
import * as Rows from "../common/RowSet";
import store from "../../store";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";
import cookie from "react-cookies";
import Initialize from "../Initialize";

class LicenseDetail extends Component {
    state = {
        page: 1,
        total: 0,
        info: []
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    componentDidMount() {
        this.getLicense();
    }

    changePage = (value) => {
        this.state.page = value;
        this.getLicense()
    }

    getLicense() {
        const {uid, token} = cookie.loadAll();
        this.state.info = [];
        this.state.total = 0;
        this.setState(this.state)
        Func.axiosPost("/pool/license/list", {user_id: uid, token: token, page: this.state.page}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {current_page: page, total, data: list} = info;
            this.state.total = total;
            for (const val of list) {
                const {id, ip, license, name, production_type: type, status} = val;
                this.state.info.push([
                    license, name, intl.get("ADVANCE_RIVER_TEST"), ip, (status === 1) ? intl.get("ALREADY_IN_USED") : intl.get("NOT_IN_USED"), status
                ])
            }
            this.setState(this.state);
        } else {
            message.error(description);
        }
    }

    render() {
        let minerRow = Func.changeName(Rows.LicenseList());
        let AllMiner = this.state.info
        return (
            <div className={"license-table"}>
                <Table.TableCommon
                    style={{marginTop: "118px"}}
                    icon={<Icon.MinerTestIcon/>}
                    title={intl.get("LICENSE_DETAIL")}
                    type={"other"}
                    emptyStyle={{margin: "170px auto 0"}}
                />
                <Table.RowName row={minerRow} show={1}/>
                <Table.TableInner row={minerRow} text={AllMiner}/>
                <Pagination
                    hideOnSinglePage={true}
                    defaultCurrent={1}
                    pageSizeOptions={[10]}
                    total={this.state.total}
                    onChange={this.changePage.bind(this)}
                    showQuickJumper/>
            </div>
        )
    }
}

// 建议信息展示面板
const ConfigAdvice = () => {
    const advice = [
        intl.get("CONFIG_ADVICE_1"),
        intl.get("CONFIG_ADVICE_2"),
        intl.get("CONFIG_ADVICE_3"),
        intl.get("CONFIG_ADVICE_4"),
        intl.get("CONFIG_ADVICE_5"),
        intl.get("CONFIG_ADVICE_6"),
        intl.get("CONFIG_ADVICE_7"),
        intl.get("CONFIG_ADVICE_8"),
        intl.get("CONFIG_ADVICE_9"),
    ]
    const info = advice.map((val, key) => {
        return (
            <p key={key}>{val}</p>
        )
    })
    return (
        <div className={"common"}>
            <h4 className={"title"}>{intl.get("CONFIG_SUGGEST")}</h4>
            <div className={"main"}>
                {info}
            </div>
        </div>
    )
}

// 操作面板
const OperatePanel = () => {
    const icon = <svg className="icon svg-icon oper-icon coin2" aria-hidden="true"
                      style={{width: "36px", height: "36px", marginTop: "-2px"}}>
        <use xlinkHref="#iconicon_and"></use>
    </svg>
    return (
        <div className={"common"}>
            <h4 className={"title"}>{intl.get("TEST_MINER")}</h4>
            <div className={"main"}>
                <div className={"search"}>
                    <p className={"tip1"}>{intl.get("SYSTEM_VERSION")}</p>
                    <p className={"tip2"}>{intl.get("COMPUTER_IP_ADDRESS")}</p>
                    <Input defaultValue={"Hos 3.2.0"} className={"type"} suffix={icon}
                           style={{left: "270px", width: "282px"}}/>
                    <Input defaultValue={"192.168.3.2"} className={"type"}
                           style={{left: "270px", width: "216px", top: "96px"}}/>
                    <Button style={{left: "514px"}} className={"but"}>{intl.get("SCAN_MINER")}</Button>
                    <Button style={{left: "604px"}}
                            className={"but"}>{intl.get("CLEAR_OPERATE_RECORD")}</Button>
                    <Button className={"submit"} type="primary">{intl.get("BEGIN_TO_CHECK")}</Button>
                </div>
            </div>
        </div>
    )
}

class TestMinerResult extends Component{
    state = {
        status : 1
    }

    render() {
        const result = [
            ["cpu","型号：E5 8核 3.3GHz","","通过"],
            ["内存","大小：128G","","通过"],
            ["系统盘","大小：256G","类型：SSD/SATA/M.2","通过"],
            ["缓存盘","大小：512G","类型：SSD/SATA/M.2","通过"],
            ["网口","数量：12","是否ping通：是","通过"],
            ["RAID卡","数量：12","","通过"],
            ["IPMI","数量：12","","通过"],
            ["万兆网卡","数量：12","是否ping通：是","通过"],
        ]

        const info = result.map((value,key) =>{
            const [p1,p2,p3,p4] = value
            return (
                <div className={"list"} key={key}>
                    <p className={"p1"}>{p1}</p>
                    <p className={"p2"}>{p2}</p>
                    <p className={"p3"}>{p3}</p>
                    <p className={"p4"}>{p4}</p>
                </div>
            )
        })

        const cfg = () =>{
            if(this.state.status === 0){
                return ["circle","#iconProduction-test_icon_pass","NOT_TEST"]
            }else if(this.state.status === 1){
                return ["circle pass","#iconicon_13","TEST_PASS"]
            }else{
                return ["circle bad","#iconicon_2","TEST_NOT_PASS"]
            }
        }

        const [cname,icon,tip] = cfg();

        return(
            <div className={"common"}>
                <h4 className={"title"}>{intl.get("MINER_TEST_RESULT")}</h4>
                <div className={"test-result-show"}>
                    <div className={"table"}>
                        {info}
                    </div>
                    <div className={"result-show"}>
                        <div className={cname}>
                            <svg className="icon svg-icon oper-icon" aria-hidden="true">
                                <use xlinkHref={icon}></use></svg>
                            <h6>{intl.get(tip)}</h6>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const TestMainArea = () => {

    return (
        <div className={"license-table"}>
            <Table.TableCommon
                style={{marginTop: "118px"}}
                icon={<Icon.MinerTestIcon/>}
                title={intl.get("MINER_TEST")}
                type={"other"}
                class={"test-main-area"}
                emptyStyle={{margin: "170px auto 0"}}
            >
                <ConfigAdvice/>
                <OperatePanel/>
                <TestMinerResult/>
                <Button className={"upload-text"} type="primary">{intl.get("SUBMIT_AND_UPDATE")}</Button>
            </Table.TableCommon>
        </div>
    )
}


const TestContent = () => {
    let {test: {testIndexTitleStatus: {current}}} = store.getState();
    return (
        <React.Fragment>
            {current === 1 ?
                <TestMainArea/> : <React.Fragment></React.Fragment>
            }
            {current === 2 ?
                <LicenseDetail/> : <React.Fragment></React.Fragment>
            }
        </React.Fragment>
    );
}

const TestTitle = () => {
    let {test: {testIndexTitleStatus: {current}}} = store.getState();
    let changeTitle = function (n) {
        CommonAction.changeCommonStatus(n, Key.changeTestIndexTitle);
    }
    const style = (current === 1) ? ["but-on", ""] : ["", "but-on"];

    return (
        <div className={"test-title"}>
            <Button block className={style[0]} onClick={changeTitle.bind(this, 1)}>
                {intl.get('MINER_TEST')}
            </Button>
            <Button block className={style[1]} style={{left: "236px", width: "115px"}}
                    onClick={changeTitle.bind(this, 2)}>
                {intl.get('MANAGE_LICENSE')}
            </Button>
        </div>
    )
}

class TestIndex extends React.Component {
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
                <TestTitle/>
                <TestContent/>
            </React.Fragment>
        )
    }
}

export default class Back extends Component {
    render() {
        return (
            <Initialize history={this.props.history}>
                <TestIndex history={this.props.history}/>
            </Initialize>
        )
    }
}