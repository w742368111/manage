import React, {Component} from "react";
import * as Common from "../index/common/Public";

export default class Index extends Component{
    render() {
        return (
            <React.Fragment>
                <Common.TopBanner history={this.props.history}/>

            </React.Fragment>
        )
    }
}