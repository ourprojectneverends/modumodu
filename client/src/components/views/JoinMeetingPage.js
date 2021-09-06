import React, { useState } from "react";
import "./Meeting.css";
import { ClientMap } from "./ClientMap.js";


function JoinMeetingPage(props) {
    let [certified, setCertified] = useState(false);
    let [userInputScreen, setUserInputScreen] = useState(0);

    return (
        <div>
            <p className="page-title">모임 참여하기</p>
            {certified === false ? (
                <div className="page-door">
                    <p>모임에 참여하기 위해서는 비밀번호가 필요합니다</p>
                    <input type="password" />
                    <br />
                    <button
                        onClick={() => {
                            setCertified(true);
                        }}
                    >
                        참여하기
                    </button>
                </div>
            ) : (
                <div className="page-content">
                    <div className="join-meeting-info">
                        <p>{props.meetingData[0].name}</p>
                        <p>
                            현재 참여자 수 {props.meetingData[0].memberNum}/
                            {props.meetingData[0].memberLimit}
                        </p>
                    </div>

                    <div className="user-input-area">
                        <div
                            className={
                                userInputScreen === 0
                                    ? "user-input-title opened"
                                    : "user-input-title"
                            }
                            onClick={() => {
                                setUserInputScreen(0);
                            }}
                        >참여자 닉네임을 입력해 주세요</div>
                        {userInputScreen === 0 ? (
                            <div className="user-input-content">
                                <div>
                                    <p>닉네임</p>
                                    <input type="text" placeholder="sims" />
                                </div>
                                <div className="user-input-buttons">
                                <button className="none">x</button>
                                <button
                                    className="next-button"
                                    onClick={() => {
                                        setUserInputScreen(1);
                                    }}
                                >다음</button>
                            </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="user-input-area">
                        <div
                            className={
                                userInputScreen === 1
                                    ? "user-input-title opened"
                                    : "user-input-title"
                            }
                            onClick={() => {
                                setUserInputScreen(1);
                            }}
                        >출발할 위치를 선택해 주세요</div>
                        {userInputScreen === 1 ? (
                            <div className="user-input-content">
                                <ClientMap />

                                <div className="user-input-buttons">
                                <button
                                    className="prev-button"
                                    onClick={() => {
                                        setUserInputScreen(0);
                                    }}
                                >이전</button>
                                <button
                                    className="submit-button"
                                    onClick={() => {
                                        window.location.href = "/meeting_info";
                                    }}
                                >모임 참여하기</button>
                                <button className="none">x</button>
                            </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}

export { JoinMeetingPage }