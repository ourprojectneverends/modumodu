/* global kakao */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

//css
import "./MeetingInfoPage.css";

function MeetingInfoPage(props) {
    let [meetingInfo, setMeetingInfo] = useState({
        meetingName: "최강자들의 모임",
        meetingId: "",
        meetingLimit: "5",
        resultLat: "36.367524",
        resultLng: "127.344725"
    });
    let [meetingMembers, setMeetingMembers] = useState([{
        userName: "고영이",
        userLat: "36.366752",
        userLng: "127.344206"
    }, {
        userName: "햄서터",
        userLat: "36.370178",
        userLng: "127.345897"
    }, {
        userName: "갱얼쥐",
        userLat: "36.364262",
        userLng: "127.346424"
    }]);
    const copyLinkRef = useRef();

    useEffect(() => {
        loadMeetingData();
        mapDrawer();
    }, [])

    function loadMeetingData(e) {
        // loadMeetingData : MeetingInfoPage가 열렸을 때, 모임 id를 통해 모임 데이터를 불러오는 함수

        // URL에서 id parameter를 읽고, id를 meeting_info로 보냄
        let currentURL = decodeURI(window.location.href);
        let parameters = new URLSearchParams(currentURL.split("?")[1]);
        let idValue = parameters.get("id");
        let newMeetingInfo = { ...meetingInfo };
        newMeetingInfo.meetingId = idValue;
        setMeetingInfo(newMeetingInfo);

        let sendData = {
            "id": idValue
        }

        // id를 통해 모임의 정보를 가져옴
        // axios.post("/api/user/meeting_info", sendData).then(response => {
        //     console.log(response.data);
        //     if (response.data.success) {
        //         // setMeetingId(idValue);
        //         // setMeetingName(response.data.meetName);
        //         // setNumberOfPeopleState(response.data.meetMemCount + " / " + response.data.meetMemLimit);
        //     } else {
        //         alert("존재하지 않는 모임입니다.");
        //         // window.location.reload();
        //     }
        // }).catch((error) => {
        //     console.log(error.response);
        // });
    }

    function mapDrawer() {
        // mapDrawer : 지도가 있는 창이 열렸을 때, 지도 div에 카카오맵 지도를 그려 주는 함수
        let geocoder = new kakao.maps.services.Geocoder();
        let mapContainer = document.getElementById("result-map");
        let curLocationP = document.getElementById("result-location");

        let resultLatitude = meetingInfo.resultLat;
        let resultLongtitude = meetingInfo.resultLng;

        let initialPosition = new kakao.maps.LatLng(resultLatitude, resultLongtitude);

        let options = {
            // 지도 생성시 필요한 기본옵션 (중심좌표, 확대축소정도)
            center: initialPosition,
            level: 3
        };
        let map = new kakao.maps.Map(mapContainer, options);

        // 최종 장소에 마커 만들기
        let resultMarker = new kakao.maps.Marker({
            position: initialPosition
        });
        resultMarker.setMap(map);

        let printAddress = function (result, status) {
            // 위도, 경도에 따라 지번 주소를 curLocationP에 출력해주는 콜백함수
            if (status === kakao.maps.services.Status.OK) {
                curLocationP.innerHTML = result[0].address.address_name;
            }
        };
        geocoder.coord2Address(resultLongtitude, resultLatitude, printAddress);

        let bounds = new kakao.maps.LatLngBounds();
        let imageSrc = "./img/logo.png";
        for (let i = 0; i < meetingMembers.length; i++) {
            let imageSize = new kakao.maps.Size(35, 35);
            let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

            let markerLatLng = new kakao.maps.LatLng(meetingMembers[i].userLat, meetingMembers[i].userLng);
            let marker = new kakao.maps.Marker({
                map: map,
                position: markerLatLng,
                title: meetingMembers[i].userName,
                image: markerImage
            });

            bounds.extend(markerLatLng);
        }

        map.setBounds(bounds);
    }

    function copyTextUrl() {
        copyLinkRef.current.focus();
        copyLinkRef.current.select();

        navigator.clipboard.writeText(copyLinkRef.current.defaultValue).then(() => {
            alert("링크를 복사했습니다.");
        });
    }

    return (
        <div>
            <p className="page-title">우리 여기서 모이면 돼!</p>
            <div className="page-content">
                <div className="meeting-info-map">
                    <p>{meetingInfo.meetingName} - 최종 모임 장소</p>
                    <div className="result-map-area">
                        <div id="result-map"></div>
                        <div>
                            <p id="result-location"></p>
                            <button>공유</button>
                        </div>
                    </div>
                </div>

                <div className="meeting-info-member-area">
                    <p>현재 모임 참여자</p>
                    <div>
                        {meetingMembers.map(function (memberInfo) {
                            return (
                                <div className="member">
                                    <img src="./img/logo.png" alt="member"></img>
                                    <p>{memberInfo.userName}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="meeting-info-share-area">
                    <p>초대하기</p>
                    <div>
                        <input type="text" ref={copyLinkRef} defaultValue={"http://localhost:3000/join_meeting?id=" + meetingInfo.meetingId} />
                        <button onClick={() => { copyTextUrl() }}>복사</button>
                    </div>
                    <button>카카오톡 공유하기</button>
                </div>
            </div>
        </div>
    );
}

export { MeetingInfoPage }