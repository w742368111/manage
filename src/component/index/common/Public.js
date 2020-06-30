import React, {Component} from "react";
import {Link} from "react-router-dom";
import intl from "react-intl-universal";
import {Menu, Dropdown, message} from 'antd';
import * as CommonAction from "../../../action/common";
import * as Key from "../../../store/config/config";
import store from "../../../store";
import cookie from 'react-cookies';
import MyModal from "../../common/Modal";
import * as Func from "../../../common/common";
import {connect} from "react-redux";

const TopBannerBg = (props) => {
    return (
        <nav>
            <div className={"center"}>
                {props.children}
            </div>
        </nav>
    )
}

const LogoArea = (props) => {
    return (
        <React.Fragment>
            <Link to={"/index/index/"}>
                <svg className="icon svg-icon svg-logo" aria-hidden="true">
                    <use xlinkHref="#iconnav_icon_logo"></use>
                </svg>
                <h4>{intl.get('SYSTEM_NAME')}</h4>
            </Link>
        </React.Fragment>
    )
}

const MenuList = () => {
    let path = window.location.pathname;
    const above = [
        ["/index/index/"],
        ["/poolweb/index/", "/poolweb/wallet/", "/poolweb/miner/"],
        // ["/testweb/index/"],
        ["/billweb/index/", "/billweb/detail/"],
        ["/manageweb/index/", "/manageweb/detail/"]
    ];
    const link = [
        ["/index/index/", intl.get('INDEX_PAGE')],
        ["/poolweb/index/", intl.get('POOL_PAGE')],
        // ["/testweb/index/", intl.get('DEVICE_TEST_PAGE')],
        ["/billweb/index/", intl.get('BILL_PAGE')],
        ["/manageweb/index/", intl.get('MANAGE_PAGE')],
    ];
    const inner = link.map((val, key) => {
        const [href, name] = val;
        const sty = (above[key].includes(path)) ? "choose" : ""
        return (
            <Link to={href} key={key}>
                <li>
                    <div className={sty}>{name}</div>
                </li>
            </Link>
        )
    })
    return (
        <React.Fragment>
            <ul className={"menu-list"}>
                {inner}
            </ul>
        </React.Fragment>
    )
}

class UserInfo extends Component {
    state = {
        name: ""
    }

    constructor(props) {
        super(props);
        store.subscribe(this.storeChange.bind(this));
    }

    componentDidMount() {
        this.getUserName();
    }

    getUserName = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/user/user/get", {user_id: uid, token: token, to_user_id: uid}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {name} = info;
            this.state.name = name;
        } else {
            message.error(description);
        }
        this.setState(this.state);
    }

    onRef = (ref) => {
        this.child = ref
    }

    storeChange() {
        this.setState(store.getState())
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        let {user: {userStateForceUpdate: {current}}} = nextProps.value;
        current && this.getUserName();
    }

    showModal = (e) => {
        this.child.showModal()
    }
    onSubmit = () => {
        cookie.remove('uid', {path: '/'});
        cookie.remove('token', {path: '/'});
        this.props.history.push("/")
    }

    goHref = (oper) => {
        if (oper !== 0) {
            CommonAction.changeCommonStatus(oper, Key.changeUserIndexMenu)
            this.props.history.push("/userweb/index")
        } else {
            this.showModal()
        }
    }

    render() {
        const info = [
            [intl.get("USER_SET_CENTER"), 1],
            [intl.get("MESSAGE_CENTER"), 3],
            [intl.get("ABOUT_US"), 4],
            [intl.get("LOGOUT_ACCOUNT"), 0],
        ];

        const list = info.map((val, key) => {
            const [name, oper] = val;
            return (
                <Menu.Item onClick={this.goHref.bind(this, oper)} key={key}>
                    {name}
                </Menu.Item>
            )
        })
        const menu = (
            <Menu className={"user-oper-panel"}>
                {list}
            </Menu>
        );

        const name = this.state.name;

        return (
            <React.Fragment>
                <MyModal
                    class={"common-modal"}
                    title={intl.get('MENTION')}
                    onRef={this.onRef}
                    onSubmit={this.onSubmit}
                    inner={<h6>{intl.getHTML('YOU_SURE_LOGOUT_SYSTEM')}</h6>}
                    okText={intl.get('CONFIRM')}
                    cancelText={intl.get('CANCEL')}
                    icon={<svg className="icon svg-icon modal-icon" aria-hidden="true">
                        <use xlinkHref="#iconpop_icon_warning"></use>
                    </svg>}
                >
                </MyModal>
                <Dropdown overlay={menu} trigger={['click']}>
                    <div className={"user-operate-panel"}>
                        <h5>{name}</h5>
                        <svg className="icon svg-icon svg-user" aria-hidden="true">
                            <use xlinkHref="#iconnav_icon_user"></use>
                        </svg>
                    </div>
                </Dropdown>
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

const UserInfoApp = connect(
    commonStateToProps,
    createDispatchToProps
)(UserInfo)


export const TopBanner = (props) => {
    return (
        <TopBannerBg>
            <LogoArea/>
            <MenuList/>
            <UserInfoApp history={props.history}/>
        </TopBannerBg>
    )
}