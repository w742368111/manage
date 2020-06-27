import React, {Component} from "react";
import PropTypes from 'prop-types';
import {BackGround, ErrorTip} from './common/Public'
import {Input, Button} from 'antd';
import {Link} from "react-router-dom";
import intl from "react-intl-universal";
import * as Func from "../../common/common";
import cookie from 'react-cookies';
import waitImg from "../../common/image/loginWait.gif";

const ForgetPassword = (onClicked) => {
    return (
        <Link to="/userweb/reset">
            <p onClick={onClicked}>{intl.get('FORGET_PASSWORD')}</p>
        </Link>
    )
}

class Login extends Component {
    state = {
        account: "",
        password: "",
        errorTip: "",
        isWait: 0
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.loginCheck() && this.loginHref(0)
        document.addEventListener("keydown", this.onKeyDown)
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.onKeyDown)
        this.setState = (state, callback) => {
            return
        }
    }

    accountLogin = () => {
        const {account, password} = this.state;
        (Func.isEmpty(account)) && (this.state.errorTip = intl.get("ACCOUNT_CANNOT_BE_EMPTY")) && (this.setState(this.state));
        (Func.isEmpty(password)) && (this.state.errorTip = intl.get("PASSWORD_CANNOT_BE_EMPTY")) && (this.setState(this.state));
        if ((Func.isEmpty(account)) || (Func.isEmpty(password))) {
            return false;
        }
        this.state.isWait = 1;
        this.setState(this.state);
        Func.axiosPost("/user/login", {
            username: account,
            password: password,
            browser: Func.getClientExplorer(),
            system: Func.getClientSystem()
        }, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {user_id: uid, token} = info;
            cookie.save('uid', uid, {path: '/'});
            cookie.save('token', token, {path: '/'});
            this.loginCheck() && this.loginHref(2500)
        } else {
            this.state.isWait = 0;
            this.state.errorTip = description;
            this.setState(this.state)
        }
    }

    loginCheck = () => {
        return (cookie.load("uid") && cookie.load("token"));
    }

    loginHref = (n) => {
        this.state.isWait = 1;
        this.setState(this.state);
        setTimeout(() => {
            this.props.history.push('/index/index/')
        }, n)
    }

    changeValue = (name, e) => {
        this.state[name] = e.target.value;
        this.state.errorTip = "";
        this.setState(this.state)
    }

    onKeyDown = (e) => {
        if(e.keyCode === 13) {
            this.accountLogin()
        }
    }

    render() {
        return (
            <BackGround>
                {
                    this.state.isWait === 0 ?
                        <React.Fragment>
                            <svg className="icon svg-icon svg-logo" aria-hidden="true">
                                <use xlinkHref="#iconnav_icon_logo"></use>
                            </svg>
                            <h5 className={"system-title"}>{intl.get('SYSTEM_NAME')}</h5>
                            <Input
                                className={"account-input"}
                                placeholder={intl.get('PLEASE_INPUT_ACCOUNT')}
                                onChange={this.changeValue.bind(this, "account")}
                                prefix={<svg className="icon svg-icon" aria-hidden="true">
                                    <use xlinkHref="#iconicon_login_nor"></use>
                                </svg>}
                            />
                            <Input
                                type={"password"}
                                className={"password-input"}
                                placeholder={intl.get('PLEASE_INPUT_PASSWORD')}
                                onChange={this.changeValue.bind(this, "password")}
                                prefix={<svg className="icon svg-icon" aria-hidden="true">
                                    <use xlinkHref="#iconicon_password_nor"></use>
                                </svg>}
                                suffix={ForgetPassword()}
                            />
                            <Button type="primary" block className={"login-button"}
                                    onClick={this.accountLogin.bind(this)}>
                                {intl.get('LOGIN_BUTTON')}
                            </Button>
                            <ErrorTip inner={this.state.errorTip}/>
                        </React.Fragment> : <React.Fragment></React.Fragment>
                }
                {
                    this.state.isWait === 1 ? <img style={{
                            width: "50%",
                            top: "50%",
                            left: "12%",
                            position: "absolute",
                            transform: "translate(0,-50%)"
                        }} src={waitImg}/>
                        : <React.Fragment></React.Fragment>
                }


            </BackGround>
        );
    }
}

Login.propTypes = {
    onClicked: PropTypes.func
}

export default Login;