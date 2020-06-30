import React, {Component} from "react";
import PropTypes from 'prop-types';
import * as Common from "../index/common/Public";
import * as Table from "../common/Table";
import * as Icon from "../common/Icon";
import intl from "react-intl-universal";
import * as Scrollbar from "../common/Scrollbars";
import * as ScrollBlock from "./common/ScrollBlock"
import {Checkbox, Button, Input, Pagination, Select, message} from "antd";
import * as Func from "../../common/common";
import * as Rows from "../common/RowSet";
import {CaretDownOutlined} from '@ant-design/icons';
import DeviceIndex from "../device/Index";
import {connect} from 'react-redux'

import store from "../../store/"
import * as Action from "../../action/pool"
import MyModal from "../common/Modal";
import DropDown from "../common/DropDown";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";
import cookie from "react-cookies";

import SearchIcon from "../../common/image/icon_search_nor.png"
import {isEmpty} from "../../common/common";
import Initialize from "../Initialize";
import TopTips from "../common/Href";

const {Option} = Select;

class TotalMiner extends Component {
    state = {
        miner: 0
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/pool/index", {user_id: uid, token: token}, this.syncCallBack)
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {device_num: deviceAll} = data.data.data;
            this.state.miner = deviceAll;
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    render() {
        const {pool: {poolIndexCurrentPid: {current}}} = store.getState();
        const cName = (current === 0) ? "index-power-total active" : "index-power-total"
        return (
            <div className={cName} onClick={CommonAction.changeCommonStatus.bind(this, 0, Key.changePoolIndexPid)}>
                <h4>{intl.get('ALL_MINER')}</h4>
                <h3>{this.state.miner}</h3>
            </div>
        );
    }
}

const PoolIndexBg = (props) => {
    return (
        <div className={"pool-index-panel"}>
            {props.children}
        </div>
    )
}

class PoolIndexPanel extends Component {
    state = {
        data: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/pool/list", {user_id: uid, token: token}, this.syncCallBack)
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
                    id, income, name, disk_space_all: spaceAll, offline_rate: offline,
                    disk_space_used: spaceUsed, power
                } = val
                this.state.data.push(['', name, Func.coinExchange(income),
                    Func.powerUnitChange(power),
                    Func.powerUnitChange(spaceAll),
                    `${offline}%`,
                    Func.powerUnitChange(spaceUsed), 'A', id
                ])
            }
            this.setState(this.state);
        } else {
            message.error(description);
        }
    }

    render() {
        const data = this.state.data
        return (
            <PoolIndexBg>
                <TotalMiner/>
                <Scrollbar.PoolList style={this.props.style}>
                    <ScrollBlock.ScrollBlock data={data}/>
                </Scrollbar.PoolList>
            </PoolIndexBg>
        )
    }
}

const GroupPanel = (props) => {
    let {pool: {poolIndexGroupTitle: {current}}} = store.getState();
    let c1 = {b1: "", b2: ""};
    if (current === 1) {
        c1.b1 = "but-on";
    } else if (current === 2) {
        c1.b2 = "but-on";
    }
    return (
        <div className={"group-operation-panel"}>
            <Button block className={c1.b1} onClick={props.onclick.bind(this, 1)}>
                {intl.get('CREATE_GROUP')}
            </Button>
            <Button block id={"manage-group"} className={c1.b2} onClick={props.onclick.bind(this, 2)}>
                {current === 2 ? intl.get('QUIT_MANAGE') : intl.get('MANAGE_GROUP')}
            </Button>
        </div>
    )
}

class CreateNewGroup extends React.Component {
    componentDidMount() {
        this.input.focus()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    newGroup = (e) => {
        if (e.target.value === "") {
            this.props.changeAddGroup(0, Key.changePoolGroupMenu);
        } else {
            const {uid, token} = cookie.loadAll();
            let {pool: {poolIndexCurrentPid: {current: pid}}} = this.props.value;
            Func.axiosPost("/pool/group/add", {
                user_id: uid,
                token: token,
                pool_id: pid,
                name: e.target.value
            }, this.syncCallBack)
        }
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            this.props.changeAddGroup(0, Key.changePoolGroupMenu);
            this.props.changeAddGroup(1, Key.ifForceUpdateGroupList);
        } else {
            message.error(description);
            this.input.focus()
        }
    }

    render() {
        return (
            <div className={"create-group-area"}>
                <Input ref={(input) => this.input = input} onBlur={this.newGroup.bind(this)}
                       onPressEnter={this.newGroup.bind(this)}/>
            </div>
        )
    }
}

//  将state映射到Counter组件的props
const commonStateToProps = (state) => {
    return {value: state};
}

const createDispatchToProps = (dispatch) => {
    return {
        changeAddGroup: (gid, key) => {
            dispatch(CommonAction.makeActionObject(gid, key))
        }
    }
}

const CreateNewGroupApp = connect(
    commonStateToProps,
    createDispatchToProps
)(CreateNewGroup)


class GroupList extends Component {
    state = {
        info: [],
        nameShow: 1
    }

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    componentDidMount() {
        let {pool: {poolIndexCurrentPid: {current}}} = this.props.value;
        this.getPoolGroup(current);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {pool: {poolIndexCurrentPid: {current}, ifGroupForceUpdate: {current: force}}} = nextProps.value;
        let {pool: {poolIndexCurrentPid: {current: oldValue}}} = this.props.value;
        if (current !== oldValue || force === 1) {
            this.getPoolGroup(current);
        }
    }

    getPoolGroup = (pid) => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/group/list", {user_id: uid, token: token, pool_id: pid}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            this.state.info = [];
            for (const val of info) {
                const {name, Device_num: number, id} = val;
                this.state.info.push([name, number, id]);
            }
            this.setState(this.state)
            this.props.changeGroupId(0, Key.ifForceUpdateGroupList);
        } else {
            message.error(description);
        }
    }

    onRef = (ref) => {
        this.child = ref
    }

    showModal = (e) => {
        this.child.showModal()
    }

    changeGroup(gid) {
        this.props.changeGroupId(gid, Key.changeCurrentOpGid);
    }

    onSubmit = () => {
        let {pool: {currentOperateGid: {current: gid}}} = this.props.value;
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/group/del", {user_id: uid, token: token, group_id: gid}, this.delCallBack)
    }

    delCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            this.props.changeGroupId(1, Key.ifForceUpdateGroupList);
        } else {
            message.error(description);
        }
    }

    openEditName = (gid) => {
        this.state.nameShow = 0;
        this.setState(this.state);
    }
    editGroupNameFuc = (gid, oldName, newName) => {
        const {uid, token} = cookie.loadAll();
        if (oldName === newName || newName === '') {
            this.state.nameShow = 1;
            this.setState(this.state);
        } else {
            Func.axiosPost("/pool/group/edit", {
                user_id: uid,
                token: token,
                group_id: gid,
                name: newName
            }, this.editCallBack)
        }
    }
    editCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            this.props.changeGroupId(1, Key.ifForceUpdateGroupList);
        } else {
            message.error(description);
        }
        this.state.nameShow = 1;
        this.setState(this.state);
    }

    render() {
        const data = this.state.info;
        const info = data.map((val, key) => {
            const [name, count, status] = val;
            let {pool: {currentOperateGid: {current}, poolIndexGroupTitle: {current: title}}} = this.props.value;
            let add = (status === current) ? `single on` : `single`;
            add = (title === 2 && status !== 0) ? `${add} operate` : add;
            return (
                <React.Fragment key={key}>
                    <div className={add} onClick={this.changeGroup.bind(this, status)}>
                        {(this.state.nameShow === 0 && status === current && title === 2) ?
                            <CoverInput group={status} value={name} edit={this.editGroupNameFuc}/> :
                            <p className={"name"}>{name}</p>
                        }
                        {title === 2 && status !== 0?
                            <React.Fragment>
                                <svg className="icon svg-icon oper-icon coin1" aria-hidden="true"
                                     onClick={this.openEditName.bind(this, status)}>
                                    <use xlinkHref="#icongroup_icon_edit_nor"></use>
                                </svg>
                                <svg className="icon svg-icon oper-icon coin2" aria-hidden="true" onClick={this.showModal}>
                                    <use xlinkHref="#icongroup_icon_del_nor"></use>
                                </svg>
                            </React.Fragment>:
                            <p className={"count"}>{count}</p>
                        }
                    </div>
                </React.Fragment>
            )
        })
        let {pool: {poolIndexGroupTitle: {current}}} = store.getState()
        return (
            <div className={"current-group-list"}>
                {current === 1 ?
                    <CreateNewGroupApp/> : <React.Fragment></React.Fragment>
                }
                <Scrollbar.PoolList style={{left: 0, height: "446px", width: "100%"}}>
                    {info}
                </Scrollbar.PoolList>
                <MyModal
                    class={"common-modal"}
                    title={intl.get('MENTION')}
                    onRef={this.onRef}
                    onSubmit={this.onSubmit}
                    inner={<h6>{intl.getHTML('YOU_SURE_DELETE_GROUP')}</h6>}
                    okText={intl.get('CONFIRM')}
                    cancelText={intl.get('CANCEL')}
                    icon={<svg className="icon svg-icon modal-icon" aria-hidden="true">
                        <use xlinkHref="#iconpop_icon_warning"></use>
                    </svg>}
                >
                </MyModal>
            </div>
        )
    }
}

class CoverInput extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.input.focus();
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    editGroupName = (id, oldName, e) => {
        this.props.edit(id, oldName, e.target.value);
    }

    render() {
        return (
            <Input ref={(input) => this.input = input}
                   onBlur={this.editGroupName.bind(this, this.props.group, this.props.value)}
                   onPressEnter={this.editGroupName.bind(this, this.props.group, this.props.value)}
                   className={"edit-name"}
                   defaultValue={this.props.value}/>
        )
    }
}


const groupDispatchToProps = (dispatch) => {
    return {
        changeGroupId: (gid, key) => {
            dispatch(CommonAction.makeActionObject(gid, key))
        }
    }
}

const GroupListApp = connect(
    commonStateToProps,
    groupDispatchToProps
)(GroupList)


class RoleList extends React.Component {
    handleChange(value) {
        CommonAction.changeCommonStatus(value, Key.changeMinerTypeOperate);
    }

    render() {
        let {pool: {poolIndexDefaultType: {current}}} = store.getState()
        return (
            <Select defaultValue={current} style={{width: "280px", display: "block", margin: "0 auto"}}
                    onChange={this.handleChange}>
                <Option value={1}>{intl.get('COMPUTE')}</Option>
                <Option value={2}>{intl.get('STORAGE')}</Option>
            </Select>
        )
    }
}

class MoveGroup extends React.Component {
    state = {info: [[0, intl.get("PLEASE_SELECT_GROUP")]]};

    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    componentDidMount() {
        let {pool: {poolIndexCurrentPid: {current}}} = store.getState();
        this.getPoolGroup(current);
    }

    getPoolGroup = (pid) => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/group/list", {user_id: uid, token: token, pool_id: pid}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            this.state.info = [[0, intl.get("PLEASE_SELECT_GROUP")]];
            for (const val of info) {
                const {name, Device_num: number, id} = val;
                if (id === 0) continue;
                this.state.info.push([id, name]);
            }
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    handleChange(value) {
        CommonAction.changeCommonStatus(value, Key.moveMinerGroupId);
    }

    render() {
        const data = this.state.info;
        const list = data.map((val, key) => {
            const [id, name] = val;
            return (<Option key={key} value={id}>{name}</Option>)
        })
        let {pool: {minerMoveGroupId: {current}}} = store.getState();
        return (
            <Select value={current} style={{width: "280px", display: "block", margin: "0 auto"}}
                    onChange={this.handleChange}>
                {list}
            </Select>
        )
    }
}

// 这个是矿工列表的操作面板
class MinerOperation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {choose: 1};
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    onRef = (ref) => {
        this.child = ref
    }
    showModal = (e) => {
        if(this.props.choose.length === 0){
            message.error(intl.get("MOVE_MACHINE_CANNOT_EMPTY"));
            return
        }
        this.state.choose = e;
        this.setState(this.state)
        this.child.showModal()
    }
    onSubmit = () => {
        // console.log(22222, this.props.choose, 444444444);
        // console.log(22222, this.props.list, 444444444);
        switch (this.state.choose) {
            case 0:
                //批量移动操作
                this.amountMove();
                break;
            case 1:
                //批量删除角色
                this.amountDelete();
                break;
            case 2:
                //批量指定角色
                console.log(3333333333)
                break;
            default:
                console.log(444444)
                break;
        }
    }
    amountMove = () => {
        const choose = this.props.choose.join(",");
        let {pool: {minerMoveGroupId: {current}}} = store.getState();
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/group/addDevice", {
            user_id: uid, token: token, group_id: current, device: choose
        }, this.moveCallBack)
    }

    amountDelete = () => {
        const choose = this.props.choose.join(",");
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/group/delDevice", {
            user_id: uid, token: token, device: choose
        }, this.moveCallBack)
    }

    moveCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            CommonAction.changeCommonStatus(1, Key.ifForceUpdateGroupList);
            message.success(intl.get("OPERATION_SUCCESS"));
        } else {
            message.error(description);
        }
    }

    render() {
        const hrefName = [
            [this.showModal.bind(this, 0), intl.get("BATCH_MOVE")],
            // [this.showModal.bind(this, 1), intl.get("BATCH_DELETE")],
            // [this.showModal.bind(this, 2), intl.get("POINT_ROLE")],
        ];
        const modalSet = [
            [<MoveGroup/>, ""],
            [<h6>{intl.get("YOU_SURE_DELETE_MINER")}</h6>, <svg className="icon svg-icon modal-icon" aria-hidden="true">
                <use xlinkHref="#iconpop_icon_warning"></use>
            </svg>],
            [<RoleList/>, ""],
            [<h6>{intl.get("YOU_SURE_RESTART_MINER")}</h6>,
                <svg className="icon svg-icon modal-icon" aria-hidden="true">
                    <use xlinkHref="#iconmsg_icon_restart_nor"></use>
                </svg>],
            [<h6>{intl.get("YOU_SURE_SHUTDOWN_MINER")}</h6>,
                <svg className="icon svg-icon modal-icon" aria-hidden="true">
                    <use xlinkHref="#iconmsg_icon_off_nor"></use>
                </svg>]
        ];
        const [inner, icon] = modalSet[this.state.choose]

        return (
            <React.Fragment>
                <MyModal
                    class={"common-modal"}
                    title={intl.get('MENTION')}
                    onRef={this.onRef}
                    onSubmit={this.onSubmit}
                    // inner={<h6>{intl.getHTML('YOU_SURE_DELETE_GROUP')}</h6>}
                    inner={inner}
                    okText={intl.get('CONFIRM')}
                    cancelText={intl.get('CANCEL')}
                    icon={icon}
                />
                <div className={"operation-center"}>
                    {/*<Button className={"but1"} onClick={this.showModal.bind(this, 3)}>{intl.get("RESTART")}</Button>*/}
                    {/*<Button className={"but2"} onClick={this.showModal.bind(this, 4)}>{intl.get("SHUT_DOWN")}</Button>*/}
                    <Button style={{width:"70px"}} className={"but1"} onClick={this.showModal.bind(this, 0)}>{intl.get("BATCH_MOVE")}</Button>
                    {/*<DropDown inner={hrefName}>*/}
                    {/*    <Button style={{left:"200px"}} className={"but3"}>{intl.get("OPERATION")}<CaretDownOutlined/></Button>*/}
                    {/*</DropDown>*/}
                </div>
            </React.Fragment>
        )
    }
}

// 搜索面板
class SearchArea extends Component {
    state = {
        value: ""
    }

    componentDidMount() {
        this.props.onRefKey(this);
    }

    getInput() {
        return this.state.value;
    }

    enterKeyword = () => {
        this.props.changePage(2, Key.ifForceUpdateGroupList);
    }
    changeValue = (e) => {
        this.state.value = e.target.value;
        this.setState(this.state);
    }
    clearInput = () => {
        this.state.value = "";
        this.setState(this.state);
        this.props.changePage(2, Key.ifForceUpdateGroupList);
    }

    render() {
        let {pool: {poolIndexCurrentPid: {current}}} = store.getState();
        let style = (current === 0) ? {left: "310px"} : {}
        return (
            <div className={"pool-search-area"} style={style}>
                <Input
                    ref={(input) => this.input = input}
                    className={"pool-index-miner-search"}
                    placeholder={intl.get("PLEASE_INPUT_MINER_NAME")}
                    onPressEnter={this.enterKeyword}
                    onChange={this.changeValue.bind(this)}
                    value={this.state.value}
                    suffix={
                        <img onClick={this.enterKeyword} src={SearchIcon} alt={intl.get("SEARCH_MINER")}/>
                    }
                />
                <Button onClick={this.clearInput} className={"clear-condition"}>{intl.get("CLEAR_CONDITION")}</Button>
            </div>
        );
    }
}

const searchDispatchToProps = (dispatch) => {
    return {
        changePage: (pid, key) => {
            dispatch(CommonAction.makeActionObject(pid, key))
        }
    }
}

const SearchAreaApp = connect(
    commonStateToProps,
    searchDispatchToProps
)(SearchArea)


const TotalDataCount = (props) => {
    return (
        <div className={"total-data-count"}>
            <p className={"tip1"}>{intl.get("TOTAL")}：{props.miner}</p>
            <p className={"tip2"}>{intl.get("ONLINE")}：{props.online}</p>
            <p className={"tip3"}>{intl.get("OFFLINE")}：{props.offline}</p>
        </div>
    );
}

class PagingInfo extends Component {
    state = {
        page: this.props.current
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {pool: {poolIndexCurrentPid: {current}, ifGroupForceUpdate: {current: force}, currentOperateGid: {current: gid}}} = nextProps.value;
        let {pool: {poolIndexCurrentPid: {current: oldValue}, currentOperateGid: {current: oldGid}}} = this.props.value;
        if (current !== oldValue || gid !== oldGid || force === 2) {
            this.state.page = 1;
            this.setState(this.state)
        }
    }

    changePage = (value) => {
        this.state.page = value;
        this.setState(this.state);
        this.props.changePage(1, Key.ifForceUpdateGroupList);
    }

    getPage = () => {
        return this.state.page;
    }

    render() {
        return (
            <div className={"paging-area"} style={{left: "120px"}}>
                <Pagination
                    hideOnSinglePage={true}
                    defaultCurrent={1}
                    pageSizeOptions={[10]}
                    total={this.props.total}
                    current={this.state.page}
                    showQuickJumper
                    onChange={this.changePage.bind(this)}
                />
            </div>
        )
    }
}

const pageDispatchToProps = (dispatch) => {
    return {
        changePage: (pid, key) => {
            dispatch(CommonAction.makeActionObject(pid, key))
        }
    }
}

const PagingInfoApp = connect(
    commonStateToProps,
    pageDispatchToProps
)(PagingInfo)


// 表格额外增加内容
class MinerListAppend extends Component {
    componentDidMount() {
        this.props.onRef(this)
    }

    onRef = (ref) => {
        this.child = ref
    }

    onRefKey = (ref) => {
        this.childInput = ref
    }

    pageInfo = () => {
        return this.child.getPage()
    }

    keywordInfo = () => {
        return this.childInput.getInput();
    }

    render() {
        let {pool: {poolIndexCurrentPid: {current}}} = store.getState();
        return (
            <React.Fragment>
                {current === 0 ?
                    <React.Fragment></React.Fragment> :
                    <MinerOperation list={this.props.list} choose={this.props.choose}/>
                }
                <PagingInfoApp total={this.props.total} current={this.props.page} onRef={this.onRef}/>
                <TotalDataCount miner={this.props.miner} online={this.props.online} offline={this.props.offline}/>
                <SearchAreaApp onRefKey={this.onRefKey}/>
            </React.Fragment>
        )
    }
}


let Check = (props) => {
    return (
        <Checkbox value={props.id}>
        </Checkbox>
    )
}

let IconOpen = (props) => {
    return (
        <svg onClick={props.open.bind(props.point, props.id , props.device)} className="icon svg-icon detail-icon"
             aria-hidden="true">
            <use xlinkHref="#iconicon_more_norsvg"></use>
        </svg>
    )
}


let plainOptions = [];
let defaultCheckedList = [];

class Index extends Component {
    state = {
        miner: 0,
        online: 0,
        offline: 0,
        page: 1,
        all: [],
        pool: [],
        choose: [],
        minId: [],
        checkedList: defaultCheckedList,
        indeterminate: true,
        checkAll: false,
    }

    constructor(props) {
        super(props);
    }

    onRef = (ref) => {
        this.child = ref;
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    componentDidMount() {
        let {pool: {poolIndexCurrentPid: {current}, currentOperateGid: {current: gid}}} = this.props.value;
        this.getPoolDevice(current, gid)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {pool: {poolIndexCurrentPid: {current}, ifGroupForceUpdate: {current: force}, currentOperateGid: {current: gid}}} = nextProps.value;
        let {pool: {poolIndexCurrentPid: {current: oldValue}, currentOperateGid: {current: oldGid}}} = this.props.value;
        if (current !== oldValue || gid !== oldGid || force > 0) {
            if (current !== oldValue || gid !== oldGid || force === 2) {
                this.getPoolDevice(current, gid, 1)
            } else {
                this.getPoolDevice(current, gid)
            }
        }
    }

    getPoolDevice(pid, gid, page) {
        const {uid, token} = cookie.loadAll();
        let data = {
            user_id: uid,
            token: token,
            pool_id: (pid > 0) ? pid : -1,
            group_id: (!(pid > 0)) ? -1 : gid,
            is_online: -1,
            page: (page) ? page : this.child.pageInfo(),
            keyword: this.child.keywordInfo()
        }
        this.state.all = [];
        this.state.pool = [];
        this.state.minId = {};
        this.setState(this.state);
        Func.axiosPost("/pool/device/list", data, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {current_page: page, data: list, device_offline: offline, device_online: online, total} = info;
            this.state.page = page;
            this.state.miner = total;
            this.state.online = online;
            this.state.offline = offline;
            for (const val of list) {
                const {name, pool_name: poolName, address, ip, disk_space_used: spaceUsed, disk_space_all: spaceAll, device_type: type, id, is_online: online, hardware_id: deviceId} = val;
                this.state.minId[id] = deviceId;
                this.state.all.push([name, poolName, address, ip, `${(spaceUsed / spaceAll).toFixed(2)}%`
                    , (online) ? intl.get("ONLINE") : intl.get("OFFLINE"),
                    <IconOpen device={deviceId}  id={id} point={this} open={this.openDevicePanel}/>, online])

                this.state.pool.push([<Check
                    id={id}/>, name, address, ip, `${(spaceUsed / spaceAll).toFixed(2)}%`, (online) ? intl.get("ONLINE") : intl.get("OFFLINE"),
                    <IconOpen device={deviceId}   id={id} point={this} open={this.openDevicePanel}/>, online])
            }
            this.props.openDevicePanel(0, Key.ifForceUpdateGroupList);
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    openDevicePanel(lis,device) {
        this.props.openDevicePanel(lis, Key.currentOperateDevice);
        this.props.openDevicePanel(device, Key.currentOperateHardware);
    }

    getCheckedMiner(value) {
        this.state.choose = value;
        this.setState(this.state);
    }

    onCheckAllChange = (e) =>{
        this.setState({
            checkedList: e.target.checked ? plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    aaa = () =>{
        alert(123123123)
    }

    render() {
        let {pool: {poolIndexCurrentPid: {current: currentPid}}} = this.props.value;
        const AllMiner = this.state.all;
        let minerData = this.state.pool;

        let current = currentPid;
        minerData = (current > 0) ? minerData : AllMiner;
        const style = (current > 0) ? {width: "934px", left: "322px"} : {width: "100%", left: "0px"}
        let minerRow = (current > 0) ? Func.changeName(Rows.PoolIndexList()) : Func.changeName(Rows.PoolIndexList2());

        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <Table.TableCommon
                    style={{width: "1254px", marginTop: "78px"}}
                    icon={<Icon.MinerPoolIcon/>}
                    title={intl.get("POOL_PAGE")}
                    name={<TopTips history={this.props.history} go={"/userweb/index"} warning={intl.get("WARNING_SET")} set={Key.changeUserIndexMenu} int={2} />}
                    class={"pool-add-logo"}
                    type={"other"}
                >
                    <PoolIndexPanel/>
                </Table.TableCommon>

                <div className={"pool-index-main"}>
                    {current > 0 ?
                        <Table.TableCommon
                            style={{
                                width: "306px",
                                height: "685px",
                                position: "absolute",
                                marginTop: "16px",
                                marginBottom: "100px"
                            }}
                            icon={<Icon.MyGroupIcon/>}
                            title={intl.get("MY_POOL_GROUP")}
                            type={"other"}
                        >
                            <GroupPanel onclick={Action.changePoolIndexGroupMenu}/>
                            <GroupListApp/>
                        </Table.TableCommon> : <React.Fragment></React.Fragment>
                    }

                    <Table.TableCommon
                        style={{
                            left: style.left,
                            width: style.width,
                            height: "685px",
                            position: "absolute",
                            marginTop: "16px",
                            marginBottom: "100px"
                        }}
                        icon={<Icon.MinerListIcon/>}
                        title={intl.get("MINER_LIST")}
                        row={minerRow}
                        type={"other"}
                        show={1}
                        more={<MinerListAppend miner={this.state.miner} online={this.state.online}
                                               offline={this.state.offline} page={this.state.page}
                                               total={this.state.miner} choose={this.state.choose}
                                               list={this.state.minId}
                                               onRef={this.onRef}/>}
                        emptyStyle={{margin: "170px auto 0"}}
                    >
                        <Table.RowName row={minerRow}/>
                        <Checkbox.Group style={{width: '100%'}} onChange={this.getCheckedMiner.bind(this)}>
                            <Table.TableInner row={minerRow} text={minerData}/>
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                                style={{position:"absolute",left:"40px",top:"85px",zIndex:3,display:"none"}}
                            />
                        </Checkbox.Group>
                    </Table.TableCommon>
                </div>
                <DeviceIndex/>
            </React.Fragment>
        );
    }
}



const indexDispatchToProps = (dispatch) => {
    return {
        openDevicePanel: (pid, key) => {
            dispatch(CommonAction.makeActionObject(pid, key))
        }
    }
}

const IndexApp = connect(
    commonStateToProps,
    indexDispatchToProps
)(Index)


export default class Back extends Component {
    render() {
        return (
            <Initialize history={this.props.history}>
                <IndexApp history={this.props.history}/>
            </Initialize>
        )
    }
}

