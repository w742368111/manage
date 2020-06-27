import React, {Component} from "react";
import * as Common from "../index/common/Public";
import {Pagination, Input, Select, Radio, message} from "antd";
import intl from "react-intl-universal";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";
import store from "../../store/";
import * as Func from "../../common/common";
import * as Table from "../common/Table";
import * as Icon from "../common/Icon";
import * as Rows from "../common/RowSet";
import MyModal from "../common/Modal";
import {Link} from "react-router-dom";
import BannerTitleApp from "./common/Common";
import cookie from "react-cookies";
import {connect} from "react-redux";
import {isEmpty} from "../../common/common";
import Initialize from "../Initialize";

const {Option} = Select;

class StaffInputInfo extends Component {
    state = {
        name: "",
        phone: "",
        email: "",
        rid: 0,
        password: "",
        rePassword: "",
        role: [[0, intl.get("PLEASE_CHOOSE_STAff_ROLE")]],
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getRoleList()
        this.getSelfInfo()
        this.props.onRef(this);
    }

    getStaffInfo = () => {
        return this.state
    }

    getSelfInfo = () => {
        const {uid, token} = cookie.loadAll();
        (this.props.id > 0) && Func.axiosPost("/user/user/get", {
            user_id: uid,
            token: token,
            to_user_id: this.props.id
        }, this.infoCallBack)
    }

    getRoleList = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/role/list", {user_id: uid, token: token, page_size: 50}, this.roleCallBack)
    }

    infoCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {email, name, role_id: rid, username} = info;
            this.state.name = name;
            this.state.rid = rid;
            this.state.email = email;
            this.state.phone = username;
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    roleCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {total, data: list} = info;
            for (const val of list) {
                const {Id: id, Info: info, Name: name, Status: status} = val;
                this.state.role.push([id, name])
            }
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

    changeRole = (value) => {
        this.state.rid = value;
        this.setState(this.state)
    }

    changeInput = (name, e) => {
        this.state[name] = e.target.value
        this.setState(this.state)
    }

    render() {
        const info = this.state.role;
        const inner = info.map((val, key) => {
            const [id, name] = val;
            return <Option key={key} value={id}>{name}</Option>
        });
        return (
            <React.Fragment>
                <div className={"new-staff-list"}>
                    <p>{intl.get("STAFF_NAME")}：</p>
                    <Input maxLength={40} onChange={this.changeInput.bind(this, "name")} className={"info"} value={this.state.name}/>
                </div>
                <div className={"new-staff-list"}>
                    <p>{intl.get("STAFF_SET_PHONE")}：</p>
                    <Input maxLength={11} onChange={this.changeInput.bind(this, "phone")} className={"info"}
                           value={this.state.phone}/>
                </div>
                <div className={"new-staff-list"}>
                    <p>{intl.get("STAFF_EMAIL")}：</p>
                    <Input onChange={this.changeInput.bind(this, "email")} className={"info"} value={this.state.email}/>
                </div>
                <div className={"new-staff-list"}>
                    <p>{intl.get("STAFF_ROLE")}：</p>
                    <Select onChange={this.changeRole.bind(this)} className={"info"} value={this.state.rid}
                            defaultValue={0}>
                        {inner}
                    </Select>
                </div>
                <div className={"new-staff-list"}>
                    <p>{intl.get("STAFF_PASSWORD")}：</p>
                    <Input onChange={this.changeInput.bind(this, "password")} type={"password"} className={"info"}/>
                </div>
                <div className={"new-staff-list"}>
                    <p>{intl.get("STAFF_CONFIRM_PASSWORD")}：</p>
                    <Input onChange={this.changeInput.bind(this, "rePassword")} type={"password"} className={"info"}/>
                </div>
            </React.Fragment>
        )
    }
}

class RoleInputInfo extends Component {
    state = {
        role: "",
        remark: ""
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onRef(this)
        this.getRoleInfo()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    getRoleInfo = () => {
        const {uid, token} = cookie.loadAll();
        (this.props.id > 0) && Func.axiosPost("/user/role/get", {
            user_id: uid,
            token: token,
            role_id: this.props.id
        }, this.getRoleCallBack);
    }

    getRoleCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {Info: remark, Name: name} = info;
            this.state.role = name;
            this.state.remark = remark;
            this.setState(this.state);
        } else {
            message.error(description);
        }
    }

    getRoleState = () => {
        return this.state
    }

    changeInput = (name, e) => {
        this.state[name] = e.target.value
        this.setState(this.state);
    }

    render() {
        return (
            <React.Fragment>
                <Input value={this.state.role} onChange={this.changeInput.bind(this, "role")}
                       placeholder={intl.get("PLEASE_INPUT_ROLE_NAME")}
                       className={"in1"}/>
                <Input value={this.state.remark} onChange={this.changeInput.bind(this, "remark")}
                       placeholder={intl.get("ROLE_REMARK")}
                       style={{marginTop: "6px"}} className={"in2"}/>
            </React.Fragment>
        )
    }
}


class NewEditStaff extends Component {
    state = {
        belong: "staff-new-modify",
        inner: <StaffInputInfo/>,
        name: intl.get('ADD_NEW_STAFF'),
        role: 0,
        staff: 0
    }

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

    staff = (ref) => {
        this.member = ref;
    }

    role = (ref) => {
        this.job = ref
    }

    showModal = (e) => {
        this.child.showModal()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {manage: {popupAddStaffPanel: {current}, popupAddRolePanel: {current: role}}} = nextProps.value;
        (current !== "") && (this.state.name = (current === 0) ? intl.get('ADD_NEW_STAFF') : intl.get('MODIFY_STAFF_INFO')) && (this.state.inner =
            <StaffInputInfo onRef={this.staff}
                            id={current}/>) && (this.state.belong = "staff-new-modify") && (this.state.staff = current);
        (role !== "") && (this.state.name = (role === 0) ? intl.get('ADD_NEW_ROLE') : intl.get('MODIFY_ROLE_INFO')) && (this.state.inner =
            <RoleInputInfo onRef={this.role}
                           id={role}/>) && (this.state.belong = "role-new-modify") && (this.state.role = role);
        this.setState(this.state);
        (current !== "" || role !== "") && this.showModal();
    }

    onClose = () => {
        setTimeout(function () {
            CommonAction.changeCommonStatus("", Key.manageAddStaffShow);
        }, 100)
    }

    onSubmit = () => {
        const {manage: {popupAddStaffPanel: {current: staff}}} = this.props.value;
        const {manage: {popupAddRolePanel: {current: role}}} = this.props.value;
        (staff !== "") && this.addEditStaff();
        (role !== "") && this.submitNewRole();
    }

    addEditStaff = () => {
        const {email, name, password, phone, rePassword, rid} = this.member.getStaffInfo()
        if (Func.isEmpty(name)) {
            message.error(intl.get("STAFF_NAME_CANNOT_BE_EMPTY"));
            return;
        }
        if (Func.checkMobileNumber(phone)) {
            message.error(intl.get("MOBILE_NUMBER_CHECK_ERROR"));
            return;
        }
        if (email !== "" && Func.checkEmailFormat(email)) {
            message.error(intl.get("EMAIL_FORMAT_CHECK_ERROR"));
            return;
        }
        if (Func.isEmpty(rid)) {
            message.error(intl.get("PLEASE_SELECT_ROLE_FOR_STAFF"));
            return;
        }
        if (password !== rePassword) {
            message.error(intl.get("PASSWORD_NOT_SAME_WITH_RE_PASSWORD"));
            return;
        }
        if (this.state.staff > 0) {
            this.editStaffInfo(true);
        } else {
            this.editStaffInfo(false);
        }
    }

    editStaffInfo = (old) => {
        const {email, name, password, phone, rePassword, rid} = this.member.getStaffInfo()
        const {uid, token} = cookie.loadAll();
        let url = `/user/user/add`;
        const data = {
            user_id: uid,
            token: token,
            username: phone,
            name: name,
            password: (password === '' && !old) ? "ars12345" : password,
            email: email,
            role_id: rid
        }
        if (old) {
            data.to_user_id = this.state.staff;
            url = `/user/user/edit`
        }
        Func.axiosPost(url, data, this.addStaffCallBack, old);
    }

    addStaffCallBack = (data, status) => {
        const [record] = status;
        const {code, data: info, description} = data.data;
        if (code === 0) {
            if (record) {
                message.success(intl.get("STAFF_EDIT_SUCCESS"))
            } else {
                message.success(intl.get("STAFF_ADD_SUCCESS"))
            }
            this.props.update();
            this.child.handleCancel()
        } else {
            message.error(description);
        }
    }

    submitNewRole = () => {
        const {role, remark} = this.job.getRoleState()
        if (Func.isEmpty(role)) {
            message.error(intl.get("ROLE_NAME_CANNOT_BE_EMPTY"));
            return;
        }
        // if (Func.isEmpty(remark)) {
        //     message.error(intl.get("ROLE_REMARK_CANNOT_BE_EMPTY"));
        //     return;
        // }
        const {uid, token} = cookie.loadAll();
        let url = `/user/role/add`;
        const old = (this.state.role > 0);
        const data = {
            user_id: uid,
            token: token,
            name: role,
            info: remark
        }
        if (old) {
            data.role_id = this.state.role;
            url = `/user/role/edit`;
        }
        Func.axiosPost(url, data, this.addRollCallBack, old);
    }

    addRollCallBack = (data, back) => {
        const [status] = back;
        const {code, data: info, description} = data.data;
        if (code === 0) {
            if (status) {
                message.success(intl.get("ROLE_EDIT_SUCCESS"))
            } else {
                message.success(intl.get("ROLE_ADD_SUCCESS"))
            }
            this.props.update();
            this.child.handleCancel()
        } else {
            message.error(description);
        }
    }

    render() {
        return (
            <MyModal
                class={this.state.belong}
                title={this.state.name}
                onRef={this.onRef}
                onSubmit={this.onSubmit}
                submitShow={1}
                okText={intl.get('CONFIRM')}
                cancelText={intl.get('CANCEL')}
                onCancel={this.onClose}
                inner={this.state.inner}
            >
            </MyModal>
        );
    }
}

const commonStateToProps = (state) => {
    return {value: state};
}


const NewEditStaffApp = connect(
    commonStateToProps
)(NewEditStaff)


const AddStaffIcon = (props) => {
    const showAddStaffPanel = () => {
        props.staff === 1 && CommonAction.changeCommonStatus(0, Key.manageAddStaffShow);
        props.staff === 0 && CommonAction.changeCommonStatus(0, Key.manageAddRoleShow);
    }
    return (
        <React.Fragment>
            <div onClick={showAddStaffPanel} className={"add-staff-button"}>
                <svg className="icon svg-icon" aria-hidden="true">
                    <use xlinkHref="#iconicon_new"></use>
                </svg>
                {props.title}
            </div>
        </React.Fragment>
    );
}


class OperateStaff extends Component {
    state = {
        id: 1
    }

    editStaff = (id) => {
        CommonAction.changeCommonStatus(id, Key.manageAddStaffShow);
    }

    deleteStaff = (id) => {
        this.state.id = id;
        this.child.showModal()
    }

    onRef = (ref) => {
        this.child = ref
    }

    onSubmit = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/user/del", {user_id: uid, token: token, to_user_id: this.state.id}, this.delStaffCallBack)
    }

    delStaffCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            this.props.get();
        } else {
            message.error(description);
        }
    }

    render() {
        return (
            <React.Fragment>
                <svg onClick={this.editStaff.bind(this, this.props.id)} className="icon svg-icon oper-icon"
                     aria-hidden="true" style={{marginRight: "10px"}}>
                    <use xlinkHref="#icongroup_icon_edit_nor"></use>
                </svg>
                <svg onClick={this.deleteStaff.bind(this, this.props.id)} className="icon svg-icon oper-icon"
                     aria-hidden="true">
                    <use xlinkHref="#icongroup_icon_del_nor"></use>
                </svg>
                <MyModal
                    class={"common-modal"}
                    title={intl.get('MENTION')}
                    onRef={this.onRef}
                    onSubmit={this.onSubmit}
                    inner={<h6>{intl.getHTML('YOU_SURE_DELETE_STAFF')}</h6>}
                    okText={intl.get('CONFIRM')}
                    cancelText={intl.get('CANCEL')}
                    icon={<svg className="icon svg-icon modal-icon" aria-hidden="true">
                        <use xlinkHref="#iconpop_icon_warning"></use>
                    </svg>}
                >
                </MyModal>
            </React.Fragment>
        )
    }
}

class OperateRole extends Component {
    state = {
        id: 0
    }
    editRole = (id) => {
        CommonAction.changeCommonStatus(id, Key.manageAddRoleShow);
    }
    deleteRole = (id) => {
        this.state.id = id;
        this.setState(this.state)
        this.child.showModal()
    }
    onRef = (ref) => {
        this.child = ref
    }
    onSubmit = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/role/del", {
            user_id: uid,
            token: token,
            role_id: this.state.id,
        }, this.delRoleCallBack);
    }

    delRoleCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            this.props.get();
        } else {
            message.error(description);
        }
    }

    render() {
        return (
            <React.Fragment>
                <svg onClick={this.editRole.bind(this, this.props.id)} style={{marginRight: "10px"}}
                     className="icon svg-icon svg-point" aria-hidden="true">
                    <use xlinkHref="#iconicon_edit"></use>
                </svg>
                <svg onClick={this.deleteRole.bind(this, this.props.id)} className="icon svg-icon svg-point"
                     aria-hidden="true">
                    <use xlinkHref="#icongroup_icon_del_nor"></use>
                </svg>
                <MyModal
                    class={"common-modal"}
                    title={intl.get('MENTION')}
                    onRef={this.onRef}
                    onSubmit={this.onSubmit}
                    inner={<h6>{intl.getHTML('YOU_SURE_DELETE_ROLE')}</h6>}
                    okText={intl.get('CONFIRM')}
                    cancelText={intl.get('CANCEL')}
                    icon={<svg className="icon svg-icon modal-icon" aria-hidden="true">
                        <use xlinkHref="#iconpop_icon_warning"></use>
                    </svg>}
                >
                </MyModal>
            </React.Fragment>
        )
    }
}

class StaffContent extends Component {
    state = {
        page: 1,
        total: 0,
        info: []
    }

    componentDidMount() {
        this.props.onRef(this);
        this.getStaffList()
    }

    changePage = (value) => {
        this.state.page = value;
        this.getStaffList();
    }

    getStaffList = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/user/list", {
            user_id: uid,
            token: token,
            role_id: -1,
            page: this.state.page
        }, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {total, data: list} = info;
            this.state.total = total;
            this.state.info = [];
            for (const val of list) {
                const {email, username:account,name: staffName, role_name: roleName, user_id: uid, role_id: rid} = val;
                this.state.info.push([
                    staffName, account, email, roleName, (rid === -1) ? intl.get("NO_OPERATE") :
                        <OperateStaff get={this.getStaffList} id={uid}/>, 1
                ])
            }
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
        const title = Func.changeName(Rows.StaffInfo());
        const text = this.state.info;
        return (
            <Table.TableCommon
                style={{width: "1180px", marginTop: "26px"}}
                icon={<Icon.StaffInfoIcon/>}
                title={intl.get("STAFF_INFORMATION")}
                class={"manage-staff-info"}
                type={"other"}
            >
                <AddStaffIcon title={intl.get("ADD_NEW_STAFF")} staff={1}/>
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

const CheckButton = (props) => {
    return (
        <Link to={`/manageweb/detail/?id=${props.id}`}><span style={{color: "#7988AD"}}
                                                             className={"underline"}>{intl.get("CHECK_DETAIL")}</span></Link>
    )
}

const SignRadio = (props) => {
    return (
        <Radio defaultChecked={props.check} disabled={true}></Radio>
    )
}


class PoolContent extends Component {
    state = {
        page: 1,
        total: 0,
        info: []
    }

    componentDidMount() {
        this.props.onRef(this);
        this.getRoleList()
    }

    changePage = (value) => {
        this.state.page = value;
        this.getRoleList()
    }

    getRoleList = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/role/list", {
            user_id: uid,
            token: token,
            page: this.state.page
        }, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {total, data: list} = info;
            this.state.total = total;
            this.state.info = [];
            for (const val of list) {
                const {Id: id, Info: info, Name: name, Status: status} = val;
                this.state.info.push([
                    <SignRadio check={(!(status === 5 || status === 9))}/>,
                    name, <CheckButton id={id}/>, info, <OperateRole get={this.getRoleList} id={id}/>, 1
                ])
            }
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
        const title = Func.changeName(Rows.RoleInfo());
        const text = this.state.info;
        return (
            <Table.TableCommon
                style={{width: "1180px", marginTop: "26px"}}
                icon={<Icon.RoleManageIcon/>}
                title={intl.get("ROLE_MANAGE")}
                class={"manage-staff-info"}
                type={"other"}
            >
                <AddStaffIcon title={intl.get("ADD_NEW_ROLE")} staff={0}/>
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

class ManageContent extends Component {
    componentDidMount() {
        this.props.onRef(this)
    }

    onRef = (ref) => {
        this.child = ref;
    }

    onRole = (ref) => {
        this.role = ref;
    }

    updateList = () => {
        (this.props.current === 1) && this.child.getStaffList();
        (this.props.current === 2) && this.role.getRoleList();
    }

    render() {
        return (
            <div className="manage-main-area">
                {this.props.current === 1 ?
                    <StaffContent onRef={this.onRef}/> : <React.Fragment></React.Fragment>
                }
                {this.props.current === 2 ?
                    <PoolContent onRef={this.onRole}/> : <React.Fragment></React.Fragment>
                }
            </div>
        )
    }
}

class ManageIndex extends Component {
    constructor(props) {
        super(props);
        const {manage: {manageIndexOperateTitle: {current}}} = this.props.value;
        this.state = {current: current}
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {manage: {manageIndexOperateTitle: {current: now}}} = nextProps.value;
        this.state.current = now;
        this.setState(this.state);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    onRef = (ref) => {
        this.child = ref;
    }

    update = () => {
        this.child.updateList();
    }

    render() {
        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <BannerTitleApp current={this.state.current} history={this.props.history}/>
                <ManageContent onRef={this.onRef} current={this.state.current}/>
                <NewEditStaffApp update={this.update}/>
            </React.Fragment>
        )
    }
}

const ManageIndexApp = connect(
    commonStateToProps
)(ManageIndex)


export default class Back extends Component {
    render() {
        return (
            <Initialize history={this.props.history}>
                <ManageIndexApp history={this.props.history}/>
            </Initialize>
        )
    }
}
