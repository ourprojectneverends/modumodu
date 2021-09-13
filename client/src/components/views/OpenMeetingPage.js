/* global kakao */
import React, { useState, useEffect } from "react";
import axios from 'axios';

// css
import "./Meeting.css";

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

    useEffect(() => {
        if (userInputScreen == 2) {
            mapDrawer();
        }
    }, [userInputScreen])

    function mapDrawer() {
        // 지도가 있는 창이 열렸을 때, 지도 div에 카카오맵 지도를 그려 주는 함수
        let mapContainer = document.getElementById('host-map');
        let curLocationP = document.getElementById('host-location');

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
        // 입력한 데이터를 post로 서버에 전송하는 함수
        e.preventDefault();     //submit 버튼이 눌렸을 때 뷰가 새로고침 되는 것을 방지

        let body = {
            "meet": {
                "meet_name": inputData.meetingName,
                "meet_pwd": inputData.meetingPwd,
                "limit": inputData.limitOfMeeting
            },
            "user": {
                "name": inputData.userName,
                "pos": {
                    "latitude": inputData.userLat,
                    "longitude": inputData.userLng
                }
            }
        }

        axios.post('/api/user/add_master', body).then(response => {
            if (response.data.success) {
                // console.log(response.data);
                alert("모임이 정상적으로 생성되었습니다!");
                window.location.href = "/meeting_info";
            }else{
                alert("모임 생성에 실패했습니다. 새로고침 후 다시 시도해 주세요.");
            }
        }).catch((error) => {
            console.log(error.response);
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
                                    최대 <input type="number" min="2" max="6" id="limit-of-meeting" onChange={(e) => { onInputChange(e.target, inputData) }} />명까지
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
                            <div className="map-area">
                                <div id="host-map" />
                                <p id="host-location"></p>
                            </div>

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
                                <p>* 모임에 참여할 때 사용되는 비밀번호로, 초대 시 공유되므로 사적인 비밀번호를 사용하지 마세요!</p>
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