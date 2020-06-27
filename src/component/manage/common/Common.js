import React, {Component} from "react";
import * as CommonAction from "../../../action/common";
import * as Key from "../../../store/config/config";
import {Button} from "antd";
import intl from "react-intl-universal";

export default class BannerTitle extends Component {
    constructor(props) {
        super(props);
    }

    changeTitle = (n) => {
        CommonAction.changeCommonStatus(n, Key.manageIndexTitleChange);
        (this.props.href === 1) && this.props.history.push('/manageweb/index/');
    }

    render() {
        const name = (this.props.current === 1) ? ["but-on", ""] : ["", "but-on"];
        return (
            <div className="manage-model-title">
                <Button onClick={this.changeTitle.bind(this, 1)} style={{left: "93px"}}
                        className={name[0]}>{intl.get('STAFF_MANAGE')}</Button>
                <Button onClick={this.changeTitle.bind(this, 2)} style={{left: "223px"}}
                        className={name[1]}>{intl.get('ROLE_MANAGE')}</Button>
            </div>
        )
    }
}






