import React, { useState } from "react";
import axios from 'axios';

// css
import "./Meeting.css";

// map component
import { HostMap } from "./HostMap.js";

function OpenMeetingPage(props) {
    let [userInputScreen, setUserInputScreen] = useState(0);
    let [inputData, setInputData] = useState({
        meetingName: "",
        meetingPwd: "",
        limitOfMeeting: "",
        userName: "",
        userLat: "",
        userLng: ""
    });

    // const onReset = () => {
    //     setNewMeetingInputs({
    //         meetingName: "",
    //         memberName: "",
    //         lat: "",
    //         lng: "",
    //         meetingLimit: "",
    //     });
    // };

    function onInputChange(target, inputData) {
        let newValue = target.value;
        let newInputData = { ...inputData };

        if (target.id === "meeting-name") {
            newInputData.meetingName = newValue;
        } else if (target.id === "limit-of-meeting") {
            newInputData.limitOfMeeting = newValue;
        } else if (target.id === "user-name") {
            newInputData.userName = newValue;
        } else if (target.id === "user-lat") {
            newInputData.userLat = newValue;
        } else if (target.id === "user-lng") {
            newInputData.userLng = newValue;
        } else if (target.id === "meeting-pwd") {
            newInputData.meetingPwd = newValue;
        }

        setInputData(newInputData);
    }

    let onSubmitHandler = (e) => {
        e.preventDefault();     //submit 버튼이 눌렸을 때 뷰가 새로고침 되는 것을 방지

        let body = {
            "meet": {
                "meet_name": inputData.meetingName,
                "meet_pwd": inputData.meetingPwd,
                "limit": inputData.limitOfMeeting
            },
            "user": {
                "name": inputData.userName,
                "latitude": inputData.userLat,
                "longitude": inputData.userLng
            }
        }

        axios.post('/api/user/add_master', body).then(response => {
            console.log(response.data);
            // console.log(body);
            window.location.href = "/meeting_info";
        });
    };

    return (
        <div>
            <p className="page-title">새 모임 만들기</p>

            <form className="page-content" onSubmit={onSubmitHandler}>
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
                    >
                        만들 모임 이름과 인원수를 선택해 주세요
                    </div>
                    {userInputScreen === 0 ? (
                        <div className="user-input-content">
                            <div>
                                <p>모임 이름</p>
                                <input
                                    type="text"
                                    placeholder="모임 이름"
                                    id="meeting-name"
                                    onChange={(e) => { onInputChange(e.target, inputData) }}
                                />
                            </div>

                            <div>
                                <p>인원수</p>
                                <p>
                                    최대 <input type="number" id="limit-of-meeting" onChange={(e) => { onInputChange(e.target, inputData) }} />명까지
                                </p>
                                <p>* 모임 인원은 2~6명까지 선택 가능합니다.</p>
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
                    >참여자 닉네임을 입력해 주세요</div>
                    {userInputScreen === 1 ? (
                        <div className="user-input-content">
                            <div>
                                <p>닉네임</p>
                                <input
                                    type="text"
                                    placeholder="닉네임"
                                    id="user-name" onChange={(e) => { onInputChange(e.target, inputData) }}
                                />
                            </div>

                            <div className="user-input-buttons">
                                <button
                                    className="prev-button"
                                    onClick={() => {
                                        setUserInputScreen(0);
                                    }}
                                >이전</button>
                                <button
                                    className="next-button"
                                    onClick={() => {
                                        setUserInputScreen(2);
                                    }}
                                >다음</button>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="user-input-area">
                    <div
                        className={
                            userInputScreen === 2
                                ? "user-input-title opened"
                                : "user-input-title"
                        }
                        onClick={() => {
                            setUserInputScreen(2);
                        }}
                    >출발할 위치를 선택해 주세요</div>
                    {userInputScreen === 2 ? (
                        <div className="user-input-content">
                            <HostMap />

                            <div className="user-input-buttons">
                                <button
                                    className="prev-button"
                                    onClick={() => {
                                        setUserInputScreen(1);
                                    }}
                                >이전</button>
                                <button
                                    className="next-button"
                                    onClick={() => {
                                        setUserInputScreen(3);
                                    }}
                                >다음</button>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="user-input-area">
                    <div
                        className={
                            userInputScreen === 3
                                ? "user-input-title opened"
                                : "user-input-title"
                        }
                        onClick={() => {
                            setUserInputScreen(3);
                        }}
                    >
                        모임에 참여할 때 사용할 비밀번호를 설정해 주세요
                    </div>
                    {userInputScreen === 3 ? (
                        <div className="user-input-content">
                            <div className="input-area-3">
                                <p>
                                    비밀번호 <input type="password" id="meeting-pwd" onChange={(e) => { onInputChange(e.target, inputData) }} />
                                </p>
                            </div>

                            <div className="user-input-buttons">
                                <button
                                    className="prev-button"
                                    onClick={() => {
                                        setUserInputScreen(2);
                                    }}
                                >이전</button>
                                <button
                                    type="submit"
                                    className="submit-button"
                                // onClick={() => {
                                //     window.location.href = "/meeting_info";
                                // }}
                                >새 모임 생성</button>
                                <button className="none">x</button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </form>
        </div>
    );
}

export { OpenMeetingPage }