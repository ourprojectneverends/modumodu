/* global kakao */
import React, { useEffect } from 'react'

function ResultMap() {

    useEffect(() => {
        let curLocationP = document.getElementById('result-location');
        let mapContainer = document.getElementById('result-map');

        let resultLatitude = 33.450701;
        let resultLongtitude = 126.570667;
        let initialPosition = new window.kakao.maps.LatLng(resultLatitude, resultLongtitude);

        let options = { //지도를 생성할 때 필요한 기본 옵션
            center: initialPosition, //지도의 중심좌표.
            level: 3 //지도의 레벨(확대, 축소 정도)
        };

        let memberPositions = [
            {
                title: '고영이',
                latlng: new kakao.maps.LatLng(33.450705, 126.570677)
            },
            {
                title: '갱얼쥐',
                latlng: new kakao.maps.LatLng(33.450936, 126.569477)
            },
            {
                title: '햄서터',
                latlng: new kakao.maps.LatLng(33.450879, 126.569940)
            }
        ];

        let imageSrc = "./img/logo.png";

        // 중심 좌표에 마커 만들기
        let resultMarker = new window.kakao.maps.Marker({
            position: initialPosition
        });

        let map = new window.kakao.maps.Map(mapContainer, options);
        resultMarker.setMap(map);
        let message = '모임 장소 위도 : ' + resultLatitude + ', 경도 : ' + resultLongtitude;
        curLocationP.innerHTML = message;

        for (var i = 0; i < memberPositions.length; i++) {
            let imageSize = new kakao.maps.Size(35, 35);
            let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

            var marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: memberPositions[i].latlng, // 마커를 표시할 위치
                title: memberPositions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                image: markerImage // 마커 이미지 
            });
        }

        setTimeout(function () { map.relayout(); }, 1000);
    }, [])

    return (
        <div className="result-map-area">
            <p id="result-location"></p>
            <div id="result-map"></div>
        </div>
    )
}

export { ResultMap };