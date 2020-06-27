import React from "react";
import { Modal } from "antd";

export default class MyModal extends React.Component {
    componentDidMount() {
        this.props.onRef(this)
    }

    state = { visible: false };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    hideModal = () => {
        this.setState({
            visible: false,
        });
    }
    handleOk = e => {
        (this.props.submitShow !== 1) && this.setState({ visible: false });
        this.props.onSubmit()
    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
        this.props.onCancel && this.props.onCancel();
    };
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }
    render() {
        return (
            <React.Fragment>
                {this.props.children}
                <Modal
                    title={this.props.title}
                    centered={true}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    onClick={this.showModal}
                    okText={this.props.okText}
                    cancelText={this.props.cancelText}
                    className={this.props.class}
                    destroyOnClose={true}
                >
                    {this.props.icon}
                    {this.props.inner}
                </Modal>

            </React.Fragment>
        )
    }

}