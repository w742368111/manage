import React from "react";
import PropTypes from "prop-types";
import intl from "react-intl-universal";

import {Collapse} from 'antd';

const {Panel} = Collapse;

const TableTitle = (props) => {
    return (
        <React.Fragment>
            {props.icon}
            <h3>{props.title}</h3>
        </React.Fragment>
    )
}

const TableInto = (props) => {
    return (
        <React.Fragment>
            <h5>{props.name}</h5>
            <svg className="icon svg-icon svg-logo svg-inner" aria-hidden="true">
                <use xlinkHref="#iconicon_more_norsvg"></use>
            </svg>
        </React.Fragment>
    )
}

const TableBanner = (props) => {
    return (
        <React.Fragment>
            <div className={"table-banner"}>
                <TableTitle title={props.title} icon={props.icon}/>
                {props.name ?
                    <TableInto name={props.name}/> : <React.Fragment></React.Fragment>
                }
            </div>
        </React.Fragment>
    )
}

const TableBg = (props) => {
    const add = (props.class) ? `${props.class} common-table-bg` : 'common-table-bg';
    return (
        <div className={add} style={props.style}>
            <TableBanner name={props.name} title={props.title} icon={props.icon}/>
            {props.children}
        </div>
    );
}

// TableBg.propTypes = {
//     name: PropTypes.string,
//     title: PropTypes.string,
//     icon: PropTypes.object
// };

export const RowName = (props) => {
    if (props.show == 1) {
        const list = props.row.map(([name, width],index) =>
            <h6 key={index} style={{width: width}}>{name}</h6>
        )
        return (
            <div className={"table-row-name-area"}>
                {list}
            </div>
        )
    } else {
        return <React.Fragment></React.Fragment>
    }
}

RowName.propTypes = {
    row: PropTypes.array
};

export const CollapsePanel = (props) => {
    const single = props.text.map((value, key) => {
        const [title, content, status] = value;
        let collapseStyle = '';
        if (status == 0) {
            collapseStyle = "grey";
        }
        return (
            <Panel className={collapseStyle} header={title} key={key + 1}>
                <p>{content}</p>
            </Panel>
        )
    })
    const active = (props.active) ? [props.active] : [];
    return (
        <div className={"collapse-area"}>
            {props.text.length === 0?
                <div className={"empty-table"} style={props.emptyStyle}>
                    <p>{intl.get("EMPTY_TIPS")}</p>
                </div>:
                <Collapse accordion bordered={false} defaultActiveKey={active} onChange={props.onChange}>
                    {single}
                </Collapse>
            }
        </div>
    )
}

// Table中的具体内容的展示，如空则返回图片
export const TableInner = (props) => {
    let info;
    if (props.text.length > 0) {
        info = props.text.map((rows, key) => {
            const line = rows.map((info, index) => {
                if (index < rows.length - 1) {
                    const [inner, width] = props.row[index];
                    const textStyle = { width: [width], paddingRight: "40px"}
                    let pClass = "";
                    if (rows[rows.length - 1] == 0) {
                        textStyle['color'] = "#A7B1CA";
                        pClass = "special-color"
                    }
                    return <p className={pClass} key={index} style={textStyle}>{info}</p>
                }
            })
            return (
                <div key={key} className={"table-detail"}>
                    {line}
                </div>
            )
        })
    } else {
        info = <div className={"empty-table"} style={props.emptyStyle}>
            <p>{intl.get("EMPTY_TIPS")}</p>
        </div>
    }
    return (
        <React.Fragment>
            {info}
        </React.Fragment>
    )
}

export const TableCommon = (props) => {
    return (
        <TableBg style={props.style} name={props.name} icon={props.icon} title={props.title} class={props.class}>
            <RowName row={props.row} show={props.show}/>
            {(props.type == 'collapse') ?
                <CollapsePanel row={props.row} text={props.text}/> :
                <React.Fragment></React.Fragment>
            }
            {(props.type == 'table') ?
                <TableInner row={props.row} text={props.text} emptyStyle={props.emptyStyle}/> :
                <React.Fragment></React.Fragment>
            }
            {(props.type == 'other') ? <div className={"mix-common"}>{props.children}</div>
                : <React.Fragment></React.Fragment>
            }
            {props.more}
        </TableBg>
    )
}