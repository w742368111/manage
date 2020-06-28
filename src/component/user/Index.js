import React, {Component} from "react"
import * as Common from "../index/common/Public";
import * as Table from "../common/Table"
import intl from "react-intl-universal";
import store from "../../store/"
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";
import * as Icon from "../common/Icon";
import {Button, Pagination, Select, Switch, Input, message} from "antd";
import * as Func from "../../common/common";
import * as Rows from "../common/RowSet";
import MyModal from "../common/Modal";
import cookie from "react-cookies";
import Initialize from "../Initialize";
import {connect} from "react-redux";

const {Option} = Select;

class SelectTime extends React.Component {
    state = {
        rate: 0
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    handleChange = (value) => {
        this.state.rate = value
    }

    getRateState = () => {
        return this.state
    }

    render() {
        const data = [
            [0, intl.get("PLEASE_SELECT_WARNING_RATE")],
            [600, intl.get("TEN_MINUTE")],
            [3600, intl.get("ONE_HOUR")],
            [86400, intl.get("ONE_DAY")]
        ]
        const list = data.map((val, key) => {
            const [id, name] = val;
            return (<Option key={key} value={id}>{name}</Option>)
        })
        let {pool: {minerMoveGroupId: {current}}} = store.getState();
        return (
            <Select defaultValue={0} style={{width: "280px", display: "block", margin: "0 auto"}}
                    onChange={this.handleChange}>
                {list}
            </Select>
        )
    }
}

class WarningSet extends React.Component {
    state = {
        list: [],
        pid: 0,
        rate: 0,
        warning: 0
    }

    componentDidMount() {
        this.getPoolWarningList();
    }

    getPoolWarningList = () => {
        const {uid, token} = cookie.loadAll();
        this.state.list = [];
        this.setState(this.state);
        Func.axiosPost("/pool/pool/getWarningList", {user_id: uid, token: token}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            for (const val of info) {
                const {pool_id: pid, warning, warning_rate: rate, name} = val;
                this.state.list.push([pid, name, warning, rate]);
            }
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    changeSet(pid, val, status) {
        this.state.list.map((value, key) => {
            if (value[0] !== pid) {
                return value;
            } else {
                value[2] = (status) ? (value[2] + val) : (value[2] - val);
                this.state.pid = pid;
                this.state.warning = value[2];
                this.state.rate = value[3]
                this.updateWarning()
                return value;
            }
        })
        this.setState(this.state)
    }

    onRef = (ref) => {
        this.child = ref
    }

    showModal = (pid, rate, warning) => {
        this.state.pid = pid;
        this.state.rate = rate;
        this.state.warning = warning;
        this.child.showModal()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    onRate = (ref) => {
        this.rate = ref;
    }

    onSubmit = () => {
        const {rate} = this.rate.getRateState();
        this.state.rate = rate;
        this.updateWarning(true)
    }

    updateWarning = (status) => {
        const {warning, rate, pid} = this.state;
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/pool/editWarning", {
            user_id: uid,
            token: token,
            pool_id: pid,
            warning: warning,
            warning_rate: rate,
        }, this.warnUpCallBack, status)
    }

    warnUpCallBack = (data, arts) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const [status] = arts;
            (status) && this.getPoolWarningList();
        } else {
            message.error(description);
        }
    }

    render() {
        const list = this.state.list;
        const info = list.map((value, key) => {
            const [pid, name, val, rate] = value;
            const switchArr = Func.getWarningArray(val)
            return (
                <div className={"set-detail"} key={key}>
                    <ul>
                        <li className={"tit"}><p>{name}</p></li>
                        <li>
                            <p>{intl.get("ERROR_DATA")}</p>
                            <Switch className={"switch"} defaultChecked={switchArr[0]}
                                    onChange={this.changeSet.bind(this, pid, 1)}/></li>
                        <li>
                            <p>{intl.get("ROOM_IS_LESS_THAN")}</p>
                            <Switch className={"switch"} defaultChecked={switchArr[1]}
                                    onChange={this.changeSet.bind(this, pid, 2)}/>
                        </li>
                        <li>
                            <p>{intl.get("CPU_TEMP_TOO_HIGH")}</p>
                            <Switch className={"switch"} defaultChecked={switchArr[2]}
                                    onChange={this.changeSet.bind(this, pid, 4)}/>
                        </li>
                        <li>
                            <p>{intl.get("DISK_TEMP_TOO_HIGH")}</p>
                            <Switch className={"switch"} defaultChecked={switchArr[3]}
                                    onChange={this.changeSet.bind(this, pid, 8)}/>
                        </li>
                        <li>
                            <p>{intl.get("WARNING_RATE_SET")}</p>
                            {/*<Switch className={"switch"} defaultChecked={switchArr[4]}*/}
                            {/*        onChange={this.changeSet.bind(this, pid, 16)}/>*/}
                            <p style={{left: "264px"}}>{intl.get(Func.warningRateChange(rate))}</p>
                            <Button onClick={this.showModal.bind(this, pid, rate, val)} className={"rate-but"}
                                    type="primary">{intl.get('MODIFY')}</Button>
                        </li>
                        <div style={{
                            marginLeft: "90px",
                            marginTop: "20px",
                            width: "662px",
                            height: "2px",
                            backgroundColor: "#EBF1F5"
                        }}></div>

                    </ul>
                </div>
            )
        })
        return (
            <Table.TableCommon
                style={{marginTop: "0px", width: "100%"}}
                icon={<Icon.WarningSetIcon/>}
                title={intl.get("WARNING_SET_CENTER")}
                type={"other"}
            >
                <MyModal
                    class={"common-modal"}
                    title={intl.get('MENTION')}
                    onRef={this.onRef}
                    onSubmit={this.onSubmit}
                    inner={<SelectTime onRef={this.onRate}/>}
                    okText={intl.get('CONFIRM')}
                    cancelText={intl.get('CANCEL')}
                />
                {info}
            </Table.TableCommon>
        )
    }
}

const AboutUs = (props) => {
    return (
        <Table.TableCommon
            style={{marginTop: "0px", width: "100%"}}
            icon={<Icon.AboutUsInnerIcon/>}
            title={intl.get("ABOUT_US")}
            type={"other"}
        >
            <div className={"about_us_area"}>
                <p>{intl.getHTML("FIRM_NAME")}</p>
                <p>{intl.getHTML("NAME_OF_FIRM")}</p>

                <p>{intl.getHTML("OFFICIAL_WEBSITE")}</p>
                <p>{intl.getHTML("WEB_OF_FIRM")}</p>

                <p>{intl.getHTML("FIRM_INTRODUCE")}</p>
                <p>{intl.getHTML("INFO_OF_FIRM")}</p>

                <p>{intl.getHTML("OFFICIAL_NUMBER")}</p>
                <p>{intl.getHTML("NUMBER_OF_FIRM")}</p>

                <p>{intl.getHTML("OFFICIAL_EMAIL")}</p>
                <p>{intl.getHTML("EMAIL_OF_FIRM")}</p>
            </div>
        </Table.TableCommon>
    )
}

const MessageTitle = (props) => {
    return (
        <div className={"message-title"} style={{display: "none"}}>
            <div className={"group-operation-panel"}>
                <Button block className={"but-on"}>
                    {intl.get('WARNING_MESSAGE')}
                </Button>
                <Button block style={{left: "170px", backgroundColor: "white"}}>
                    {intl.get('SYSTEM_MESSAGE')}
                </Button>
                <p style={{
                    cursor: "pointer",
                    position: "absolute",
                    fontSize: "14px",
                    top: "33px",
                    left: "705px"
                }}>{intl.get("ALL_IS_READ")}</p>
            </div>
        </div>
    )
}

class MessageCenter extends Component {
    state = {
        page: 1,
        total: 0,
        list: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getWarningInfo();
    }

    getWarningInfo = () => {
        const {uid, token} = cookie.loadAll();
        this.state.total = 0;
        this.state.list = [];
        this.setState(this.state);
        Func.axiosPost("/warning/warning/list", {user_id: uid, token: token, page: this.state.page}, this.warnCallBack)
    }

    warnCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {total, data: list} = info;
            this.state.total = total;
            for (const val of list) {
                const {add_time: addTime, type, info} = val;
                this.state.list.push([addTime, Func.changeWarningType(type), info, 1]);
            }
            this.setState(this.state);
        } else {
            message.error(description);
        }
    }

    changePage = (value) => {
        this.state.page = value;
        this.getWarningInfo();
    }

    render() {
        const text = this.state.list;
        const title = Func.changeName(Rows.MessageCenter());
        return (
            <Table.TableCommon
                style={{marginTop: "0px", width: "100%"}}
                icon={<Icon.MessageCenterIcon/>}
                title={intl.get("MESSAGE_CENTER")}
                type={"other"}
            >
                <MessageTitle/>
                <Table.RowName row={title} show={1}/>
                <Table.TableInner row={title} text={text}/>
                <Pagination
                    hideOnSinglePage={true}
                    defaultCurrent={1}
                    pageSizeOptions={[10]}
                    total={this.state.total}
                    onChange={this.changePage.bind(this)}
                    showQuickJumper/>
            </Table.TableCommon>
        )
    }
}

class AccountBaseInfo extends Component {
    state = {
        name: "",
        account: "",
        email: "",
        showName: false,
        showEmail: false
    }

    componentDidMount() {
        this.getUserBaseInfo()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    getUserBaseInfo = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/user/get", {user_id: uid, token: token, to_user_id: uid}, this.getInfoCallBack)
    }

    getInfoCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {name, email, username: account} = info;
            this.state.name = name;
            this.state.account = account;
            this.state.email = email;
            this.setState(this.state);
        } else {
            message.error(description);
        }
    }

    changeValue = (name, e) => {
        this.state[name] = e.target.value;
    }

    changeState = (name) => {
        this.state[name] = true;
        this.setState(this.state)
    }

    safeState = (name) => {
        const {uid, token} = cookie.loadAll();
        if (name === "showName") {
            Func.axiosPost("/user/user/edit", {
                user_id: uid,
                token: token,
                to_user_id: uid,
                name: this.state.name,
                email: null
            }, this.setCallBack, name, 1, 2, 3)
        } else {
            if (Func.checkEmailFormat(this.state.email)) {
                message.error(intl.get("EMAIL_FORMAT_CHECK_ERROR"));
                return;
            }
            Func.axiosPost("/user/user/edit", {
                user_id: uid,
                token: token,
                to_user_id: uid,
                name: null,
                email: this.state.email
            }, this.setCallBack, name, 6, 7, 8)
        }
    }

    setCallBack = (data, other) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const [name] = other;
            this.state[name] = false;
            this.setState(this.state);
            this.props.forceUpdateUser(true, Key.userStateForceUpdate);
            this.getUserBaseInfo();
        } else {
            message.error(description);
        }
    }

    render() {
        const [name, phone, email] = [this.state.name, this.state.account, this.state.email];
        return (
            <React.Fragment>
                <Table.TableCommon
                    style={{marginTop: "0px", width: "100%"}}
                    icon={<Icon.BaseInfoInnerIcon/>}
                    title={intl.get("BASE_INFO")}
                    type={"other"}
                >
                    <div className={"base-info-area"}>
                        <p>{intl.get("USER_NAME")}</p>
                        <p>{name}</p>
                        <p>{intl.get("USER_PHONE_NUMBER")}</p>
                        <p>{phone}</p>
                        <p>{intl.get("USER_EMAIL")}</p>
                        <p>{email}</p>
                        {this.state.showName ?
                            <div className={"name"}>
                                <input onChange={this.changeValue.bind(this, "name")} defaultValue={name}
                                       maxLength={15}/>
                            </div> : <React.Fragment></React.Fragment>
                        }
                        {this.state.showEmail ?
                            <div className={"name"} style={{top: "230px", width: "365px"}}>
                                <input onChange={this.changeValue.bind(this, "email")} style={{width: "255px"}}
                                       defaultValue={email}/>
                            </div> : <React.Fragment></React.Fragment>
                        }
                        {this.state.showName ?
                            <Button onClick={this.safeState.bind(this, "showName")}
                                    type={"primary but1"}>{intl.get("SAFE")}</Button> :
                            <Button onClick={this.changeState.bind(this, "showName")}
                                    type={"primary but1"}>{intl.get("MODIFY")}</Button>
                        }
                        {this.state.showEmail ?
                            <Button onClick={this.safeState.bind(this, "showEmail")}
                                    type={"primary but2"}>{intl.get("SAFE")}</Button> :
                            <Button onClick={this.changeState.bind(this, "showEmail")}
                                    type={"primary but2"}>{intl.get("SET")}</Button>
                        }
                    </div>
                </Table.TableCommon>
            </React.Fragment>
        )
    }
}

//  将state映射到Counter组件的props
const commonStateToProps = (state) => {
    return {value: state};
}

const createDispatchToProps = (dispatch) => {
    return {
        forceUpdateUser: (gid, key) => {
            dispatch(CommonAction.makeActionObject(gid, key))
        }
    }
}

const AccountBaseInfoApp = connect(
    commonStateToProps,
    createDispatchToProps
)(AccountBaseInfo)


class ResetPassword extends Component {
    state = {
        staff: 0,
        newPassword: "",
        rePassword: "",
        verify: "",
        list: [],
        send: 0
    }

    componentDidMount() {
        this.props.onInn(this);
        this.getStaffList();
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    getStaffList = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/user/list", {
            user_id: uid,
            token: token,
            role_id: -1,
            page_size: 2000
        }, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            for (const val of info.data) {
                const {user_id: id, name} = val;
                this.state.list.push([id, name]);
            }
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    changeValue = (name, e) => {
        this.state[name] = e.target.value;
    }

    backState = () => {
        return this.state;
    }

    onChange = (value) => {
        this.state.staff = value
    }

    checkVerify = () => {
        (this.state.send === 0) && this.sendVerify();
    }

    sendVerify = () => {
        this.state.send = 60;
        this.setState(this.state);
        const time = setInterval(() => {
            (this.state.send === 0) && clearInterval(time) && this.setState(this.state)
            if (this.state.send > 0) {
                this.state.send = this.state.send - 1;
                this.setState(this.state);
            }
        }, 1000)
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/user/sendSms", {
            user_id: uid,
            token: token
        }, this.sendCallBack)
    }

    sendCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            message.success(intl.get("VERIFY_IS_SUCCESS_SEND"))
        } else {
            this.state.send = 0;
            this.setState(this.state);
            message.error(description);
        }
    }

    render() {
        let style = ["", "", ""];
        style[this.props.step - 1] = "on";
        const list = this.state.list.map((value, key) => {
            const [id, name] = value;
            return <Option key={key} value={id}>{name}</Option>
        })

        return (
            <React.Fragment>
                <div className={"modify-password-step"}>
                    <h6 className={style[0]}>1</h6>
                    <h6 className={style[1]}>2</h6>
                    <h6 className={style[2]}>3</h6>
                    <p className={style[0]} style={{backgroundColor: "white"}}>{intl.get('SAFE_CHECK')}</p>
                    <p className={style[1]} style={{backgroundColor: "white"}}>{intl.get('SET_NEW_PASSWORD')}</p>
                    <p className={style[2]} style={{backgroundColor: "white"}}>{intl.get('MODIFY_COMPLETE')}</p>
                    <div className={"hr1"}></div>
                    <div className={"hr2"}></div>
                </div>
                <div className={"modify-input-area"}>
                    {this.props.step === 5 ?
                        <Select style={{width: "100%", marginTop: "50px"}}
                                placeholder={intl.get("PLEASE_CHOOSE_A_MEMBER")} onChange={this.onChange.bind(this)}>
                            {list}
                        </Select> : <React.Fragment></React.Fragment>
                    }
                    {this.props.step === 1 ?
                        <React.Fragment>
                            {this.state.send > 0 ?
                                <p style={{color: "#777"}} className={"send"}
                                   onClick={this.checkVerify}>{intl.get("LEFT_MOUNT_SECOND", {second: this.state.send})}</p> :
                                <p className={"send"} onClick={this.checkVerify}>{intl.get("SEND_MOBILE_VERIFY")}</p>
                            }
                            <Input maxLength={6} style={{marginTop: "50px"}}
                                   onChange={this.changeValue.bind(this, "verify")}
                                   placeholder={intl.get("PLEASE_INPUT_MOBILE_VERIFY")}/></React.Fragment> :
                        <React.Fragment></React.Fragment>
                    }
                    {this.props.step === 2 ?
                        <React.Fragment>
                            <Input type={"password"} onChange={this.changeValue.bind(this, "newPassword")}
                                   placeholder={intl.get("PLEASE_TYPE_NEW_PASSWORD")}/>
                            <Input type={"password"} onChange={this.changeValue.bind(this, "rePassword")}
                                   placeholder={intl.get("PLEASE_RETYPE_NEW_PASSWORD")}/>
                        </React.Fragment> : <React.Fragment></React.Fragment>
                    }
                    {this.props.step === 3 ?
                        <p style={{lineHeight: "100px", textAlign: "center"}}>修改完成</p> :
                        <React.Fragment></React.Fragment>
                    }
                </div>
            </React.Fragment>
        )
    }
}

class AccountSafe extends React.Component {
    state = {
        step: 1
    }

    changeSet(val, status) {
        // console.log(`val :${val}`)
        // console.log(`status:${status}`)
    }

    onRef = (ref) => {
        this.child = ref
    }

    showModal = (e) => {
        this.child.showModal()
    }

    onInn = (ref) => {
        this.inner = ref;
    }

    onCancel = () => {
        this.state.step = 1;
        this.setState(this.state)
    }

    onSubmit = () => {
        switch (this.state.step) {
            case 1:
                this.checkPassword();
                break;
            case 2:
                this.setNewPassword();
                break;
            case 3:
                this.changeSuccess();
                break;
        }
    }

    checkPassword = () => {
        const {verify} = this.inner.backState();
        if (Func.checkVerifyValidity(verify)) {
            this.state.step = 2;
            this.setState(this.state);
        } else {
            message.error(intl.get("MOBILE_VERIFY_CHECK_ERROR"));
        }
    }

    setNewPassword = () => {
        const {verify, newPassword, rePassword} = this.inner.backState();
        const {status, reason} = Func.checkNewPassword(newPassword, rePassword);
        if (status) {
            const {uid, token} = cookie.loadAll();
            Func.axiosPost("/user/user/editPassword", {
                user_id: uid,
                token: token,
                sms: verify,
                password: newPassword
            }, this.passCallBack)

        } else {
            message.error(intl.get(reason));
        }
    }

    passCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            this.state.step = 3;
        } else {
            this.state.step = 1;
            message.error(description);
        }
        this.setState(this.state);
    }

    changeSuccess = () => {
        this.state.step = 1;
        this.setState(this.state)
        this.child.hideModal();
    }

    render() {
        return (
            <Table.TableCommon
                style={{marginTop: "14px", width: "100%"}}
                icon={<Icon.AccountSafeInnerIcon/>}
                title={intl.get("ACCOUNT_SAFE")}
                type={"other"}
            >
                <MyModal
                    title={intl.get('MODIFY_LOGIN_PASSWORD')}
                    onRef={this.onRef}
                    onSubmit={this.onSubmit}
                    onCancel={this.onCancel}
                    submitShow={1}
                    inner={<ResetPassword step={this.state.step} onInn={this.onInn}/>}
                    okText={intl.get('CONFIRM')}
                    cancelText={intl.get('CANCEL')}
                    class={"pass-modal"}
                />
                <div className={"user-safe-model"}>
                    <p>{intl.get("LOGIN_PASSWORD")}</p>
                    <Button onClick={this.showModal.bind(this, 4)}
                            type={"primary"}>{intl.get("MODIFY")}</Button>
                </div>
            </Table.TableCommon>
        )
    }
}

class LoginHistory extends Component {
    state = {
        page: 1,
        total: 0,
        list: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getLoginInfo()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    changePage = (value) => {
        this.state.page = value;
        this.getLoginInfo();
    }

    getLoginInfo() {
        this.state.total = 0;
        this.state.list = [];
        this.setState(this.state);
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/userClient/list", {
            user_id: uid,
            token: token,
            page: this.state.page,
        }, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {total, data: list} = info;
            this.state.total = total;
            for (const val of list) {
                const {add_time: time, address, browser, ip, system} = val;
                this.state.list.push([time, address, ip, browser, system, intl.get("SUCCESS"), 1])
            }
            this.setState(this.state);
        } else {
            message.error(description);
        }
    }

    render() {
        const title = Func.changeName(Rows.LoginHistory());
        const text = this.state.list;
        return (
            <React.Fragment>
                <Table.TableCommon
                    style={{marginTop: "14px", width: "100%"}}
                    icon={<Icon.LoginHistoryIcon/>}
                    title={intl.get("LOGIN_HISTORY")}
                    type={"other"}
                    class={"login-history-tips"}
                >
                    <p className={"tips"}>{intl.get('PLEASE_RESET_PASSWORD_IF_NOT_YOU')}</p>
                    <Table.RowName row={title} show={1}/>
                    <Table.TableInner row={title} text={text}/>
                    <Pagination
                        hideOnSinglePage={true}
                        defaultCurrent={1}
                        pageSizeOptions={[10]}
                        total={this.state.total}
                        onChange={this.changePage.bind(this)}
                        showQuickJumper/>
                </Table.TableCommon>
            </React.Fragment>
        )
    }
}

const AccountSet = (props) => {
    return (
        <React.Fragment>
            <AccountBaseInfoApp/>
            <AccountSafe/>
            <LoginHistory/>
        </React.Fragment>
    )
}

const ContainMain = (props) => {
    const {user: {userIndexMenuSelect: {current}}} = store.getState();
    return (
        <div className={"user-index-contain-main"}>
            {current === 1 ?
                <AccountSet/> : <React.Fragment></React.Fragment>
            }
            {current === 2 ?
                <WarningSet/> : <React.Fragment></React.Fragment>
            }
            {current === 3 ?
                <MessageCenter/> : <React.Fragment></React.Fragment>
            }
            {current === 4 ?
                <AboutUs/> : <React.Fragment></React.Fragment>
            }
        </div>
    )
}

const MySetInner = () => {
    const {user: {userIndexMenuSelect: {current}}} = store.getState();
    return (
        <React.Fragment>
            {current === 1 ?
                <span className={"set on"}>{intl.get("ACCOUNT_SET_CENTER")}</span> :
                <span onClick={CommonAction.changeCommonStatus.bind(this, 1, Key.changeUserIndexMenu)}
                      className={"set"}>{intl.get("ACCOUNT_SET_CENTER")}</span>
            }
            {current === 2 ?
                <span className={"set on"}>{intl.get("WARNING_SET_CENTER")}</span> :
                <span onClick={CommonAction.changeCommonStatus.bind(this, 2, Key.changeUserIndexMenu)}
                      className={"set"}>{intl.get("WARNING_SET_CENTER")}</span>
            }
        </React.Fragment>
    )
}

const SetTitle = (props) => {
    return (
        <React.Fragment>
            <p>{intl.get("USER_SET_CENTER")}</p>
            {props.step === 2?
                <svg className="icon svg-icon detail-icon" aria-hidden="true">
                    <use xlinkHref="#iconicon_more_norsvg"></use>
                </svg>:
                <svg className="icon svg-icon detail-icon" aria-hidden="true">
                    <use xlinkHref="#iconico_arrow-down"></use>
                </svg>
            }
        </React.Fragment>
    )
}

class UserMenu extends Component {
    state = {
        step: 0
    }

    onChange = (e) => {
        if (e === "1") {
            this.state.step = 1;
        } else {
            this.state.step = 2;
        }
        this.setState(this.state)
    }

    render() {
        const {user: {userIndexMenuSelect: {current}}} = store.getState();
        const collapseText = [
            [
                <SetTitle step={this.state.step} />,
                <MySetInner/>, 0
            ]
        ];
        return (
            <div className={"user-index-left-menu"}>
                <Table.CollapsePanel onChange={this.onChange} text={collapseText} active={1}/>
                {current === 3 ?
                    <div className={"set on"}>{intl.get("MESSAGE_CENTER")}</div> :
                    <div onClick={CommonAction.changeCommonStatus.bind(this, 3, Key.changeUserIndexMenu)}
                         className={"set"}>{intl.get("MESSAGE_CENTER")}</div>
                }
                {current === 4 ?
                    <div className={"set on"}>{intl.get("ABOUT_US")}</div> :
                    <div onClick={CommonAction.changeCommonStatus.bind(this, 4, Key.changeUserIndexMenu)}
                         className={"set"}>{intl.get("ABOUT_US")}</div>
                }
            </div>
        )
    }
}

const UserMainBg = (props) => {
    return (
        <div className={"user-index-main-area"}>
            {props.children}
        </div>
    )
}

const UserMain = (props) => {
    return (
        <UserMainBg>
            <UserMenu/>
            <ContainMain/>
        </UserMainBg>
    )
}

class Index extends React.Component {
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
                <UserMain/>
            </React.Fragment>
        );
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



