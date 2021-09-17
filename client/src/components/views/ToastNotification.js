import React, { useState, useEffect } from "react";

// css
import "./Toast.css";

function ToastNotification(props) {
    useEffect(() => {
        let timer = setTimeout(() => {
            props.setToastState(false);
        }, 2000);

        return () => { clearTimeout(timer) }
    }, []);

    return (
        <div className="toast-alert">
            <img alt="" src="img/alert.png" />
            <p>입력하지 않은 칸이 있습니다!</p>
        </div>
    );
}

export { ToastNotification }