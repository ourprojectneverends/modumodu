/* global kakao */
import React, { useState, useEffect } from "react";
import axios from 'axios';

// css
import "./Meeting.css";

// components
import { ToastNotification } from "./ToastNotification.js";

function OpenMeetingPage() {
    let [currentScreen, setCurrentScreen] = useState(0);
    let [toastState, setToastState] = useState(false);
    let [toastAnimation, setToastAnimation] = useState("toast-alert");
    let [inputData, setInputData] = useState({
        meetingName: "",
        meetingPwd: "",
        limitOfMeeting: "",
        userName: "",
        userLat: "",
        userLng: ""
    });

    useEffect(() => {
        if (currentScreen === 2) {
            mapDrawer();
        }
    }, [currentScreen])

    function getMyGps() {
        // getMyGps : gps로 사용자의 현재 위치 받아오는 함수, Promise를 리턴하는 방식

        let gpsOptions = {
            enableHighAccuracy: true,
            timeout: 5000
        };

        return new Promise((resolve, rejected) => {
            navigator.geolocation.getCurrentPosition(resolve, rejected);
        });
    }

    function setKakaoMapWithNewLatLng(newLatLng) {
        // setKakaoMapWithNewLatLng : newLatLng으로 새로운 위도/경도값이 들어오면 카카오맵을 설정해주는 함수

        let geocoder = new kakao.maps.services.Geocoder();
        let mapContainer = document.getElementById('host-map');
        let curLocationP = document.getElementById('host-location');

        let initialPosition = new kakao.maps.LatLng(newLatLng.userLat, newLatLng.userLng);
        let options = {
            // 지도 생성시 필요한 기본옵션 (중심좌표, 확대축소정도)
            center: initialPosition,
            level: 3
        };
        let map = new kakao.maps.Map(mapContainer, options);

        // 중심 좌표에 마커 만들기
        let marker = new kakao.maps.Marker({
            position: initialPosition
        });
        marker.setMap(map);

        let printAddress = function (result, status) {
            // 위도, 경도에 따라 지번 주소를 curLocationP에 출력해주는 콜백함수
            if (status === kakao.maps.services.Status.OK) {
                curLocationP.innerHTML = result[0].address.address_name;
            }
        };

        geocoder.coord2Address(newLatLng.userLng, newLatLng.userLat, printAddress);

        // [지도 클릭 Event] 해당 포인트로 마커를 옮김
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            let selectedLocation = mouseEvent.latLng;
            marker.setPosition(selectedLocation);

            geocoder.coord2Address(selectedLocation.getLng(), selectedLocation.getLat(), printAddress);
            changeLatLngData(selectedLocation.getLat(), selectedLocation.getLng(), inputData);
        });

        setInputData(newLatLng);
    }

    async function mapDrawer() {
        // mapDrawer : 지도가 있는 창이 열렸을 때, 지도 div에 카카오맵 지도를 그려 주는 함수
        let newLatLng = { ...inputData };

        try {
            let position = await getMyGps();

            newLatLng.userLat = position.coords.latitude;
            newLatLng.userLng = position.coords.longitude;

            setKakaoMapWithNewLatLng(newLatLng);
        } catch (err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);

            newLatLng.userLat = 36.366701;
            newLatLng.userLng = 127.344307;

            setKakaoMapWithNewLatLng(newLatLng);
        }
    }

    function changeLatLngData(latInput, lngInput, inputData) {
        // changeLatLngData : 지도에서 위도, 경도가 바뀔 때 호출해서 inputData를 업데이트해주는 함수
        let newInputData = { ...inputData };
        newInputData.userLat = latInput;
        newInputData.userLng = lngInput;
        setInputData(newInputData);
    }

    function onInputChange(target, inputData) {
        // onInputChange : 위도, 경도를 제외한 사용자 데이터가 변경될 때마다 감지하여 inputData를 업데이트해주는 함수
        let newValue = target.value;
        let newInputData = { ...inputData };

        if (target.id === "meeting-name") {
            newInputData.meetingName = newValue;
        } else if (target.id === "limit-of-meeting") {
            newInputData.limitOfMeeting = newValue;
        } else if (target.id === "user-name") {
            newInputData.userName = newValue;
        } else if (target.id === "meeting-pwd") {
            newInputData.meetingPwd = newValue;
        }

        setInputData(newInputData);
    }

    function checkInputValues() {
        // checkInputValues : 입력하지 않은 input값이 있으면 해당 칸으로 이동시켜주고 toast알림을 통해 입력하지 않은 칸이 있다고 알리는 함수
        if (inputData.meetingName === "" || inputData.limitOfMeeting === "") {
            setCurrentScreen(0);
            setToastState(true);
            setToastAnimation("toast-alert openAnimation")
            return false;
        } else if (inputData.userName === "") {
            setCurrentScreen(1);
            setToastState(true);
            setToastAnimation("toast-alert openAnimation")
            return false;
        } else if (inputData.meetingPwd === "") {
            setCurrentScreen(3);
            setToastState(true);
            setToastAnimation("toast-alert openAnimation")
            return false;
        }

        return true;
    }

    let onSubmitHandler = (e) => {
        // sendMaster : 입력한 데이터를 post로 서버에 전송하는 함수
        e.preventDefault();     //submit 버튼이 눌렸을 때 뷰가 새로고침 되는 것을 방지

        if (!checkInputValues()) {
            // 먼저 input값을 체크해본다
            return;
        }

        if (window.confirm("모임에 참여하시겠습니까?")) {
            let sendData = {
                "meet": {
                    "meet_name": inputData.meetingName,
                    "meet_pwd": inputData.meetingPwd,
                    "limit": inputData.limitOfMeeting
                },
                "user": {
                    "name": inputData.userName,
                    "pos": {
                        "lat": inputData.userLat,
                        "long": inputData.userLng
                    }
                }
            }

            axios.post('/api/user/add_master', sendData).then(response => {
                if (response.data.success) {
                    // console.log(response.data);
                    alert("모임이 정상적으로 생성되었습니다!");
                    window.location.href = "/meeting_info?id=" + response.data.created_meet_id;
                } else {
                    alert("모임 생성에 실패했습니다. 새로고침 후 다시 시도해 주세요.");
                }
            }).catch((error) => {
                console.log(error.response);
            });
        }
    };

    return (
        <div>
            {
                toastState === true ? (
                    <ToastNotification setToastState={setToastState} toastAnimation={toastAnimation} setToastAnimation={setToastAnimation} />
                ) : null
            }

            <p className="page-title">새 모임 만들기</p>
            <form className="page-content" onSubmit={onSubmitHandler}>
                <div className="user-input-area">
                    <div
                        className={
                            currentScreen === 0
                                ? "user-input-title opened"
                                : "user-input-title"
                        }
                        onClick={() => {
                            setCurrentScreen(0);
                        }}
                    >
                        만들 모임 이름과 모임의 최대 인원수를 선택해 주세요
                    </div>
                    {currentScreen === 0 ? (
                        <div className="user-input-content">
                            <div>
                                <p>모임 이름</p>
                                <input
                                    type="text"
                                    placeholder="모임 이름"
                                    id="meeting-name"
                                    onChange={(e) => { onInputChange(e.target, inputData) }}
                                    value={inputData.meetingName}
                                />
                            </div>
                            <div>
                                <p>인원수</p>
                                <p>
                                    최대 <input type="number" min="2" max="6" id="limit-of-meeting" onChange={(e) => { onInputChange(e.target, inputData) }} value={inputData.limitOfMeeting} />명까지
                                </p>
                                <p className="user_input_tips">* 모임 인원은 2~6명까지 선택 가능합니다.</p>
                            </div>

                            <div className="user-input-buttons">
                                <button className="none">x</button>
                                <button
                                    className="next-button"
                                    onClick={() => {
                                        setCurrentScreen(1);
                                    }}
                                >다음</button>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="user-input-area">
                    <div
                        className={
                            currentScreen === 1
                                ? "user-input-title opened"
                                : "user-input-title"
                        }
                        onClick={() => {
                            setCurrentScreen(1);
                        }}
                    >참여자 닉네임을 입력해 주세요</div>
                    {currentScreen === 1 ? (
                        <div className="user-input-content">
                            <div>
                                <p>닉네임</p>
                                <input
                                    type="text"
                                    placeholder="닉네임"
                                    id="user-name" onChange={(e) => { onInputChange(e.target, inputData) }} value={inputData.userName}
                                />
                            </div>

                            <div className="user-input-buttons">
                                <button
                                    className="prev-button"
                                    onClick={() => {
                                        setCurrentScreen(0);
                                    }}
                                >이전</button>
                                <button
                                    className="next-button"
                                    onClick={() => {
                                        setCurrentScreen(2);
                                    }}
                                >다음</button>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="user-input-area">
                    <div
                        className={
                            currentScreen === 2
                                ? "user-input-title opened"
                                : "user-input-title"
                        }
                        onClick={() => {
                            setCurrentScreen(2);
                        }}
                    >출발할 위치를 선택해 주세요</div>
                    {currentScreen === 2 ? (
                        <div className="user-input-content">
                            <div className="map-area">
                                <p>출발 위치</p>
                                <div id="host-map" />
                                <p id="host-location"></p>
                            </div>

                            <div className="user-input-buttons">
                                <button
                                    className="prev-button"
                                    onClick={() => {
                                        setCurrentScreen(1);
                                    }}
                                >이전</button>
                                <button
                                    className="next-button"
                                    onClick={() => {
                                        setCurrentScreen(3);
                                    }}
                                >다음</button>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="user-input-area">
                    <div
                        className={
                            currentScreen === 3
                                ? "user-input-title opened"
                                : "user-input-title"
                        }
                        onClick={() => {
                            setCurrentScreen(3);
                        }}
                    >
                        모임에 참여할 때 사용할 비밀번호를 설정해 주세요
                    </div>
                    {currentScreen === 3 ? (
                        <div className="user-input-content">
                            <div>
                                <p>비밀번호</p>
                                <input type="password" id="meeting-pwd" onChange={(e) => { onInputChange(e.target, inputData) }} value={inputData.meetingPwd} />
                                <p className="user_input_tips">* 모임에 참여할 때 사용되는 비밀번호로, 초대 시 공유되므로 사적인 비밀번호를 사용하지 마세요!</p>
                            </div>

                            <div className="user-input-buttons">
                                <button
                                    className="prev-button"
                                    onClick={() => {
                                        setCurrentScreen(2);
                                    }}
                                >이전</button>
                                <button
                                    type="submit"
                                    className="submit-button"
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