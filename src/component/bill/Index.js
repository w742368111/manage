import React, {Component} from "react";
import * as Common from "../index/common/Public";
import * as Table from "../common/Table"
import intl from "react-intl-universal";
import * as Icon from "../common/Icon";
import {Button, message, Pagination} from "antd";
import * as Func from "../../common/common";
import * as Rows from "../common/RowSet";
import CreateBill from "./Create";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";
import cookie from "react-cookies";
import MyModal from "../common/Modal";
import Initialize from "../Initialize";

const TotalRecord = (props) => {
    const totalCount = props.total;

    function createBill() {
        CommonAction.changeCommonStatus(1, Key.openCreateBillOperate)
    }

    return (
        <React.Fragment>
            <p className="bill-account">{intl.get('TOTAL_RECORD', {name: totalCount})}</p>
            <Button onClick={createBill} type="primary"
                    className="create-new-bill">{intl.get("CREATE_NEW_BILL")}</Button>
        </React.Fragment>
    )
}

const BillDetailShort = (props) => {
    const icon = (props.type === 1 && props.close === 0 &&
        <span className="icon simple">{intl.get("SIMPLE_BILL")}</span>) ||
        (props.type === 1 && props.close === 1 &&
            <span className="icon simple_close">{intl.get("SIMPLE_BILL")}</span>) ||
        (props.type === 2 && props.close === 0 && <span className="icon diagnose">{intl.get("DIAGNOSE_BILL")}</span>) ||
        (props.type === 2 && props.close === 1 &&
            <span className="icon diagnose_close">{intl.get("DIAGNOSE_BILL")}</span>)

    return (
        <React.Fragment>
            {icon}{props.inner}
        </React.Fragment>
    )
}

class OperatePanel extends React.Component {
    state = {
        choose: 1
    }

    onRef = (ref) => {
        this.child = ref
    }

    checkBill = () => {
        this.props.history.push(`/billweb/detail?id=${this.props.id}`)
    }

    closeBill() {
        this.state.choose = 1;
        this.setState(this.state);
        this.child.showModal()
    }

    deleteBill() {
        this.state.choose = 2;
        this.setState(this.state);
        this.child.showModal()
    }

    onSubmit = () => {
        const {uid, token} = cookie.loadAll();
        if (this.state.choose === 1) {
            Func.axiosPost("/workorder/workorder/editStatus", {
                user_id: uid,
                token: token,
                work_order_id: this.props.id
            }, this.syncCallBack)
        } else {
            Func.axiosPost("/workorder/workorder/del", {
                user_id: uid,
                token: token,
                work_order_id: this.props.id
            }, this.syncCallBack)
        }
    }

    syncCallBack = () => {
        this.props.back();
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        const list = [
            [<h6>{intl.get("YOU_SURE_CLOSE_BILL")}</h6>,
                <svg className="icon svg-icon modal-icon" aria-hidden="true">
                    <use xlinkHref="#iconmsg_icon_restart_nor"></use>
                </svg>],
            [<h6>{intl.get("YOU_SURE_DELETE_BILL")}</h6>,
                <svg className="icon svg-icon modal-icon" aria-hidden="true">
                    <use xlinkHref="#iconmsg_icon_restart_nor"></use>
                </svg>],
        ]

        const [inner, icon] = list[this.state.choose - 1];

        return (
            <React.Fragment>
                <MyModal
                    class={"common-modal"}
                    title={intl.get('MENTION')}
                    onRef={this.onRef}
                    onSubmit={this.onSubmit}
                    inner={inner}
                    okText={intl.get('CONFIRM')}
                    cancelText={intl.get('CANCEL')}
                    icon={icon}
                />
                <span onClick={this.checkBill.bind(this)} className="operate">{intl.get("BILL_CHECK")}</span>
                {this.props.close === 1 ?
                    <span onClick={this.closeBill.bind(this)} className="operate">{intl.get("BILL_CLOSE")}</span> :
                    <React.Fragment></React.Fragment>
                }
                <span onClick={this.deleteBill.bind(this)} className="operate">{intl.get("BILL_DELETE")}</span>
            </React.Fragment>
        )
    }
}

class BillMain extends Component {
    state = {
        page: 1,
        total: 0,
        info: []
    }

    componentDidMount() {
        this.props.onRef(this)
        this.getBillInfo()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    pageInfo = (value) => {
        this.state.page = value
        this.getBillInfo();
    }

    getBillInfo = () => {
        this.state.info = [];
        this.setState(this.state);
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/workorder/workorder/list", {
            user_id: uid,
            token: token,
            page: this.state.page
        }, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {current_page: page, total, data: list} = info;
            this.state.total = total;
            for (const val of list) {
                const {Info: text, add_time: addTime, device_id: deviceId, id, status, user_id: uid, user_name: name} = val;

                this.state.info.push([
                    Func.billNoChange(id), <BillDetailShort type={(deviceId > 0) ? 2 : 1} inner={JSON.parse(text).info}
                                         close={(status === 2) ? 1 : 0}/>,
                    addTime, name, (status === 1) ? intl.get("NOT_ALREADY_DEAL") : intl.get("HAS_ALREADY_CLOSE"),
                    <OperatePanel back={this.getBillInfo.bind(this)} history={this.props.history} id={id}
                                  close={(status === 2) ? 0 : 1}/>, (status === 2) ? 0 : 1
                ])
            }
            this.setState(this.state);
        } else {
            message.error(description);
        }
    }

    render() {
        const title = Func.changeName(Rows.BillRecord());
        const data = this.state.info
        return (
            <div className="bill-main-area">
                <Table.TableCommon
                    style={{marginTop: "78px", width: "100%"}}
                    icon={<Icon.BillRecordIcon/>}
                    title={intl.get("BILL_RECORD")} p
                    type={"other"}
                >
                    <TotalRecord total={this.state.total} />
                    <Table.RowName row={title} show={1}/>
                    <Table.TableInner row={title} text={data}/>
                    <Pagination
                        hideOnSinglePage={true}
                        defaultCurrent={1}
                        pageSizeOptions={[10]}
                        total={this.state.total}
                        onChange={this.pageInfo.bind(this)}
                        showQuickJumper/>
                </Table.TableCommon>
            </div>
        )
    }
}

class BillIndex extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    onRef = (ref) => {
        this.child = ref
    }

    billUpdate = () => {
        this.child.getBillInfo();
    }

    render() {
        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <BillMain onRef={this.onRef} history={this.props.history}/>
                <CreateBill update={this.billUpdate}/>
            </React.Fragment>
        )
    }
}

class Back extends Component {
    render() {
        return (
            <Initialize history={this.props.history}>
                <BillIndex history={this.props.history}/>
            </Initialize>
        )
    }
}

export default Back;