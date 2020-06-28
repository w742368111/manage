import React, {Component} from "react";
import * as Common from "../index/common/Public";
import * as Table from "../common/Table";
import * as Icon from "../common/Icon";
import intl from "react-intl-universal";
import {Link} from "react-router-dom";
import img1 from "../../common/image/img/5.jpg";
import img2 from "../../common/image/img/6.jpg";
import MyModal from "../common/Modal";
import cookie from "react-cookies";
import * as Func from "../../common/common";
import {message} from "antd";
import Initialize from "../Initialize";

const PagePosition = () => {
    return (
        <div className="page-position">
            <p>
                <Link to={"/index/index"}>{intl.get("INDEX_PAGE")}</Link>
                <span>></span>
                <Link to={"/billweb/index"}>{intl.get("BILL_PAGE")}</Link>
                <span>></span>
                {intl.get("BILL_DETAIL")}
            </p>
        </div>
    )
}

class BillFormat extends Component {
    state = {
        img: "",
        info: [],
        contact:"",
        phone:"",
        imgList: []
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
        this.getBillInfo()
    }

    getBillInfo = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/workorder/workorder/get", {
            user_id: uid,
            token: token,
            work_order_id: Func.getQueryVariable("id")
        }, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {id, user_name: name, add_time: addTime, status, Info: text} = info;
            this.state.info = [id, name, addTime, (status === 2) ? intl.get("ALREADY_CLOSE_BILL") : intl.get("NOT_DEAL_BILL"), JSON.parse(text).info];
            this.state.imgList = JSON.parse(text).img;
            this.state.contact = JSON.parse(text).contacts;
            this.state.phone = JSON.parse(text).phone;
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    onRef = (ref) => {
        this.child = ref
    }
    openPanel = (img) => {
        this.state.img = img;
        this.setState(this.state)
        this.child.showModal()
    }

    render() {
        const info = this.state.info;
        const [number, name, time, status, text] = info;

        const imgList = this.state.imgList.map((val, key) => {
            return (
                <img key={key} onClick={this.openPanel.bind(this, val)} src={val}/>
            )
        })

        return (
            <React.Fragment>
                <div className="bill-detail-main-area">
                    <div className="info1">
                        <div className="icon"></div>
                        <p className="title">{intl.get("BASE_INFO")}</p>
                        <p style={{top: "62px",left: "15px"}}>{intl.get("BILL_NUMBER_SHORT")}</p><p
                        style={{top: "62px", left: "80px"}}>:</p>
                        <p style={{top: "62px", left: "100px"}}>{number}</p>

                        <p style={{top: "109px",left: "15px"}}>{intl.get("SUBMIT_MEMBER")}</p><p
                        style={{top: "109px", left: "80px"}}>:</p>
                        <p style={{top: "109px", left: "100px"}}>{name}</p>

                        <p style={{top: "156px",left: "15px"}}>{intl.get("BILL_UPDATE_TIME")}</p><p
                        style={{top: "156px", left: "80px"}}>:</p>
                        <p style={{top: "156px", left: "100px"}}>{time}</p>

                        <p style={{top: "203px",left: "15px"}}>{intl.get("BILL_STATUS")}</p><p
                        style={{top: "203px", left: "80px"}}>:</p>
                        <p style={{top: "203px", left: "100px"}}>{status}</p>

                        <p style={{top: "250px",left: "15px"}}>{intl.get("BILL_PEOPLE")}</p><p
                        style={{top: "250px", left: "80px"}}>:</p>
                        <p style={{top: "250px", left: "100px"}}>{this.state.contact}</p>

                        <p style={{top: "297px",left: "15px"}}>{intl.get("BILL_PHONE_NO")}</p><p
                        style={{top: "297px", left: "80px"}}>:</p>
                        <p style={{top: "297px", left: "100px"}}>{this.state.phone}</p>

                    </div>
                    <div className="info2">
                        <div style={{top: "70px"}} className="icon"></div>
                        <p style={{top: "68px"}} className="title">{intl.get("BILL_CONTENT")}</p>
                        <div className="content">
                            <p className={"left"}>{intl.get("QUESTION_DESCRIPTION")}：</p>
                            <p className={"in"}>{text}</p>
                            <div style={{clear: "both"}}></div>
                        </div>
                    </div>
                    <div className={"info3"}>
                        <p className={"left"}>{intl.get("BILL_PICTURE")}：</p>
                        <div className={"picture-area"}>
                            {imgList}
                            <div style={{clear: "both"}}></div>
                        </div>
                        <div style={{clear: "both"}}></div>
                    </div>
                </div>
                <MyModal
                    class={"bill-detail-pic"}
                    onRef={this.onRef}
                    inner={<img className={"append_pic"} src={this.state.img}/>}
                >
                </MyModal>
            </React.Fragment>
        )
    }
}

const BillContents = () => {
    return (
        <div className={"bill-detail-content"}>
            <Table.TableCommon
                style={{marginTop: "22px", width: "100%", marginBottom: "100px"}}
                icon={<Icon.BillRecordIcon/>}
                title={intl.get("BILL_DETAIL")} p
                type={"other"}
            >
                <BillFormat/>
            </Table.TableCommon>
        </div>
    )
}

class BillDetail extends Component {
    render() {
        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>
                <PagePosition/>
                <BillContents/>
            </React.Fragment>
        )
    }
}

class Back extends Component {
    render() {
        return (
            <Initialize history={this.props.history}>
                <BillDetail history={this.props.history}/>
            </Initialize>
        )
    }
}

export default Back;