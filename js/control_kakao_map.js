const API_KEY = config.KAKAO_MAP_API_KEY;

let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스

// gps로 현재 위치 받아오는 부분 START
let cur_latitude = 33.450701;   // 현재 위도와 경도를 저장할 변수, 기본값은 카카오 본사
let cur_longtitude = 126.570667;

function getLatLng(position) {
  // 위도와 경도 저장하기
  cur_latitude = position.coords.latitude;
  cur_longtitude = position.coords.longitude;
}

function errorHandler(err) {
  // 에러 관리
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

let options = {
  enableHighAccuracy: true,
  timeout: 5000
};

navigator.geolocation.getCurrentPosition(getLatLng, errorHandler, options);
// gps로 현재 위치 받아오는 부분 end

$.getScript(`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&autoload=false`, function () {
  kakao.maps.load(
    function () {
      // 지도에서 나타낼 초기 위치를 현재 위치로 지정
      var initialPosition = new kakao.maps.LatLng(cur_latitude, cur_longtitude);

      var options = { //지도를 생성할 때 필요한 기본 옵션
        center: initialPosition, //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
      };

      // 중심 좌표에 마커 만들기
      var marker = new kakao.maps.Marker({
        position: initialPosition
      });

      var map = new kakao.maps.Map(container, options);
      marker.setMap(map);

      // 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
  // 클릭한 위도, 경도 정보를 가져옵니다 
  var latlng = mouseEvent.latLng; 
  
  // 마커 위치를 클릭한 위치로 옮깁니다
  marker.setPosition(latlng);
  
  var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
  message += '경도는 ' + latlng.getLng() + ' 입니다';
  
  var resultDiv = document.getElementById('clickLatlng'); 
  resultDiv.innerHTML = message;
  
});
    });
})

