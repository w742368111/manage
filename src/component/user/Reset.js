import React, {Component} from "react";
import PropTypes from 'prop-types';
import {BackGround, ErrorTip} from './common/Public'
import {Input, Button, Space, message} from 'antd';
import {Link} from "react-router-dom";
import intl from "react-intl-universal";
import * as Func from "../../common/common";
import cookie from 'react-cookies';
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';

class SendMsg extends Component {
    state = {
        send: 0
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    sendMsg = () => {
        (this.state.send === 0) && this.sendVerify();
    }

    sendVerify = () => {
        if (Func.checkMobileNumber(this.props.account)) {
            message.error(intl.get("ACCOUNT_CANNOT_BE_EMPTY"));
            return;
        }
        this.state.send = 60;
        this.setState(this.state);
        const time = setInterval(() => {
            (this.state.send === 0) && clearInterval(time) && this.setState(this.state)
            if (this.state.send > 0) {
                this.state.send--;
                this.setState(this.state);
            }
        }, 1000)
        Func.axiosPost("/user/user/sendSms", {username: this.props.account}, this.syncCallBack)
    }

    syncCallBack = (data) => {
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
        return (
            <React.Fragment>
                {this.state.send > 0 ?
                    <p style={{color: "#777"}}
                       onClick={this.sendMsg}>{intl.get("LEFT_MOUNT_SECOND", {second: this.state.send})}</p>
                    : <p onClick={this.sendMsg}>{intl.get('SEND_MOBILE_MSG')}</p>
                }
            </React.Fragment>
        )
    }
}

class Login extends Component {
    state = {
        account: "",
        verify: "",
        newPassword: "",
        step: 1,
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.loginCheck() && this.loginHref(0)
        document.addEventListener("keydown", this.onKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown)
        this.setState = (state, callback) => {
            return
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
        if (e.keyCode === 13) {
            if (this.state.step === 1) {
                this.nextStep()
            } else {
                this.resetPassword()
            }
        }
    }

    nextStep = () => {
        (Func.checkMobileNumber(this.state.account)) && (this.state.errorTip = intl.get("ACCOUNT_CANNOT_BE_EMPTY"));
        (!Func.checkVerifyValidity(this.state.verify)) && (this.state.errorTip = intl.get("MOBILE_VERIFY_CHECK_ERROR"));
        if (Func.checkMobileNumber(this.state.account) || !Func.checkVerifyValidity(this.state.verify)) {
            this.setState(this.state);
            return;
        }
        this.state.step = 2;
        this.setState(this.state)
    }

    resetPassword = () => {
        if (this.state.newPassword.length < 8) {
            message.error(intl.get("NEW_PASSWORD_CANNOT_LESS_THAN"))
            return
        }
        Func.axiosPost("/user/user/editPassword", {
            username: this.state.account,
            sms: this.state.verify,
            password: this.state.newPassword
        }, this.resetCallBack)
    }

    resetCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            message.success(intl.get("RESET_PASSWORD_SUCCESS"));
            this.props.history.push("/userweb/login");
        } else {
            this.state.step = 1;
            this.setState(this.state);
            message.error(description);
        }
    }

    render() {
        return (
            <BackGround>
                <React.Fragment>
                    <svg className="icon svg-icon svg-logo" aria-hidden="true">
                        <use xlinkHref="#iconnav_icon_logo"></use>
                    </svg>
                    <h5 className={"system-title"}>{intl.get('SYSTEM_NAME')}</h5>
                    {this.state.step === 1 ?
                        <React.Fragment>
                            <Input
                                className={"account-input"}
                                maxLength={11}
                                placeholder={intl.get('PLEASE_TYPE_MOBILE_NUMBER')}
                                onChange={this.changeValue.bind(this, "account")}
                                prefix={<svg className="icon svg-icon" aria-hidden="true">
                                    <use xlinkHref="#iconicon_password_nor"></use>
                                </svg>}
                                suffix={<SendMsg account={this.state.account}/>}
                            />
                            <Input
                                maxLength={6}
                                className={"password-input"}
                                placeholder={intl.get('PLEASE_TYPE_MOBILE_VERIFY')}
                                onChange={this.changeValue.bind(this, "verify")}
                                prefix={<svg className="icon svg-icon" aria-hidden="true">
                                    <use xlinkHref="#iconicon_password_nor"></use>
                                </svg>}
                            />
                            <Button type="primary" block className={"login-button"}
                                    onClick={this.nextStep.bind(this)}>
                                {intl.get('NEXT_STEP')}
                            </Button>
                        </React.Fragment> : <React.Fragment>
                            <Input.Password
                                className={"password-input"}
                                style={{top: "50%"}}
                                maxLength={20}
                                placeholder={intl.get('PLEASE_TYPE_NEW_PASSWORD')}
                                onChange={this.changeValue.bind(this, "newPassword")}
                                iconRender={visible => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}
                                prefix={<svg className="icon svg-icon" aria-hidden="true">
                                    <use xlinkHref="#iconicon_password_nor"></use>
                                </svg>}
                            />
                            <Button type="primary" block className={"login-button"}
                                    onClick={this.resetPassword.bind(this)}>
                                {intl.get('RESET_PASSWORD')}
                            </Button>
                        </React.Fragment>
                    }
                    <ErrorTip inner={this.state.errorTip}/>
                </React.Fragment>
            </BackGround>
        );
    }
}

Login.propTypes = {
    onClicked: PropTypes.func
}

export default Login;