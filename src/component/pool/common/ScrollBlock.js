import React from "react";
import intl from "react-intl-universal";
import * as Func from "../../../common/common"
import store from "../../../store";
import * as CommonAction from "../../../action/common"
import * as Key from "../../../store/config/config"

export const ScrollBlock = (props) => {
    const {pool:{poolIndexCurrentPid:{current}}} = store.getState();
    let info = props.data.map((val,key)=>{
        const style = {left:`${key*514}px`}
        const [url,name,income,power,size,rate,memory,grade,active] = val;
        const choose = (active == current)?"scroll-div active":"scroll-div"
        return (
            <div key={key} className={choose} style={style} onClick={CommonAction.changeCommonStatus.bind(this,active,Key.changePoolIndexPid)} >
                <div className={"icon_img"}><img src={url} /></div>
                <p className={"name"}>{name}</p>
                <p className={"tit1"}>{intl.get('TOTAL_INCOME')}：{income}</p>
                <p className={"tit2"}>{intl.get('CURRENT_POWER')}：{power}</p>
                <p className={"tit3"}>{intl.get('TOTAL_DISK_SIZE')}：{size}</p>
                <p className={"tit4"}>{intl.get('DAY_OFF_RATE')}：{rate}</p>
                <p className={"tit5"}>{intl.get('ALREADY_MEMORY')}：{memory}</p>
                {/*<p className={"tit6"}>{intl.get('POOL_GRADE')}：{grade}</p>*/}
            </div>
        )
    })
    return (
        <React.Fragment>
            {info}
        </React.Fragment>
    )
}

export class WalletBlock extends React.Component{
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {pool:{walletIndexPid:{current}}} = store.getState();
        nextProps.source.map((val,key)=>{
            const active = val[val.length -1];
            if(key === 0 && current === 0){
                current = active;
                CommonAction.changeCommonStatus(active,Key.changeWalletIndexPid)
            }
        })
    }

    render() {
        let {pool:{walletIndexPid:{current}}} = store.getState();

        let info = this.props.source.map((val,key)=>{
            const style = {left:`${key*545}px`}
            let [imgUrl,name,miner,poolWallet,income,poolBalance,myWallet,totalIncome,balance,active] = val;

            const choose = (active == current)?"scroll-div active":"scroll-div";
            const xHref = (active == current)?"#iconicon_copy_white":"#iconminer_icon_copy_white";
            return (
                <div key={key} className={choose} style={style} onClick={CommonAction.changeCommonStatus.bind(this,active,Key.changeWalletIndexPid)}>
                    <div className={"icon_img"}><img src={imgUrl} /></div>
                    <p className={"name"}>{name}</p>
                    <p className={"tit1"}>{intl.get('MINER')}：{miner}</p>
                    <p className={"tit2"}>{intl.get('POOL_WALLET')}：{poolWallet}</p>
                    <p className={"tit3"}>{intl.get('TOTAL_INCOME')}：{income}</p>
                    <p className={"tit4"}>{intl.get('POOL_BALANCE')}：{poolBalance}</p>
                    <p className={"tit5"}>{intl.get('MY_WALLET')}：{myWallet}</p>
                    <p className={"tit6"}>{intl.get('TOTAL_INCOME2')}：{totalIncome}</p>
                    <p className={"tit7"}>{intl.get('BALANCE')}：{balance}</p>
                    <svg className="icon svg-icon copy-icon icon1" aria-hidden="true" onClick={Func.success.bind(this,poolWallet)}>
                        <use xlinkHref={xHref}></use>
                    </svg>
                    <svg className="icon svg-icon copy-icon icon2" aria-hidden="true" onClick={Func.success.bind(this,myWallet)}>
                        <use xlinkHref={xHref}></use>
                    </svg>
                </div>
            )
        })
        return (
            <React.Fragment>
                {info}
            </React.Fragment>
        )
    }
}