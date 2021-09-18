import React, { useState, useEffect } from "react";

// css
import "./Toast.css";

function ToastNotification(props) {
    useEffect(() => {
        props.setToastAnimation("toast-alert openAnimation");

        let timer2;
        let timer = setTimeout(() => {
            props.setToastAnimation("toast-alert closeAnimation");
            timer2 = setTimeout(() => {
                props.setToastState(false);
            }, 500);
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        }
    }, []);

    function toastClickEvent() {
        props.setToastState(false);
    }

    return (
        <div className={props.toastAnimation} onClick={() => { toastClickEvent() }}>
            <img alt="" src="img/alert.png" />
            <p>입력하지 않은 칸이 있습니다!</p>
        </div>
    );
}

export { ToastNotification }