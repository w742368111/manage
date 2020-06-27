import React, {Component} from "react";
import intl from "react-intl-universal";
import store from "../../store/"
import MyModal from "../common/Modal";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";
import {Input, message} from 'antd';
import PicturesWall from "../common/Upload"

import * as Func from "../../common/common";
import cookie from "react-cookies";


const {TextArea} = Input;

class AddPicture extends Component {
    constructor(props) {
        super(props);
    }

    onRef = (ref) => {
        this.child = ref
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    getInfo() {
        return this.child.getImg()
    }

    render() {
        return (
            <div className="add-picture-area">
                <PicturesWall onRef={this.onRef}/>
            </div>
        )
    }
}

class CreateInner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: [],
            info: "",
            contacts: "",
            phone: ""
        }
    }

    componentDidMount = () => {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    onRef = (ref) => {
        this.child = ref
    }
    getInfo = () => {
        this.state.img = this.child.getInfo();
        return this.state;
    }
    changeValue = (key, e) => {
        this.state[key] = e.target.value
    }

    render() {
        return (
            <div className="bill-create-main">
                <p style={{top: "2px"}}>{intl.get("QUESTION_DETAIL")}</p>
                <TextArea onChange={this.changeValue.bind(this, "info")} placeholder={intl.get("BILL_QUESTION_TIPS")}/>
                <p style={{top: "152px"}}>{intl.get("ADD_QUESTION_PICTURE")}</p>
                <AddPicture onRef={this.onRef}/>
                <Input onChange={this.changeValue.bind(this, "contacts")} placeholder={intl.get("CONTACT_PEOPLE")}
                       className={"committer"}/>
                <Input onChange={this.changeValue.bind(this, "phone")} placeholder={intl.get("CONTACT_PHONE_NO")}
                       className={"committer"} style={{left: "230px"}}/>
            </div>
        )
    }
}

export default class CreateBill extends Component {
    constructor(props) {
        super(props);
        store.subscribe(this.storeChange.bind(this));
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    onRef = (ref) => {
        this.child = ref
    }
    getInfo = (ref) => {
        this.inner = ref
    }
    showModal = (e) => {
        this.child.showModal()
    }

    storeChange() {
        const {bill: {ifCreateNewBill: {current}}} = store.getState();
        current !== 0 && this.showModal()
    }

    onClose() {
        CommonAction.changeCommonStatus(0, Key.openCreateBillOperate);
    }

    onSubmit = () => {
        const {info, img, contacts, phone} = this.inner.getInfo();

        const {uid, token} = cookie.loadAll();
        if(Func.isEmpty(info)){
            message.error(intl.get("INFO_OF_THE_BILL_CANNOT_BE_EMPTY"));
            return
        }
        if(Func.isEmpty(contacts)){
            message.error(intl.get("CONTACT_MEMBER_CANNOT_BE_EMPTY"));
            return
        }
        if(Func.isEmpty(phone)){
            message.error(intl.get("CONTACT_PHONE_CANNOT_BE_EMPTY"));
            return
        }

        const text  = JSON.stringify(this.inner.getInfo())
        Func.axiosPost("/workorder/workorder/add", {user_id: uid, token: token, info: text}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            this.props.update();
            message.success(intl.get("BILL_ADD_SUCCESS"));
            this.child.hideModal();
        } else {
            message.error(description);
        }
    }

    render() {
        return (
            <MyModal
                class={"create-bill"}
                title={intl.get('CREATE_NEW_BILL')}
                onRef={this.onRef}
                onSubmit={this.onSubmit}
                submitShow={1}
                okText={intl.get('SUBMIT_NEW_BILL')}
                cancelText={intl.get('CANCEL')}
                onCancel={this.onClose}
                inner={<CreateInner onRef={this.getInfo}/>}
            >
            </MyModal>
        )
    }
}