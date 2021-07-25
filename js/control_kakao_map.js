const API_KEY = config.KAKAO_MAP_API_KEY;

let container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스

// gps 관련 변수들
let is_gps_available = false;
let gps_position;   // gps 객체
let cur_latitude = 33.450701;   // 현재 위도와 경도를 저장할 변수, 기본값은 카카오 본사
let cur_longtitude = 126.570667;


$.getScript(`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&autoload=false`, function () {
  kakao.maps.load(
    function () {
      // 지도에서 나타낼 초기 위치를 현재 위치로 지정
      var initialPosition = new kakao.maps.LatLng(cur_latitude, cur_longtitude);

      var options = { //지도를 생성할 때 필요한 기본 옵션
        center: initialPosition, //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
      };

      var marker = new kakao.maps.Marker({
        position: initialPosition
      });

      var map = new kakao.maps.Map(container, options);
      marker.setMap(map);
    });
})