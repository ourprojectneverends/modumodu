const API_KEY = config.KAKAO_MAP_API_KEY;

// DOM references
let mapContainer = document.getElementById('map');
let curLocationP = document.getElementById('cur-location');


// gps로 현재 위치 받아오는 부분 START
let curLatitude = 33.450701;   // 현재 위도와 경도를 저장할 변수, 기본값은 카카오 본사
let curLongtitude = 126.570667;

function getLatLng(position) {
  // 위도와 경도 저장하기
  curLatitude = position.coords.latitude;
  curLongtitude = position.coords.longitude;
}

function errorHandler(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

let options = {
  enableHighAccuracy: true,
  timeout: 5000
};

navigator.geolocation.getCurrentPosition(getLatLng, errorHandler, options);
// gps로 현재 위치 받아오는 부분 END

$.getScript(`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&autoload=false`, function () {
  kakao.maps.load(function () {
    // 지도에서 나타낼 초기 위치를 현재 위치로 지정
    let initialPosition = new kakao.maps.LatLng(curLatitude, curLongtitude);

    let options = { //지도를 생성할 때 필요한 기본 옵션
      center: initialPosition, //지도의 중심좌표.
      level: 3 //지도의 레벨(확대, 축소 정도)
    };

    // 중심 좌표에 마커 만들기
    let marker = new kakao.maps.Marker({
      position: initialPosition
    });

    let map = new kakao.maps.Map(mapContainer, options);
    marker.setMap(map);
    let message = '선택한 위치의 위도 : ' + curLatitude + ', 경도 : ' + curLongtitude;
    curLocationP.innerHTML = message;

    // [지도 클릭 Event] 해당 포인트로 마커를 옮김
    kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
      let selectedLocation = mouseEvent.latLng;
      marker.setPosition(selectedLocation);

      let newMessage = '선택한 위치의 위도 : ' + selectedLocation.getLat() + ', 경도 : ' + selectedLocation.getLng();
      curLocationP.innerHTML = newMessage;
    });
  });
})

