import React, {Component} from "react";
import {Upload, Modal, message} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import intl from "react-intl-universal";
import axios from "axios";
import qs from "qs";
import cookie from "react-cookies";
import * as Func from "../../common/common";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";

let status = 1;
let postUrl = "";
let form = {};

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// 上传之前获取签名，md5
function beforeUpload(upState,file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error(intl.get("PICTURE_TYPE_ONLY_JPG_PNG"));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error(intl.get("PICTURE_SIZE_CANNOT_MORE_THAN"));
    }
    status = (isJpgOrPng && isLt2M) ? 1 : 0;

    if (status === 1) {
        const backDeal = (fileMD5,resolve) => {
            const {uid, token} = cookie.loadAll();
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            axios.post("/user/file/add", qs.stringify({
                user_id: uid,
                token: token,
                name: file.name,
                size: file.size,
                md5: fileMD5
            })).then(function (data) {
                const {code, data: info, description} = data.data;
                if (code === 0) {
                    const {accessid,callback,expire,host,policy,signature,upload_name} = info;
                    postUrl = host;
                    form = {
                        key:upload_name,
                        policy:policy,
                        OSSAccessKeyId:accessid,
                        success_action_status : 200,
                        callback:callback,
                        signature:signature
                    }
                } else {
                    message.error(description);
                }
                upState();
                resolve();
            });
        }
        return new Promise((resolve, reject) => {
            Func.getFileMD5(file, backDeal, resolve);
        })
    }
}


export default class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
    };

    componentDidMount() {
        this.props.onRef(this)
    }

    getImg = () => {
        return this.state.fileList.filter((val) => {
            if (val["response"]) {
                return 1;
            }
        }).map((val) => {
            // 这里是上传结果的回调
            const {response: {data}} = val;
            return data
        })
    }
    upState = () => this.setState(this.state)

    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({fileList}) => {
        (status === 1) && this.setState({fileList})
    };

    render() {
        const {previewVisible, previewImage, fileList, previewTitle} = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action={postUrl}
                    data={form}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    beforeUpload={beforeUpload.bind(this,this.upState)}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                    className={"upload-modal"}
                >
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}