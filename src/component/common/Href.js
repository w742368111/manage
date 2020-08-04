import React, {Component} from "react";
import {connect} from "react-redux";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";

class TopTips extends Component {
    goHref = () => {
        if (this.props.set && this.props.int) {
            this.props.commonUpdate(this.props.int, this.props.set);
        }
        this.props.history.push(this.props.go)
    }

    render() {
        return (
            <React.Fragment>
                <h5><div style={{cursor: "pointer"}} onClick={this.goHref}>{this.props.warning}</div></h5>
                <svg style={{cursor: "pointer"}} onClick={this.goHref} className="icon svg-icon svg-logo svg-inner" aria-hidden="true">
                    <use xlinkHref="#iconicon_more_norsvg"/>
                </svg>
            </React.Fragment>
        )
    }
}

const commonStateToProps = (state) => {
    return {value: state};
}

const commonDispatchToProps = (dispatch) => {
    return {
        commonUpdate: (gid, key) => {
            dispatch(CommonAction.makeActionObject(gid, key))
        }
    }
}

const TopTipsApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(TopTips)


export default TopTipsApp