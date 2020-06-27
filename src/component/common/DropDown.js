import React from "react";
import {Dropdown, Menu} from "antd";

export default class DropDown extends React.Component {
    render() {
        const inner = this.props.inner.map((value, key) => {
            const [action, name] = value;
            return (
                <Menu.Item key={key}>
                    <a target="_blank" rel="noopener noreferrer" onClick={action} >
                        {name}
                    </a>
                </Menu.Item>
            )
        })
        const menu = (
            <Menu>
                {inner}
            </Menu>
        );
        return (
            <Dropdown overlay={menu} trigger={['click']}>
                {this.props.children}
            </Dropdown>
        )
    }
}