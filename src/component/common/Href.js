import React, {Component} from "react";
import {connect} from "react-redux";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";

class TopTips extends Component{
    goHref = () =>{
        if(this.props.set && this.props.int){
            this.props.commonUpdate(this.props.int, this.props.set);
        }
        this.props.history.push(this.props.go)
    }
    render() {
        return (
            <div onClick={this.goHref}>{this.props.warning}</div>
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