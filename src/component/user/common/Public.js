import React from "react";

// 登录大背景
const BackImage = (props) => {
    return (
        <div className={"backGroundImage"}>
            {props.children}
        </div>
    )
}
// 登录主区域
const MainArea = (props) => {
    return (
        <div className={"loginMainArea"}>
            <div className={"left"}>
                <div></div>
            </div>
            <div className={"right"}>
                {props.children}
            </div>
        </div>
    )
}
// 登录公用模块
export const BackGround = (props) => {
    return (
        <BackImage>
            <MainArea>
                {props.children}
            </MainArea>
        </BackImage>
    )
}

export const ErrorTip = (props) => {
    return(
        <p className={"error-tips"}>
            {props.inner}
        </p>
    )
}
