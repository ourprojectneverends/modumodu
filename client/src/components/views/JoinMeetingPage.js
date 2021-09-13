/* global kakao */
import React, { useState, useEffect } from "react";
import axios from 'axios';

// css
import "./Meeting.css";

function JoinMeetingPage(props) {
    let [certified, setCertified] = useState(false);
    let [userInputScreen, setUserInputScreen] = useState(0);
    let [inputData, setInputData] = useState({
        meetingName: "",
        meetingPwd: "",
        limitOfMeeting: "",
        userName: "",
        userLat: "",
        userLng: ""
    });

    useEffect(() => {
        if (userInputScreen == 1) {
            mapDrawer();
        }
    }, [userInputScreen])

    function mapDrawer() {
        let mapContainer = document.getElementById('client-map');
        let curLocationP = document.getElementById('client-location');

        // gps로 현재 위치 받아오는 부분 START
        let curLatitude = 33.450701;   // 현재 위도와 경도를 저장할 변수, 기본값은 카카오 본사
        let curLongtitude = 126.570667;

        function getLatLng(position) {
            // 위도와 경도 저장하기
            curLatitude = position.coords.latitude;
            curLongtitude = position.coords.longitude;
            console.log("내위치추적 완 " + curLatitude + "/" + curLongtitude);
        }

        function errorHandler(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        let gpsOptions = {
            enableHighAccuracy: true,
            timeout: 5000
        };

        navigator.geolocation.getCurrentPosition(getLatLng, errorHandler, gpsOptions);
        console.log("겟포지션 수행 완 " + curLatitude + "/" + curLongtitude);

        let initialPosition = new window.kakao.maps.LatLng(curLatitude, curLongtitude);
        console.log("초기위치 수행 완 " + curLatitude + "/" + curLongtitude);

        let options = { //지도를 생성할 때 필요한 기본 옵션
            center: initialPosition, //지도의 중심좌표.
            level: 3 //지도의 레벨(확대, 축소 정도)
        };

        // 중심 좌표에 마커 만들기
        let marker = new window.kakao.maps.Marker({
            position: initialPosition
        });

        let map = new window.kakao.maps.Map(mapContainer, options);
        marker.setMap(map);
        let message = '선택한 위치의 위도 : ' + curLatitude + ', 경도 : ' + curLongtitude;
        curLocationP.innerHTML = message;
        onLatLngChange(curLatitude, curLongtitude, inputData);

        // [지도 클릭 Event] 해당 포인트로 마커를 옮김
        window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            let selectedLocation = mouseEvent.latLng;
            marker.setPosition(selectedLocation);

            let newMessage = '선택한 위치의 위도 : ' + selectedLocation.getLat() + ', 경도 : ' + selectedLocation.getLng();
            curLocationP.innerHTML = newMessage;
            onLatLngChange(selectedLocation.getLat(), selectedLocation.getLng(), inputData);
        });

        setTimeout(function () { map.relayout(); }, 1000);
    }

    function onLatLngChange(latInput, lngInput, inputData) {
        // 지도에서 위도, 경도가 바뀔 때 호출해서 inputData를 업데이트해주는 함수
        let newInputData = { ...inputData };

        newInputData.userLat = latInput;
        newInputData.userLng = lngInput;

        setInputData(newInputData);
    }

    function onInputChange(target, inputData) {
        // 위도, 경도를 제외한 사용자 데이터가 변경될 때마다 감지하여 inputData를 업데이트해주는 함수
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

    let onSubmitHandler = (e) => {
        // 입력한 데이터 제출
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

        axios.post('/api/user/add_user', body).then(response => {
            console.log(response.data);
            console.log(body);
        });

        // window.location.href = "/meeting_info";
    };

    function isVaildPassword(e) {
        e.preventDefault();     //submit 버튼이 눌렸을 때 뷰가 새로고침 되는 것을 방지

        // URL에서 id parameter를 읽기
        let currentURL = decodeURI(window.location.href);
        let parameters = new URLSearchParams(currentURL.split("?")[1]);
        let inputId = parameters.get("id");

        // 입력한 pwd값을 읽기
        let inputPassword = document.getElementById("passwordToJoin").value;

        let sendData = {
            data: {
                "id": inputId,
                "pw": inputPassword
            }
        }

        axios.post("/api/user/join_meet", sendData).then(response => {
            if (response.data.success) {
                setCertified(true);
            } else {
                console.log(response.data);
                console.log(sendData);
                // alert("존재하지 않는 모임이거나, 입력한 비밀번호가 틀렸습니다.");
                // window.location.reload();
            }
        }).catch((error) => {
            console.log(error.response);
        });
    }

    return (
        <div>
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
                                        className="submit-button"
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