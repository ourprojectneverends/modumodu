/* global kakao */
import React, { useState, useEffect } from "react";
import axios from 'axios';

// css
import "./Toast.css";
import "./Meeting.css";

// components
import { ToastNotification } from "./ToastNotification.js";

function JoinMeetingPage(props) {
    let [certified, setCertified] = useState(false);
    let [userInputScreen, setUserInputScreen] = useState(0);
    let [toastState, setToastState] = useState(false);
    let [toastAnimation, setToastAnimation] = useState("toast-alert");
    let [meetingId, setMeetingId] = useState("");
    let [meetingName, setMeetingName] = useState("");
    let [numberOfPeopleState, setNumberOfPeopleState] = useState("");
    let [inputData, setInputData] = useState({
        userName: "",
        userLat: "",
        userLng: ""
    });

    useEffect(() => {
        getMyGps();
    }, [])

    useEffect(() => {
        if (userInputScreen === 1) {
            mapDrawer();
        }
    }, [userInputScreen])

    function getMyGps() {
        // getMyGps : gps로 사용자의 현재 위치 받아오는 함수 (처음 한번 실행)
        let newLatLng = { ...inputData };

        function getLatLng(position) {
            newLatLng.userLat = position.coords.latitude;
            newLatLng.userLng = position.coords.longitude;
            setInputData(newLatLng);
        }

        function errorHandler(err) {
            newLatLng.userLat = 36.366701;
            newLatLng.userLng = 127.344307;
            setInputData(newLatLng);
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        let gpsOptions = {
            enableHighAccuracy: true,
            timeout: 5000
        };

        navigator.geolocation.getCurrentPosition(getLatLng, errorHandler, gpsOptions);
    }

    function mapDrawer() {
        // mapDrawer : 지도가 있는 창이 열렸을 때, 지도 div에 카카오맵 지도를 그려 주는 함수
        let geocoder = new kakao.maps.services.Geocoder();
        let mapContainer = document.getElementById('client-map');
        let curLocationP = document.getElementById('client-location');

        let initialPosition = new kakao.maps.LatLng(inputData.userLat, inputData.userLng);
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

        geocoder.coord2Address(inputData.userLng, inputData.userLat, printAddress);

        // [지도 클릭 Event] 해당 포인트로 마커를 옮김
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            let selectedLocation = mouseEvent.latLng;
            marker.setPosition(selectedLocation);

            geocoder.coord2Address(selectedLocation.getLng(), selectedLocation.getLat(), printAddress);
            changeLatLngData(selectedLocation.getLat(), selectedLocation.getLng(), inputData);
        });
    }

    function changeLatLngData(latInput, lngInput, inputData) {
        // changeLatLngData : 지도에서 위도, 경도가 처음 설정되거나 바뀔 때 호출해서 inputData를 업데이트해주는 함수
        let newInputData = { ...inputData };
        newInputData.userLat = latInput;
        newInputData.userLng = lngInput;
        setInputData(newInputData);
    }

    function onInputChange(target, inputData) {
        // onInputChange : 위도, 경도를 제외한 사용자 데이터가 변경될 때마다 감지하여 inputData를 업데이트해주는 함수
        let newValue = target.value;
        let newInputData = { ...inputData };

        if (target.id === "user-name") {
            newInputData.userName = newValue;
        }

        setInputData(newInputData);
    }

    function isVaildPassword(e) {
        // isVaildPassword : 모임에 참가하기 위해 비밀번호를 입력했을 때 처리해주는 함수
        e.preventDefault();     // 버튼이 눌렸을 때 뷰가 새로고침 되는 것을 방지

        // URL에서 id parameter를 읽기
        let currentURL = decodeURI(window.location.href);
        let parameters = new URLSearchParams(currentURL.split("?")[1]);
        let idValue = parameters.get("id");

        // 입력한 pwd값을 읽기
        let inputPassword = document.getElementById("passwordToJoin").value;

        let sendData = {
            "id": idValue,
            "pw": inputPassword
        }

        axios.post("/api/user/join_meet", sendData).then(response => {
            // console.log(response.data);
            if (response.data.success) {
                setMeetingId(idValue);
                setMeetingName(response.data.meetName);
                setNumberOfPeopleState(response.data.meetMemCount + " / " + response.data.meetMemLimit);
                setCertified(true);
            } else {
                alert("존재하지 않는 모임이거나, 입력한 비밀번호가 틀렸습니다.");
                window.location.reload();
            }
        }).catch((error) => {
            console.log(error.response);
        });
    }

    function checkInputValues() {
        // checkInputValues : 입력하지 않은 input값이 있으면 해당 칸으로 이동시켜주고 toast알림을 통해 입력하지 않은 칸이 있다고 알리는 함수
        if (inputData.userName === "") {
            setUserInputScreen(0);
            setToastState(true);
            setToastAnimation("toast-alert openAnimation")
            return false;
        }

        return true;
    }

    function sendJoinData(e) {
        // sendJoinData : 모임에 참여하려는 유저가 입력한 데이터를 post로 서버에 전송하는 함수
        e.preventDefault();     //submit 버튼이 눌렸을 때 뷰가 새로고침 되는 것을 방지

        if (!checkInputValues()) {
            // 먼저 input값을 체크해본다
            return;
        }

        if (window.confirm("모임에 참여하시겠습니까?")) {
            let userData = {
                "meet_id": meetingId,
                "user": {
                    "name": inputData.userName,
                    "pos": {
                        "lat": inputData.userLat,
                        "long": inputData.userLng
                    }
                }
            }

            axios.post('/api/user/add_user', userData).then(response => {
                // console.log(response.data);
                if (response.data.success) {
                    alert("모임에 정상적으로 참여했습니다!");
                    window.location.href = "/meeting_info?id=" + meetingId;
                } else {
                    alert("모임 참여에 실패했습니다. 새로고침 후 다시 시도해 주세요.");
                }
            }).catch((error) => {
                console.log(error.response);
            });
        }
    }

    return (
        <div>
            {
                toastState === true ? (
                    <ToastNotification setToastState={setToastState} toastAnimation={toastAnimation} setToastAnimation={setToastAnimation} />
                ) : null
            }

            <p className="page-title">모임 참여하기</p>
            {certified === false ? (
                <div className="page-door">
                    <p>모임에 참여하기 위해서는 비밀번호가 필요합니다</p>
                    <input type="password" id="passwordToJoin" />
                    <br />
                    <button
                        onClick={(e) => {
                            isVaildPassword(e)
                        }}
                    >
                        참여하기
                    </button>
                </div>
            ) : (
                <form className="page-content" onSubmit={(e) => { sendJoinData(e) }}>
                    <div className="join-meeting-info">
                        <p>{meetingName}</p>
                        <p>현재 참여자 수 {numberOfPeopleState}</p>
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
                                    <input type="text"
                                        placeholder="닉네임"
                                        id="user-name" onChange={(e) => { onInputChange(e.target, inputData) }} value={inputData.userName} />
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
                                <p>출발 위치</p>
                                <div className="map-area">
                                    <div id="client-map" />
                                    <p id="client-location"></p>
                                </div>

                                <div className="user-input-buttons">
                                    <button
                                        className="prev-button"
                                        onClick={() => {
                                            setUserInputScreen(0);
                                        }}
                                    >이전</button>
                                    <button
                                        type="submit"
                                        className="submit-button"
                                    >모임 참여하기</button>
                                    <button className="none">x</button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </form>
            )}
        </div>
    );
}

export { JoinMeetingPage }