/* global kakao */
import React, { useEffect } from 'react'

function HostMap() {

    useEffect(() => {
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

        // [지도 클릭 Event] 해당 포인트로 마커를 옮김
        window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            let selectedLocation = mouseEvent.latLng;
            marker.setPosition(selectedLocation);

            let newMessage = '선택한 위치의 위도 : ' + selectedLocation.getLat() + ', 경도 : ' + selectedLocation.getLng();
            curLocationP.innerHTML = newMessage;
        });

        setTimeout(function () { map.relayout(); }, 1000);
    }, [])

    return (
        <div className="map-area">
            <div id="host-map"></div>
            <input type="hidden" />
            <input type="hidden" />
            <p id="host-location"></p>
        </div>
    )
}

export { HostMap };