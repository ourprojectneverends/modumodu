import React, { useState } from "react";

// css
import "./Meeting.css";

// map component
import { HostMap } from "./HostMap.js";

function OpenMeetingPage(props) {
    let [userInputScreen, setUserInputScreen] = useState(0);

    const [newMeetingInputs, setNewMeetingInputs] = useState({
        meetingName: "",
        memberName: "",
        lat: "",
        lng: "",
        meetingLimit: "",
    });

    const { meetingName, memberName, lat, lng, meetingLimit } = newMeetingInputs;

    const onChange = (e) => {
        const { value, newMeetingInputs } = e.target;
        setNewMeetingInputs({
            ...newMeetingInputs,
            [meetingName]: value,
        });
    };

    const onReset = () => {
        setNewMeetingInputs({
            meetingName: "",
            memberName: "",
            lat: "",
            lng: "",
            meetingLimit: "",
        });
    };

    return (
        <div>
            <p className="page-title">새 모임 만들기</p>
            <div className="page-content">
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
                                    name="meetingName"
                                    placeholder="모임 이름"
                                    onChange={onChange}
                                    value={meetingName}
                                />
                            </div>

                            <div>
                                <p>인원수</p>
                                <p>
                                    최대 <input type="number" defaultValue="2" />명까지
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
                                    name="memberName"
                                    placeholder="닉네임"
                                    onChange={onChange}
                                    value={memberName}
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
                                    비밀번호 <input type="password" />
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
                                    className="submit-button"
                                    onClick={() => {
                                        window.location.href = "/meeting_info";
                                    }}
                                >새 모임 생성</button>
                                <button className="none">x</button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export { OpenMeetingPage }