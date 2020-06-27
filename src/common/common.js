import intl from "react-intl-universal";
import copy from 'copy-to-clipboard';
import {message} from "antd";
import qs from 'qs';
import axios from "axios";
import cookie from "react-cookies";
import SparkMD5 from 'spark-md5'

export const axiosPost = (url, parameter, callback, ...other) => {
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.post(url, qs.stringify(
        parameter
        )
    ).then(function (data) {
        callback(data, other)
    });
}

message.config({
    top: "40%",
    maxCount: 5,
    rtl: true,
});


export const getFileMD5 = (file, callback, resolve) => {
    const fileSize = file.size;
    const chunkSize = 1024 * 1024 * 10;
    const chunks = Math.ceil(fileSize / chunkSize);

    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();

    const bolbSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
    let currentChunk = 0;

    fileReader.onload = e => {
        const res = e.target.result;
        spark.append(res);
        currentChunk++;
        if (currentChunk < chunks) {
            loadNext();
            console.log(`第${currentChunk}分片解析完成, 开始第${currentChunk + 1}分片解析`);
        } else {
            const md5 = spark.end();
            callback(md5, resolve)
        }
    };

    const loadNext = () => {
        const start = currentChunk * chunkSize;
        const end =
            start + chunkSize > file.size ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(bolbSlice.call(file, start, end));
    };
    loadNext();
}


// 检查手机号合法性
export const checkMobileNumber = (phone) => {
    const reg = /(1[3-9]\d{9}$)/;
    return !reg.test(phone);
}

// 检查邮箱的合法性
export const checkEmailFormat = (email) => {
    const reg = /^\w+@[a-z0-9]+\.[a-z]+$/i;
    return !reg.test(email);
}

// 改变告警类型
export const changeWarningType = (key) => {
    const list = {
        13: "CPU温度过高"
    }
    return list[key];
}

// 获取URL参数
export const getQueryVariable = (variable) => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
}

// 获取告警配置数组
export const getWarningArray = (count, length = 6) => {
    const arr = count.toString(2).split("").reverse();
    for (let i = arr.length; i < length; i++) {
        arr.push("0");
    }
    return arr.map((key) => {
        return key === '1'
    })
}

export const coinExchange = (coin) => {
    return `${coin}FIL`
}

export const offlineChange = (rate) => {
    return `${rate}%`
}

export const powerUnitChange = (pow) => {
    if (pow < 1024) {
        return pow + ' GB';
    } else if (pow < 1024 * 1024) {
        return (pow / 1024).toFixed(2) + ' TB';
    } else {
        return (pow / 1024 / 1024).toFixed(2) + ' PB';
    }
}

export const success = (add) => {
    if (copy(add)) {
        message.success(intl.get('ALREADY_COPY'), 1);
    } else {
        message.error(intl.get('COPY_FAILED'), 1);
    }
};

// 切换对应语言的方法
export const changeName = (info) => {
    let back = [];
    for (const [key, width] of info) {
        back.push([intl.get(key), width])
    }
    return back
}

export const isEmpty = (obj) => {
    return (typeof obj == "undefined" || obj == null || obj == "")
}


// 基础权限转换的函数
export const getBaseInfoPower = (power) => {
    let detail = [
        ["POWER_INCOME_INFO", 2, 0, 0, 0, 1, "INCOME_VIEW"],
        ["POWER_GROUP_MANAGE", 2, 2, 2, 2, 2, "GROUP_VIEW", "GROUP_ADD", "GROUP_EDIT", "GROUP_DELETE"],
        ["POWER_MINER_MANAGE", 2, 2, 2, 0, 3, "DEVICE_VIEW", "DEVICE_ADD", "DEVICE_EDIT"],
        ["POWER_STAFF_MANAGE", 2, 2, 2, 2, 4, "USER_VIEW", "USER_ADD", "USER_EDIT", "USER_DELETE"],
        ["POWER_ROLE_MANAGE", 2, 2, 2, 2, 5, "ROLE_VIEW", "ROLE_ADD", "ROLE_EDIT", "ROLE_DELETE"],
        ["POWER_POWER_MANAGE", 2, 0, 2, 0, 6, "PERMISSION_VIEW", "", "PERMISSION_EDIT"],
        ["POWER_WARNING_SET", 2, 0, 0, 0, 7, "WARNING_VIEW"],
        ["POWER_BILL_MANAGE", 2, 2, 2, 2, 8, "WORKORDER_VIEW", "WORKORDER_ADD", "WORKORDER_EDIT", "WORKORDER_DELETE"],
    ]

    for (const key in detail) {
        for (const dex in detail[key]) {
            if (dex < 6 || detail[key][dex] === "") {
                continue;
            }
            if (!power.includes(detail[key][dex])) {
                detail[key][dex - 5] = 3;
            }
        }
    }

    return detail;
}


// 获取用户登录的系统
export const getClientSystem = () => {
    let sUserAgent = navigator.userAgent;
    let isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    let isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "Mac";
    let isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    let isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) return "Linux";
    if (isWin) {
        let isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Win2000";
        let isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WinXP";
        let isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Win2003";
        let isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "WinVista";
        let isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Win7";
        let isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
        if (isWin10) return "Win10";
    }
    return "other";
}


// 获取用户登录的浏览器
export const getClientExplorer = () => {
    let Sys = {};
    let ua = navigator.userAgent.toLowerCase();
    let re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
    let m = ua.match(re);
    try {
        Sys.browser = m[1].replace(/version/, "'safari");
        Sys.ver = m[2];
    } catch (e) {
        console.log("getBrowserInfo fail.")
    }
    const {browser, ver} = Sys;
    return `${browser} ${ver}`;
}


// 手机验证码合法性校验
export const checkVerifyValidity = (verify) => {
    if (verify.length !== 4) {
        return false;
    }
    if (isNaN(verify)) {
        return false;
    }
    return true
}


// 新密码校验
export const checkNewPassword = (newPassword, rePassword) => {
    if (newPassword.length < 8) {
        return {status: false, reason: "NEW_PASSWORD_CANNOT_LESS_THAN"}
    }
    if (newPassword !== rePassword) {
        return {status: false, reason: "NEW_PASSWORD_NOT_SAME"}
    }
    return {status: true, reason: "NEW_PASSWORD_NOT_SAME"}
}

// 告警频率修改
export const warningRateChange = (rate) => {
    if (rate === 600) {
        return "TEN_MINUTE";
    }
    if (rate === 3600) {
        return "ONE_HOUR";
    }
    if (rate === 86400) {
        return "ONE_DAY";
    }
    return "UNSET";
}

//工单编号转换函数
export const billNoChange = (id) => {
    let len = id.toString().length;
    while(len < 6) {
        id = "0" + id;
        len++;
    }
    return `GD_${id}`
}




// 盘位转换的函数
export const get_disknum = (str, type) => {
    const json = {
        "list": [{
            "productid": "AMXH4U24SE1",
            "disknum": 24,
            "usbnum": 6,
            "netcardnum": 2,
            "diskinfo": [{"name": "disk1", "businfo": "pci-0000:00:17.0-ata-1"}, {
                "name": "disk2",
                "businfo": "pci-0000:00:17.0-ata-2"
            }, {"name": "disk3", "businfo": "pci-0000:00:17.0-ata-3"}, {
                "name": "disk4",
                "businfo": "pci-0000:00:17.0-ata-4"
            }, {"name": "disk5", "businfo": "pci-0000:00:17.0-ata-5"}, {
                "name": "disk6",
                "businfo": "pci-0000:00:17.0-ata-6"
            }, {"name": "disk7", "businfo": "pci-0000:00:17.0-ata-7"}, {
                "name": "disk8",
                "businfo": "pci-0000:00:17.0-ata-8"
            }, {"name": "disk9", "businfo": "pci-0000:08:00.0-ata-4"}, {
                "name": "disk10",
                "businfo": "pci-0000:08:00.0-ata-3"
            }, {"name": "disk11", "businfo": "pci-0000:08:00.0-ata-2"}, {
                "name": "disk12",
                "businfo": "pci-0000:08:00.0-ata-1"
            }, {"name": "disk13", "businfo": "pci-0000:02:00.0-ata-4"}, {
                "name": "disk14",
                "businfo": "pci-0000:02:00.0-ata-3"
            }, {"name": "disk15", "businfo": "pci-0000:02:00.0-ata-2"}, {
                "name": "disk16",
                "businfo": "pci-0000:02:00.0-ata-1"
            }, {"name": "disk17", "businfo": "pci-0000:07:00.0-ata-4"}, {
                "name": "disk18",
                "businfo": "pci-0000:07:00.0-ata-3"
            }, {"name": "disk19", "businfo": "pci-0000:07:00.0-ata-2"}, {
                "name": "disk20",
                "businfo": "pci-0000:07:00.0-ata-1"
            }, {"name": "disk21", "businfo": "pci-0000:09:00.0-ata-4"}, {
                "name": "disk22",
                "businfo": "pci-0000:09:00.0-ata-3"
            }, {"name": "disk23", "businfo": "pci-0000:09:00.0-ata-2"}, {
                "name": "disk24",
                "businfo": "pci-0000:09:00.0-ata-1"
            }],
            "usbinfo": [{"name": "usb1", "businfo": "pci-0000:03:00.0-usb-0:2:1.0-scsi-0:0:0:0"}, {
                "name": "usb2",
                "businfo": "pci-0000:03:00.0-usb-0:1:1.0-scsi-0:0:0:0"
            }, {"name": "usb3", "businfo": "pci-0000:00:14.0-usb-0:4:1.0-scsi-0:0:0:0"}, {
                "name": "usb4",
                "businfo": "pci-0000:00:14.0-usb-0:3:1.0-scsi-0:0:0:0"
            }, {"name": "usb5", "businfo": "pci-0000:00:14.0-usb-0:11:1.0-scsi-0:0:0:0"}, {
                "name": "usb6",
                "businfo": "pci-0000:00:14.0-usb-0:12:1.0-scsi-0:0:0:0"
            }],
            "netcardinfo": [{"name": "lan1", "type": "master", "businfo": "pci0000:00/0000:00:1f.6"}, {
                "name": "lan2",
                "type": "slave",
                "businfo": "pci0000:00/0000:00:1c.4/0000:06:00.0"
            }]
        }, {
            "productid": "AMXH2U12SE1",
            "disknum": 12,
            "usbnum": 6,
            "netcardnum": 2,
            "diskinfo": [{"name": "disk1", "businfo": "pci-0000:00:17.0-ata-1"}, {
                "name": "disk2",
                "businfo": "pci-0000:00:17.0-ata-2"
            }, {"name": "disk3", "businfo": "pci-0000:00:17.0-ata-3"}, {
                "name": "disk4",
                "businfo": "pci-0000:00:17.0-ata-4"
            }, {"name": "disk5", "businfo": "pci-0000:00:17.0-ata-5"}, {
                "name": "disk6",
                "businfo": "pci-0000:00:17.0-ata-6"
            }, {"name": "disk7", "businfo": "pci-0000:00:17.0-ata-7"}, {
                "name": "disk8",
                "businfo": "pci-0000:00:17.0-ata-8"
            }, {"name": "disk9", "businfo": "pci-0000:05:00.0-ata-4"}, {
                "name": "disk10",
                "businfo": "pci-0000:05:00.0-ata-3"
            }, {"name": "disk11", "businfo": "pci-0000:05:00.0-ata-2"}, {
                "name": "disk12",
                "businfo": "pci-0000:05:00.0-ata-1"
            }],
            "usbinfo": [{"name": "usb1", "businfo": "pci-0000:01:00.0-usb-0:2:1.0-scsi-0:0:0:0"}, {
                "name": "usb2",
                "businfo": "pci-0000:01:00.0-usb-0:1:1.0-scsi-0:0:0:0"
            }, {"name": "usb3", "businfo": "pci-0000:00:14.0-usb-0:4:1.0-scsi-0:0:0:0"}, {
                "name": "usb4",
                "businfo": "pci-0000:00:14.0-usb-0:3:1.0-scsi-0:0:0:0"
            }, {"name": "usb5", "businfo": "pci-0000:00:14.0-usb-0:11:1.0-scsi-0:0:0:0"}, {
                "name": "usb6",
                "businfo": "pci-0000:00:14.0-usb-0:12:1.0-scsi-0:0:0:0"
            }],
            "netcardinfo": [{"name": "lan1", "type": "master", "businfo": "pci0000:00/0000:00:1f.6"}, {
                "name": "lan2",
                "type": "slave",
                "businfo": "pci0000:00/0000:00:1c.4/0000:04:00.0"
            }]
        }, {
            "productid": "AMXH3U16DE10",
            "disknum": 16,
            "usbnum": 4,
            "netcardnum": 3,
            "diskinfo": [{"name": "disk1", "businfo": "pci-0000:00:1f.2-ata-1"}, {
                "name": "disk2",
                "businfo": "pci-0000:00:1f.2-ata-2"
            }, {"name": "disk3", "businfo": "pci-0000:00:1f.2-ata-3"}, {
                "name": "disk4",
                "businfo": "pci-0000:00:1f.2-ata-4"
            }, {"name": "disk5", "businfo": "pci-0000:00:11.4-ata-1"}, {
                "name": "disk6",
                "businfo": "pci-0000:00:11.4-ata-2"
            }, {"name": "disk7", "businfo": "pci-0000:00:11.4-ata-3"}, {
                "name": "disk8",
                "businfo": "pci-0000:00:11.4-ata-4"
            }, {"name": "disk9", "businfo": "pci-0000:01:00.0-ata-4"}, {
                "name": "disk10",
                "businfo": "pci-0000:01:00.0-ata-3"
            }, {"name": "disk11", "businfo": "pci-0000:01:00.0-ata-2"}, {
                "name": "disk12",
                "businfo": "pci-0000:01:00.0-ata-1"
            }, {"name": "disk13", "businfo": "pci-0000:03:00.0-ata-4"}, {
                "name": "disk14",
                "businfo": "pci-0000:03:00.0-ata-3"
            }, {"name": "disk15", "businfo": "pci-0000:03:00.0-ata-2"}, {
                "name": "disk16",
                "businfo": "pci-0000:03:00.0-ata-1"
            }],
            "usbinfo": [{"name": "usb1", "businfo": "pci0000:00/0000:00:14.0/usb3/3-2/3-2:1.0"}, {
                "name": "usb2",
                "businfo": "pci0000:00/0000:00:14.0/usb3/3-1/3-1:1.0"
            }, {"name": "usb3", "businfo": "pci0000:00/0000:00:14.0/usb4/4-1/4-1:1.0"}, {
                "name": "usb4",
                "businfo": "pci0000:00/0000:00:14.0/usb4/4-2/4-2:1.0"
            }],
            "netcardinfo": [{
                "name": "lan1",
                "type": "master",
                "businfo": "pci0000:00/0000:00:1c.2/0000:06:00.0"
            }, {"name": "lan2", "type": "slave", "businfo": "pci0000:00/0000:00:1c.3/0000:07:00.0"}, {
                "name": "lan3",
                "type": "slave",
                "businfo": "pci0000:00/0000:00:02.0/0000:02:00.0"
            }]
        }, {
            "productid": "XMXH2U12DE1-XD",
            "disknum": 12,
            "usbnum": 2,
            "netcardnum": 2,
            "diskinfo": [{"name": "disk1", "businfo": "pci-0000:02:00.0-scsi-0:2:0:0"}, {
                "name": "disk2",
                "businfo": "pci-0000:02:00.0-scsi-0:2:3:0"
            }, {"name": "disk3", "businfo": "pci-0000:02:00.0-scsi-0:2:6:0"}, {
                "name": "disk4",
                "businfo": "pci-0000:02:00.0-scsi-0:2:9:0"
            }, {"name": "disk5", "businfo": "pci-0000:02:00.0-scsi-0:2:1:0"}, {
                "name": "disk6",
                "businfo": "pci-0000:02:00.0-scsi-0:2:4:0"
            }, {"name": "disk7", "businfo": "pci-0000:02:00.0-scsi-0:2:7:0"}, {
                "name": "disk8",
                "businfo": "pci-0000:02:00.0-scsi-0:2:10:0"
            }, {"name": "disk9", "businfo": "pci-0000:02:00.0-scsi-0:2:2:0"}, {
                "name": "disk10",
                "businfo": "pci-0000:02:00.0-scsi-0:2:5:0"
            }, {"name": "disk11", "businfo": "pci-0000:02:00.0-scsi-0:2:8:0"}, {
                "name": "disk12",
                "businfo": "pci-0000:02:00.0-scsi-0:2:11:0"
            }],
            "usbinfo": [{"name": "usb1", "businfo": "pci-0000:00:1d.0-usb-0:1.1:1.0-scsi-0:0:0:0"}, {
                "name": "usb2",
                "businfo": "pci-0000:00:1d.0-usb-0:1.2:1.0-scsi-0:0:0:0"
            }],
            "netcardinfo": [{
                "name": "lan1",
                "type": "master",
                "businfo": "pci0000:00/0000:00:01.0/0000:01:00.0"
            }, {"name": "lan2", "type": "slave", "businfo": "pci0000:00/0000:00:01.0/0000:01:00.1"}]
        }, {
            "productid": "YMXH2U12DE1-YK",
            "disknum": 12,
            "usbnum": 2,
            "netcardnum": 2,
            "raidcard": true,
            "diskinfo": [{
                "name": "disk1",
                "businfo": "pci-0000:02:00.0-scsi-0:2:1:0",
                "raidbuspara": "megaraid,0"
            }, {
                "name": "disk2",
                "businfo": "pci-0000:02:00.0-scsi-0:2:4:0",
                "raidbuspara": "megaraid,3"
            }, {
                "name": "disk3",
                "businfo": "pci-0000:02:00.0-scsi-0:2:7:0",
                "raidbuspara": "megaraid,6"
            }, {
                "name": "disk4",
                "businfo": "pci-0000:02:00.0-scsi-0:2:10:0",
                "raidbuspara": "megaraid,9"
            }, {
                "name": "disk5",
                "businfo": "pci-0000:02:00.0-scsi-0:2:2:0",
                "raidbuspara": "megaraid,1"
            }, {
                "name": "disk6",
                "businfo": "pci-0000:02:00.0-scsi-0:2:5:0",
                "raidbuspara": "megaraid,4"
            }, {
                "name": "disk7",
                "businfo": "pci-0000:02:00.0-scsi-0:2:8:0",
                "raidbuspara": "megaraid,7"
            }, {
                "name": "disk8",
                "businfo": "pci-0000:02:00.0-scsi-0:2:11:0",
                "raidbuspara": "megaraid,10"
            }, {
                "name": "disk9",
                "businfo": "pci-0000:02:00.0-scsi-0:2:3:0",
                "raidbuspara": "megaraid,2"
            }, {
                "name": "disk10",
                "businfo": "pci-0000:02:00.0-scsi-0:2:6:0",
                "raidbuspara": "megaraid,5"
            }, {
                "name": "disk11",
                "businfo": "pci-0000:02:00.0-scsi-0:2:9:0",
                "raidbuspara": "megaraid,8"
            }, {"name": "disk12", "businfo": "pci-0000:02:00.0-scsi-0:2:12:0", "raidbuspara": "megaraid,11"}],
            "usbinfo": [{"name": "usb1", "businfo": "pci-0000:00:1d.0-usb-0:1.1:1.0-scsi-0:0:0:0"}, {
                "name": "usb2",
                "businfo": "pci-0000:00:1d.0-usb-0:1.2:1.0-scsi-0:0:0:0"
            }],
            "netcardinfo": [{
                "name": "lan1",
                "type": "master",
                "businfo": "pci0000:00/0000:00:01.0/0000:01:00.0"
            }, {"name": "lan2", "type": "slave", "businfo": "pci0000:00/0000:00:01.0/0000:01:00.1"}]
        }, {
            "productid": "KMXH2U12DE1-KKH",
            "disknum": 11,
            "usbnum": 2,
            "netcardnum": 6,
            "diskinfo": [{"name": "disk2", "businfo": "pci-0000:18:00.0-scsi-0:0:3:0"}, {
                "name": "disk3",
                "businfo": "pci-0000:18:00.0-scsi-0:0:6:0"
            }, {"name": "disk4", "businfo": "pci-0000:18:00.0-scsi-0:0:9:0"}, {
                "name": "disk5",
                "businfo": "pci-0000:18:00.0-scsi-0:0:1:0"
            }, {"name": "disk6", "businfo": "pci-0000:18:00.0-scsi-0:0:4:0"}, {
                "name": "disk7",
                "businfo": "pci-0000:18:00.0-scsi-0:0:7:0"
            }, {"name": "disk8", "businfo": "pci-0000:18:00.0-scsi-0:0:10:0"}, {
                "name": "disk9",
                "businfo": "pci-0000:18:00.0-scsi-0:0:2:0"
            }, {"name": "disk10", "businfo": "pci-0000:18:00.0-scsi-0:0:5:0"}, {
                "name": "disk11",
                "businfo": "pci-0000:18:00.0-scsi-0:0:8:0"
            }, {"name": "disk12", "businfo": "pci-0000:18:00.0-scsi-0:0:11:0"}],
            "usbinfo": [{"name": "usb1", "businfo": "pci-0000:00:14.0-usb-0:1:1.0-scsi-0:0:0:0"}, {
                "name": "usb2",
                "businfo": "pci-0000:00:14.0-usb-0:3:1.0-scsi-0:0:0:0"
            }],
            "netcardinfo": [{
                "name": "lan1",
                "type": "master",
                "businfo": "pci0000:17/0000:17:02.0/0000:19:00.0"
            }, {"name": "lan2", "type": "slave", "businfo": "pci0000:17/0000:17:02.0/0000:19:00.1"}, {
                "name": "lan3",
                "type": "slave",
                "businfo": "pci0000:17/0000:17:02.0/0000:19:00.2"
            }, {"name": "lan4", "type": "slave", "businfo": "pci0000:17/0000:17:02.0/0000:19:00.3"}, {
                "name": "lan5",
                "type": "slave",
                "businfo": "pci0000:3a/0000:3a:00.0/0000:3b:00.0"
            }, {"name": "lan6", "type": "slave", "businfo": "pci0000:3a/0000:3a:00.0/0000:3b:00.1"}]
        }, {
            "productid": "KMXH2U12DE1-KKL",
            "disknum": 12,
            "usbnum": 2,
            "netcardnum": 6,
            "diskinfo": [{"name": "disk1", "businfo": "pci-0000:18:00.0-scsi-0:0:0:0"}, {
                "name": "disk2",
                "businfo": "pci-0000:18:00.0-scsi-0:0:3:0"
            }, {"name": "disk3", "businfo": "pci-0000:18:00.0-scsi-0:0:6:0"}, {
                "name": "disk4",
                "businfo": "pci-0000:18:00.0-scsi-0:0:9:0"
            }, {"name": "disk5", "businfo": "pci-0000:18:00.0-scsi-0:0:1:0"}, {
                "name": "disk6",
                "businfo": "pci-0000:18:00.0-scsi-0:0:4:0"
            }, {"name": "disk7", "businfo": "pci-0000:18:00.0-scsi-0:0:7:0"}, {
                "name": "disk8",
                "businfo": "pci-0000:18:00.0-scsi-0:0:10:0"
            }, {"name": "disk9", "businfo": "pci-0000:18:00.0-scsi-0:0:2:0"}, {
                "name": "disk10",
                "businfo": "pci-0000:18:00.0-scsi-0:0:5:0"
            }, {"name": "disk11", "businfo": "pci-0000:18:00.0-scsi-0:0:8:0"}, {
                "name": "disk12",
                "businfo": "pci-0000:18:00.0-scsi-0:0:11:0"
            }],
            "usbinfo": [{"name": "usb1", "businfo": "pci-0000:00:14.0-usb-0:1:1.0-scsi-0:0:0:0"}, {
                "name": "usb2",
                "businfo": "pci-0000:00:14.0-usb-0:3:1.0-scsi-0:0:0:0"
            }],
            "netcardinfo": [{
                "name": "lan1",
                "type": "master",
                "businfo": "pci0000:17/0000:17:02.0/0000:19:00.0"
            }, {"name": "lan2", "type": "slave", "businfo": "pci0000:17/0000:17:02.0/0000:19:00.1"}, {
                "name": "lan3",
                "type": "slave",
                "businfo": "pci0000:17/0000:17:02.0/0000:19:00.2"
            }, {"name": "lan4", "type": "slave", "businfo": "pci0000:17/0000:17:02.0/0000:19:00.3"}, {
                "name": "lan5",
                "type": "slave",
                "businfo": "pci0000:3a/0000:3a:00.0/0000:3b:00.0"
            }, {"name": "lan6", "type": "slave", "businfo": "pci0000:3a/0000:3a:00.0/0000:3b:00.1"}]
        }, {
            "productid": "HWDDHHKK12HW",
            "disknum": 12,
            "usbnum": 2,
            "netcardnum": 2,
            "diskinfo": [{
                "name": "disk1",
                "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy0-lun-0"
            }, {"name": "disk2", "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy3-lun-0"}, {
                "name": "disk3",
                "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy6-lun-0"
            }, {"name": "disk4", "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy9-lun-0"}, {
                "name": "disk5",
                "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy1-lun-0"
            }, {"name": "disk6", "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy4-lun-0"}, {
                "name": "disk7",
                "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy7-lun-0"
            }, {"name": "disk8", "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy10-lun-0"}, {
                "name": "disk9",
                "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy2-lun-0"
            }, {
                "name": "disk10",
                "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy5-lun-0"
            }, {
                "name": "disk11",
                "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy8-lun-0"
            }, {"name": "disk12", "businfo": "pci-0000:02:00.0-sas-exp0x500e004aaaaaaa3f-phy11-lun-0"}],
            "usbinfo": [{"name": "usb1", "businfo": "pci-0000:00:1d.0-usb-0:1.1:1.0-scsi-0:0:0:0"}, {
                "name": "usb2",
                "businfo": "pci-0000:00:1d.0-usb-0:1.2:1.0-scsi-0:0:0:0"
            }],
            "netcardinfo": [{
                "name": "lan1",
                "type": "master",
                "businfo": "pci0000:00/0000:00:01.0/0000:01:00.0"
            }, {"name": "lan2", "type": "slave", "businfo": "pci0000:00/0000:00:01.0/0000:01:00.1"}]
        }]
    };

    for (let j = 0; j < json.list.length; j++) {
        if (!isEmpty(type)) {
            if (json.list[j].productid !== type) {
                continue;
            }
            for (let i = 0; i < json.list[j].diskinfo.length; i++) {
                str = str.replace(eval("/" + json.list[j].diskinfo[i].businfo + "/g"), json.list[j].diskinfo[i].name);
            }
        } else {
            for (let a = 0; a < json.list.length; a++) {
                for (let i = 0; i < json.list[a].diskinfo.length; i++) {
                    if(json.list[a].diskinfo[i].businfo === str){
                        str = json.list[0].diskinfo[i].name
                    }
                }
            }
        }
    }

    return str;
}
























