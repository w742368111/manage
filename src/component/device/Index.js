import React, {Component} from "react";
import intl from "react-intl-universal";
import store from "../../store/"
import MyModal from "../common/Modal";
import * as CommonAction from "../../action/common";
import * as Key from "../../store/config/config";
import {message, Table} from 'antd';
import {func} from "prop-types";
import * as Func from "../../common/common";
import * as Scrollbar from "../common/Scrollbars";
import {Select, Input, Button} from 'antd';
import {Line as LineChart, Pie as PieChart} from "react-chartjs"
import {connect} from "react-redux";
import cookie from "react-cookies";

const {Option} = Select;

const commonStateToProps = (state) => {
    return {value: state};
}

const commonDispatchToProps = (dispatch) => {
    return {
        commonAction: (gid, key) => {
            dispatch(CommonAction.makeActionObject(gid, key))
        }
    }
}

const ControlPanelMain = (props) => {
    return (
        <React.Fragment>
            <DevicePanelMenu/>
            <ShowMainArea id={props.id} device={props.device}/>
        </React.Fragment>
    )
}

class DevicePanelMenu extends React.Component {
    changeMenu(key) {
        CommonAction.changeCommonStatus(key, Key.changeControlPanelMenu)
    }

    componentWillUnmount() {
        this.changeMenu(0)
    }

    render() {
        const inner = [
            ['#iconpanel_ico_info_nor', '#iconpanel_ico_info_selected', 'SYSTEM_INFO'],
            ['#iconpanel_ico_property_nor', '#iconpanel_ico_property_selected', 'SYSTEM_PERFORMANCE'],
            ['#iconpanel_ico_manage_nor', '#iconpanel_ico_manage_selected', 'DISK_MANAGE'],
            ['#iconpanel_ico_configuration_nor', '#iconpanel_ico_configuration_selected', 'NET_CONFIG'],
        ]
        const {device: {changeControlPanelMenu: {current}}} = store.getState();

        const info = inner.map((val, key) => {
            const [normal, hover, title] = val;
            const [xLink, border, pStyle] = (key === current) ?
                [hover, {borderRight: "3px #006DFF solid"}, {color: "#006DFF"}] : [normal];
            return (
                <li key={key} style={border} onClick={this.changeMenu.bind(this, key)}>
                    <svg className="icon svg-icon" aria-hidden="true">
                        <use xlinkHref={xLink}></use>
                    </svg>
                    <p style={pStyle}>{intl.get(title)}</p>
                </li>
            )
        })
        return (
            <div className={"device-panel-menu"}>
                <ul>
                    {info}
                </ul>
            </div>
        )
    }
}

// 系统信息的主面板
class SystemInfoMain extends Component {
    state = {
        socket: [],
        http: [],
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getSocketDeviceInfo();
        this.getHttpDeviceInfo();
    }

    getHttpDeviceInfo = () => {
        const {uid, token} = cookie.loadAll();
        Func.axiosPost("/pool/device/get", {user_id: uid, token: token, device_id: this.props.id}, this.syncCallBack)
    }

    syncCallBack = (data) => {
        const {code, data: info, description} = data.data;
        if (code === 0) {
            const {name, ip} = info;
            this.state.http = [name, ip, "计算"]
            this.setState(this.state)
        } else {
            message.error(description);
        }
    }

    getSocketDeviceInfo = () => {
        console.log(`{"from":"html","act":"get_system_showinfo","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
        window.ws.send(`{"from":"html","act":"get_system_showinfo","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {socket: {globalSocketBack: {current}}} = nextProps.value;
        const {act} = JSON.parse(current);
        if (act === "get_system_showinfo") {
            const {version, CPU, memory, temperature} = JSON.parse(current)
            this.state.socket = [version, CPU, memory, `GPU 2080S`, temperature]
            this.setState(this.state);
        }
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        const [system, cpu, memory, gpu, temp] = this.state.socket
        const [name, ip, role] = this.state.http;
        return (
            <React.Fragment>
                <div className={"system-info-panel"}>
                    <p className={"bold"} style={{top: "43px"}}>{intl.get("VERSION")}</p>
                    <p style={{top: "82px"}}>{system}</p>
                    <p className={"bold"} style={{top: "150px"}}>{intl.get("SYSTEM")}</p>
                    <p style={{top: "189px"}}>{intl.get("PROCESSOR")}：{cpu}</p>
                    <p style={{top: "228px"}}>{intl.get("MEMORY")}：{memory}</p>
                    {/*<p style={{top: "267px"}}>{intl.get("GPU")}：{gpu}</p>*/}
                    <p style={{top: "267px"}}>{intl.get("TEMPERATURE")}：{temp}</p>
                    <p className={"bold"} style={{top: "373px"}}>{intl.get("CONFIGURATION")}</p>
                    <p style={{top: "412px"}}>{intl.get("DEVICE_NAME")}：{name}</p>
                    <p style={{top: "451px"}}>{intl.get("IP_ADDRESS")}：{ip}</p>
                    <p style={{top: "490px", display: "none"}}>{intl.get("DEVICE_ROLE")}：{role}</p>
                    <p style={{top: "412px", left: "195px", display: "none"}}
                       className={"oper"}>{intl.get("MODIFY")}</p>
                    <p style={{top: "412px", left: "241px", display: "none"}} className={"oper"}>{intl.get("RESET")}</p>
                    <p style={{top: "490px", left: "156px", display: "none"}}
                       className={"oper"}>{intl.get("MODIFY")}</p>
                </div>
            </React.Fragment>
        )
    }
}

const SystemInfoMainApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(SystemInfoMain)


class PerformanceMenu extends React.Component {
    changeMenu(key) {
        CommonAction.changeCommonStatus(key, Key.changePerformanceMenu)
    }

    render() {
        const menu = [intl.get("CPU"), intl.get("MEMORY"), intl.get("DISK"), intl.get("NETWORK")];
        const {device: {devicePerformanceMenu: {current}}} = store.getState();
        const info = menu.map((val, key) => {
            const style = (key === current) ? "on" : "";
            return <li onClick={this.changeMenu.bind(this, key)} className={style} key={key}>{val}</li>
        })
        return (
            <div className={"performance-table-menu"}>
                <ul>
                    {info}
                </ul>
            </div>
        )
    }
}

const chartOptions = {
    ///Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: true,
    //String - Colour of the grid lines
    scaleGridLineColor: "rgba(0,0,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth: 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: false,
    //Boolean - Whether the line is curved between points
    bezierCurve: true,
    //Number - Tension of the bezier curve between points
    bezierCurveTension: 0.4,
    //Boolean - Whether to show a dot for each point
    pointDot: false,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth: 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius: 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke: true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth: 2,
    //Boolean - Whether to fill the dataset with a colour
    datasetFill: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",
    //Boolean - Whether to horizontally center the label and point dot inside the grid
    offsetGridLines: false
};

const pieOption = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke: true,
    //String - The colour of each segment stroke
    segmentStrokeColor: "#fff",
    //Number - The width of each segment stroke
    segmentStrokeWidth: 2,
    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    //Number - Amount of animation steps
    animationSteps: 100,
    //String - Animation easing effect
    animationEasing: "easeOutBounce",
    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,
    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>"
};

class CPUPerformPanel extends Component {
    state = {
        socket: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2],
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getSocketDeviceInfo();
        this.time = setInterval(() => {
            this.getSocketDeviceInfo()
        }, 3000)
    }

    getSocketDeviceInfo = () => {
        console.log(`{"from":"html","act":"get_system_info","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
        window.ws.send(`{"from":"html","act":"get_system_info","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {socket: {globalSocketBack: {current}}} = nextProps.value;
        const {act} = JSON.parse(current);
        if (act === "get_system_info") {
            let {CPU: cpu} = JSON.parse(current)
            // cpu = Math.floor(cpu)
            this.state.socket.push(cpu)
            this.state.socket.shift();
            this.setState(this.state)
        }
    }

    componentWillUnmount() {
        clearInterval(this.time)
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        const chartData = {
            labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            datasets: [
                {
                    label: intl.get("CPU_USE_RATE"),
                    fillColor: "rgba(64,129,216,0.2)",
                    strokeColor: "rgba(64,129,216,0.6)",
                    pointColor: "rgba(64,129,216,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.state.socket
                }
            ]
        };

        return (
            <LineChart data={chartData} options={chartOptions} width="458" height="413" style={{marginTop: "30px"}}/>
        );
    }
}


const CPUPerformPanelApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(CPUPerformPanel)


class MemoryPerformPanel extends Component {
    state = {
        socket: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.24],
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getSocketDeviceInfo();
        this.time = setInterval(() => {
            this.getSocketDeviceInfo()
        }, 3000)
    }

    getSocketDeviceInfo = () => {
        console.log(`{"from":"html","act":"get_system_info","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
        window.ws.send(`{"from":"html","act":"get_system_info","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {socket: {globalSocketBack: {current}}} = nextProps.value;
        const {act} = JSON.parse(current);
        if (act === "get_system_info") {
            let {memory} = JSON.parse(current)
            this.state.socket.push(memory)
            this.state.socket.shift();
            this.setState(this.state)
        }
    }

    componentWillUnmount() {
        clearInterval(this.time)
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        const chartData = {
            labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            datasets: [
                {
                    label: intl.get("MEMORY_USE_RATE"),
                    fillColor: "rgba(0,216,160,0.2)",
                    strokeColor: "rgba(0,216,160,0.6)",
                    pointColor: "rgba(0,216,160,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.state.socket
                }
            ]
        };

        return (
            <LineChart data={chartData} options={chartOptions} width="458" height="413" style={{marginTop: "30px"}}/>
        );
    }
}

const MemoryPerformPanelApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(MemoryPerformPanel)


class DiskPerformPanel extends Component {
    state = {
        total: 100,
        used: 0,
        left: 100,
        show: 0
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getSocketDeviceInfo();
    }

    getSocketDeviceInfo = () => {
        console.log(`{"from":"html","act":"get_disk_info","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
        window.ws.send(`{"from":"html","act":"get_disk_info","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {socket: {globalSocketBack: {current}}} = nextProps.value;
        const {act, from} = JSON.parse(current);

        if (act === "get_disk_info" && from === "device") {
            const {disk_space_used: used, disk_space_all: all} = JSON.parse(current);
            this.state.total = all;
            this.state.used = used;
            this.state.left = (all - used);
            this.state.show = 1;
            this.setState(this.state)
        }
    }

    componentWillUnmount() {
        clearInterval(this.time)
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        const pieData = [
            {
                value: this.state.left,
                color: "rgba(64,129,216,0.6)",
                highlight: "rgba(64,129,216,1)",
                label: intl.get("LEFT_SPACE")
            },
            {
                value: this.state.used,
                color: "rgba(0,216,160,0.6)",
                highlight: "rgba(0,216,160,1)",
                label: intl.get("USED_SPACE")
            },
        ];

        return (
            <React.Fragment>
                {this.state.show === 1 ?
                    <React.Fragment>
                        <p style={{
                            position: "absolute",
                            left: "340px",
                            top: "100px",
                            color: "#394565"
                        }}>{intl.get("TOTAL_SPACE")}：{this.state.total}</p>
                        <p style={{
                            position: "absolute",
                            left: "340px",
                            top: "150px",
                            color: "#394565"
                        }}>{intl.get("USED_SPACE")}：{this.state.used}</p>
                        <p style={{
                            position: "absolute",
                            left: "340px",
                            top: "200px",
                            color: "#394565"
                        }}>{intl.get("LEFT_SPACE")}：{this.state.left}</p>
                        <div style={{left: "100px", top: "187px", backgroundColor: "rgba(64,129,216,0.6)"}}
                             className={"icon-tips"}></div>
                        <div style={{left: "100px", top: "217px", backgroundColor: "rgba(0,216,160,0.6)"}}
                             className={"icon-tips"}></div>
                        <p style={{
                            position: "absolute",
                            left: "122px",
                            top: "182px",
                            color: "#394565"
                        }}>{intl.get("NOW_LEFT")}：{((this.state.left / this.state.total) * 100).toFixed(2)} %</p>
                        <p style={{
                            position: "absolute",
                            left: "122px",
                            top: "212px",
                            color: "#394565"
                        }}>{intl.get("ALREADY_USED")}：{((this.state.used / this.state.total) * 100).toFixed(2)} %</p>

                    </React.Fragment> : <React.Fragment></React.Fragment>
                }
                <PieChart data={pieData} options={pieOption} width="308" height="313" style={{marginTop: "50px"}}/>
            </React.Fragment>
        )
    }
}

const DiskPerformPanelApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(DiskPerformPanel)

class NetSpeedPerformPanel extends Component {
    state = {
        up: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3],
        down: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.7],
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getSocketDeviceInfo();
        this.time = setInterval(() => {
            this.getSocketDeviceInfo()
        }, 3000)
    }

    getSocketDeviceInfo = () => {
        console.log(`{"from":"html","act":"get_system_info","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
        window.ws.send(`{"from":"html","act":"get_system_info","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {socket: {globalSocketBack: {current}}} = nextProps.value;
        const {act} = JSON.parse(current);
        if (act === "get_system_info") {
            const {net_speed: speed} = JSON.parse(current);
            for (const val of speed) {
                const {down_speed: down, net_type: type, up_speed: up} = val;
                if (type === "manage") {
                    this.state.up.push(up);
                    this.state.down.push(down);
                    this.state.up.shift();
                    this.state.down.shift();
                    this.setState(this.state)
                }
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.time)
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        const chartData = {
            labels: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            datasets: [
                {
                    label: intl.get("NEW_DOWN_SPEED"),
                    fillColor: "rgba(64,129,216,0.2)",
                    strokeColor: "rgba(64,129,216,0.6)",
                    pointColor: "rgba(64,129,216,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.state.down
                },
                {
                    label: intl.get("NEW_UP_SPEED"),
                    fillColor: "rgba(0,216,160,0.2)",
                    strokeColor: "rgba(0,216,160,0.6)",
                    pointColor: "rgba(0,216,160,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: this.state.up
                }
            ]
        };
        return (
            <LineChart data={chartData} options={chartOptions} width="488" height="413"/>
        );
    }
}

const NetSpeedPerformPanelApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(NetSpeedPerformPanel)


class PerformanceIndex extends React.Component {
    render() {
        const {device: {devicePerformanceMenu: {current}}} = store.getState();
        return (
            <div className={"performance-main"}>
                {current === 0 ?
                    <CPUPerformPanelApp id={this.props.id} device={this.props.device}/> :
                    <React.Fragment></React.Fragment>
                }
                {current === 1 ?
                    <MemoryPerformPanelApp id={this.props.id} device={this.props.device}/> :
                    <React.Fragment></React.Fragment>
                }
                {current === 2 ?
                    <DiskPerformPanelApp id={this.props.id} device={this.props.device}/> :
                    <React.Fragment></React.Fragment>
                }
                {current === 3 ?
                    <NetSpeedPerformPanelApp id={this.props.id} device={this.props.device}/> :
                    <React.Fragment></React.Fragment>
                }
            </div>
        );
    }
}

// 系统性能主模块
const SystemPerformanceMain = (props) => {
    return (
        <React.Fragment>
            <div className={"system-info-panel"}>
                <PerformanceMenu/>
                <PerformanceIndex id={props.id} device={props.device}/>
            </div>
        </React.Fragment>
    )
}


class OperateDisk extends Component {
    state = {
        current: 1,
        tip: ""
    }

    onRef = (ref) => {
        this.child = ref;
    }

    formatDisk = (id) => {
        this.state.tip = intl.get("YOUR_SURE_FORMAT_DISK");
        this.state.current = 1;
        this.setState(this.state);
        this.child.showModal()
    }

    deleteDisk = (id) => {
        this.state.tip = intl.get("YOUR_SURE_DELETE_DISK")
        this.state.current = 2;
        this.setState(this.state);
        this.child.showModal()
    }

    onSubmit = () => {
        console.log(1111111111, this.state, 3333333333);
    }

    render() {
        return (
            <React.Fragment>
                <svg className="icon svg-icon oper-icon coin2" aria-hidden="true"
                     onClick={this.formatDisk.bind(this, this.props.id)} style={{marginRight: "5px"}}>
                    <use xlinkHref="#icondiskmanage_icon_formatting_nor"></use>
                </svg>
                <svg className="icon svg-icon oper-icon coin2" aria-hidden="true"
                     onClick={this.deleteDisk.bind(this, this.props.id)}>
                    <use xlinkHref="#icondiskmanage_icon_del_nor"></use>
                </svg>
                <MyModal
                    class={"common-modal"}
                    title={intl.get('MENTION')}
                    onRef={this.onRef}
                    onSubmit={this.onSubmit}
                    inner={<h6>{this.state.tip}</h6>}
                    okText={intl.get('CONFIRM')}
                    cancelText={intl.get('CANCEL')}
                    icon={<svg className="icon svg-icon modal-icon" aria-hidden="true">
                        <use xlinkHref="#iconpop_icon_warning"></use>
                    </svg>}
                >
                </MyModal>
            </React.Fragment>
        )
    }
}


class DiskManageModel extends Component {
    state = {
        total: 100,
        used: 0,
        left: 100,
        list: [],
        count: 0,
        show: 0
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getSocketDeviceInfo();
    }

    getSocketDeviceInfo = () => {
        console.log(`{"from":"html","act":"get_disk_info","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
        window.ws.send(`{"from":"html","act":"get_disk_info","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {socket: {globalSocketBack: {current}}} = nextProps.value;
        const {act} = JSON.parse(current);
        if (act === "get_disk_info") {
            const {disk_space_used: used, disk_space_all: all, disk_list: list} = JSON.parse(current);
            this.state.count = list.length;
            this.makeDiskList(list)
            this.state.total = all;
            this.state.used = used;
            this.state.show = 1;
            this.state.left = (all - used);
            this.setState(this.state)
        }
    }

    makeDiskList = (list) => {
        this.state.list = [];
        for (const val of list) {
            const {bus_serial: serial, disk_name: name, disk_serial_number: number, disk_space_all: all, disk_space_used: used, disk_status: status} = val;
            this.state.list.push({
                order: Func.get_disknum(serial),
                mode: name,
                number: number,
                size: Func.powerUnitChange(all),
                used: Func.powerUnitChange(used),
                key: 1,
                // operate: <OperateDisk id={name}/>,
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.time)
        this.setState = (state, callback) => {
            return
        }
    }


    render() {
        const columns = [
            {
                title: intl.get("DISK_ORDER"),
                dataIndex: 'order',
                key: 'order',
            },
            {
                title: intl.get("DISK_MODE"),
                dataIndex: 'mode',
                key: 'mode',
            },
            {
                title: intl.get("DISK_SERIAL_NUMBER"),
                dataIndex: 'number',
                key: 'number',
            },
            {
                title: intl.get("DISK_SIZE"),
                dataIndex: 'size',
                key: 'size',
            },
            {
                title: intl.get("DISK_USED"),
                dataIndex: 'used',
                key: 'used',
            },
            // {
            //     title: intl.get("DISK_OPERATE"),
            //     dataIndex: 'operate',
            //     key: 'operate',
            // },
        ];
        const dataSource = this.state.list;
        const pieData = [
            {
                value: this.state.left,
                color: "rgba(64,129,216,0.6)",
                highlight: "rgba(64,129,216,1)",
                label: intl.get("LEFT_SPACE")
            },
            {
                value: this.state.used,
                color: "rgba(0,216,160,0.6)",
                highlight: "rgba(0,216,160,1)",
                label: intl.get("USED_SPACE")
            },
        ];

        return (
            <React.Fragment>
                <div className={"disk-manage-area"}>
                    <Scrollbar.PoolList style={{width: "100%", height: "515px", left: 0, top: 0}}>
                        <div className={"table-top"}>
                            <p style={{top: "10px", left: "10px"}}>{intl.get("MY_DISK")}（{this.state.count}）</p>
                            {this.state.show === 1 ?
                                <React.Fragment>
                                    <p style={{
                                        color: "#999",
                                        top: "120px"
                                    }}>{intl.get("TOTAL_SPACE")}（{this.state.total}）</p>
                                    <p style={{
                                        color: "#999",
                                        top: "150px"
                                    }}>{intl.get("USED_SPACE")}（{this.state.used}）</p>
                                    <p style={{
                                        color: "#999",
                                        top: "180px"
                                    }}>{intl.get("LEFT_SPACE")}（{this.state.left}）</p>
                                    <div style={{left: "60px", top: "57px", backgroundColor: "rgba(64,129,216,0.6)"}}
                                         className={"icon-tips"}></div>
                                    <div style={{left: "60px", top: "87px", backgroundColor: "rgba(0,216,160,0.6)"}}
                                         className={"icon-tips"}></div>
                                    <p style={{
                                        position: "absolute",
                                        left: "82px",
                                        top: "52px",
                                        color: "#394565"
                                    }}>{intl.get("NOW_LEFT")}：{((this.state.left / this.state.total) * 100).toFixed(2)} %</p>
                                    <p style={{
                                        position: "absolute",
                                        left: "82px",
                                        top: "82px",
                                        color: "#394565"
                                    }}>{intl.get("ALREADY_USED")}：{((this.state.used / this.state.total) * 100).toFixed(2)} %</p>
                                </React.Fragment> : <React.Fragment></React.Fragment>

                            }
                            <PieChart data={pieData} options={pieOption} width="200" height="200"
                                      style={{marginTop: "20px", marginLeft: "270px"}}/>
                        </div>
                        <div className={"disk-table"}>
                            <Table bordered pagination={false} dataSource={dataSource} columns={columns}/>
                        </div>
                    </Scrollbar.PoolList>
                </div>
            </React.Fragment>
        )
    }
}

const DiskManageModelApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(DiskManageModel)

class HardwareArea extends Component {
    componentDidMount() {
        this.props.onRef(this)
    }

    render() {
        const {mac} = this.props.val;
        return (
            <div className={"info"}>
                <h6>{intl.get("HARDWARE")}:</h6>
                <div className={"list"}>
                    <div className={"left"}>
                        {intl.get("MAC_ADDRESS")}:
                    </div>
                    <div className={"right"}>
                        {mac}
                    </div>
                </div>
            </div>
        )
    }
}

class NetSetModal extends Component {
    componentDidMount() {
        this.props.onRef(this)
    }

    changeSelect = (name, value) => {
        this.state[name] = value;
    }

    getNetState = () => {
        return this.state;
    }

    render() {
        return (
            <div className={"info"}>
                <h6>{intl.get("TCP_IP")}:</h6>
                <div className={"list"}>
                    <div className={"left"}>
                        {intl.get("CONFIG_IPV4")}:
                    </div>
                    <div className={"right"}>
                        <Select disabled onChange={this.changeSelect.bind(this, "ipv4_set")} className={"net-panel"}
                                defaultValue={this.props.val.ipv4_set} style={{width: 280}}>
                            <Option value="dhcp">{intl.get("USE_DHCP")}</Option>
                            <Option value="static">{intl.get("USE_STATIC")}</Option>
                        </Select>
                    </div>
                </div>
                <div className={"list"}>
                    <div className={"left"}>
                        {intl.get("IPV4_ADDRESS")}:
                    </div>
                    <div className={"right"}>
                        {this.props.val.ipv4}
                    </div>
                </div>
                <div className={"list"}>
                    <div className={"left"}>
                        {intl.get("NETMASK_ADDRESS")}:
                    </div>
                    <div className={"right"}>
                        {this.props.val.mask}
                    </div>
                </div>
                <div className={"list"}>
                    <div className={"left"}>
                        {intl.get("ROUTER_IP")}:
                    </div>
                    <div className={"right"}>
                        {this.props.val.router}
                    </div>
                </div>
                <div className={"list"}>
                    <div className={"left"}>
                        {intl.get("CONFIG_IPV6")}:
                    </div>
                    <div className={"right"}>
                        <Select disabled onChange={this.changeSelect.bind(this, "ipv6_set")} className={"net-panel"}
                                defaultValue={this.props.val.ipv6_set} style={{width: 280}}>
                            <Option value="auto">{intl.get("AUTO_SET")}</Option>
                        </Select>
                    </div>
                </div>
                <div className={"list"}>
                    <div className={"left"}>
                        {intl.get("ROUTER_IP")}:
                    </div>
                    <div className={"right"}>
                        {this.props.val.router2}
                    </div>
                </div>
                <div className={"list"}>
                    <div className={"left"}>
                        {intl.get("BUSINESS_TYPE")}:
                    </div>
                    <div className={"right"}>
                        <Select disabled onChange={this.changeSelect.bind(this, "business")} className={"net-panel"}
                                defaultValue={this.props.val.business} style={{width: 280}}>
                            <Option value="business">{intl.get("BUSINESS_CARD")}</Option>
                            <Option value="manage">{intl.get("MANAGE_CARD")}</Option>
                        </Select>
                    </div>
                </div>
            </div>
        )
    }
}

class DNSModel extends Component {
    state = {
        dns: this.props.val.dns
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.state.dns = nextProps.val.dns;
    }

    dnsOperate = (oper) => {
        (oper === "del") && this.state.dns.pop();
        (oper === "add") && this.state.dns.push("")
        this.setState(this.state)
    }

    onChange = (key, e) => {
        this.state.dns[key] = e.target.value;
    }

    dnsState = () => {
        return this.state.dns
    }

    render() {
        const info = this.state.dns.map((val, key) => {
            return (
                <div className={"list"} key={key}>
                    <div className={"left"}>
                        {(key === 0) ? `${intl.get("DNS_SERVER")}:` : <React.Fragment></React.Fragment>}
                    </div>
                    <div className={"right"}>
                        <Input onChange={this.onChange.bind(this, key)} defaultValue={val} style={{height: 36}}/>
                    </div>
                </div>
            )
        })
        return (
            <div className={"info"}>
                <h6>{intl.get("DNS_CONFIG")}:</h6>
                {info}
                <div className={"list"} style={{display: "none"}}>
                    <div className={"left"}></div>
                    <div className={"right"} style={{lineHeight: "30px"}}>
                        <svg onClick={this.dnsOperate.bind(this, "add")} className="icon svg-icon" aria-hidden="true"
                             style={{width: "16px", height: "16px", marginRight: "10px"}}>
                            <use xlinkHref={"#iconpop_icon_add"}></use>
                        </svg>
                        <svg onClick={this.dnsOperate.bind(this, "del")} className="icon svg-icon" aria-hidden="true"
                             style={{width: "16px", height: "16px", marginRight: "10px"}}>
                            <use xlinkHref={"#iconpop_icon_remove"}></use>
                        </svg>
                        {intl.get("IPV4_OR_IPV6_ADDRESS")}
                    </div>
                </div>
            </div>
        )
    }
}

class NetSetArea extends Component {
    state = {
        type: "manage",
        mac: "",
        ipv4_set: "dhcp",
        ipv4: "",
        mask: "",
        router: "",
        ipv6_set: "auto",
        router2: "",
        business: "manage",
        dns: [],
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getSocketDeviceInfo();
    }

    getSocketDeviceInfo = () => {
        console.log(`{"from":"html","act":"get_net_baseinfo","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
        window.ws.send(`{"from":"html","act":"get_net_baseinfo","act_code":"ccccc","hardware_id":"${this.props.device}"}`)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {socket: {globalSocketBack: {current}}} = nextProps.value;
        const {act} = JSON.parse(current);
        if (act === "get_net_baseinfo") {
            const {net_work: list} = JSON.parse(current);
            for (const val of list) {
                const {net_type: type, net_name: name, proto, ip, gateway, dns, netmask, mac_addr: mac} = val;
                if (type === this.state.type) {
                    this.state.mac = mac;
                    this.state.ipv4_set = proto;
                    this.state.ipv4 = ip;
                    this.state.mask = netmask;
                    this.state.router = gateway;
                    this.state.mac = mac;
                    this.state.business = type;
                    this.state.dns = dns.split(",");
                    this.forceUpdate()
                }
            }
        }
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    onHard = (ref) => {
        this.hard = ref;
    }
    onNet = (ref) => {
        this.net = ref;
    }
    onDns = (ref) => {
        this.dns = ref;
    }
    changeNetSet = () => {
        console.log(this.dns.dnsState());
        console.log(this.net.getNetState());
    }

    render() {
        return (
            <div className={"device-net-set"}>
                <Scrollbar.PoolList style={{width: "100%", height: "515px", left: 0, top: 0}}>
                    <HardwareArea onRef={this.onHard} val={this.state}/>
                    <NetSetModal onRef={this.onNet} val={this.state}/>
                    <DNSModel onRef={this.onDns} val={this.state}/>
                    <div className={"submit"} style={{display: "none"}}>
                        <Button style={{left: "126px"}}>{intl.get("CANCEL")}</Button>
                        <Button onClick={this.changeNetSet.bind(this)} style={{left: "290px"}}
                                type="primary">{intl.get("CONFIRM")}</Button>
                    </div>
                </Scrollbar.PoolList>
            </div>
        )
    }
}

const NetSetAreaApp = connect(
    commonStateToProps,
    commonDispatchToProps
)(NetSetArea)

const ShowMainArea = (props) => {
    const {device: {changeControlPanelMenu: {current}}} = store.getState();
    return (
        <div className={"device-operate-area"}>
            {current === 0 ?
                <SystemInfoMainApp id={props.id} device={props.device}/> : <React.Fragment></React.Fragment>
            }
            {current === 1 ?
                <SystemPerformanceMain id={props.id} device={props.device}/> : <React.Fragment></React.Fragment>
            }
            {current === 2 ?
                <DiskManageModelApp id={props.id} device={props.device}/> : <React.Fragment></React.Fragment>
            }
            {current === 3 ?
                <NetSetAreaApp id={props.id} device={props.device}/> : <React.Fragment></React.Fragment>
            }
        </div>
    )
}

export default class Index extends Component {
    state = {
        id: "",
        device: ""
    }

    constructor(props) {
        super(props);
        store.subscribe(this.storeChange.bind(this));
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    onRef = (ref) => {
        this.child = ref
    }

    showModal = (e) => {
        this.child.showModal()
    }

    storeChange() {
        const {device: {currentOperateDevice: {current}}} = store.getState();
        const {device: {currentOperateHardware: {current: device}}} = store.getState();
        this.state.id = current;
        this.state.device = device;
        this.setState(this.state);
        current !== "" && device !== "" && this.showModal()
    }

    onClose() {
        CommonAction.changeCommonStatus("", Key.currentOperateDevice);
        CommonAction.changeCommonStatus("", Key.currentOperateHardware);
    }

    render() {
        return (
            <MyModal
                class={"device-panel"}
                title={intl.get('CONTROL_PANEL')}
                onRef={this.onRef}
                onSubmit={this.onSubmit}
                okText={intl.get('CONFIRM')}
                cancelText={intl.get('CANCEL')}
                onCancel={this.onClose}
                inner={<ControlPanelMain id={this.state.id} device={this.state.device}/>}
            >
            </MyModal>
        )
    }
}

