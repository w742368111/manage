import React from "react";
import PropTypes from "prop-types";
import ScrollView from 'react-custom-scrollbars';

export const PoolList = (props) => {
    return (
        <div className={"index-carousel"} style={props.style}>
            <ScrollView>
                {props.children}
            </ScrollView>
        </div>
    )
}