const API_KEY = config.KAKAO_MAP_API_KEY;

// DOM references
let mapContainer = document.getElementById('map');
let curLocationP = document.getElementById('cur-location');

// 마커를 표시할 위치와 title 객체 배열입니다 
var positions = [
    {
        title: 'HOST', 
        latlng: new kakao.maps.LatLng(33.450705, 126.570677)
    },
    {
        title: 'MEMBER1', 
        latlng: new kakao.maps.LatLng(33.450936, 126.569477)
    },
    {
        title: 'MEMBER2', 
        latlng: new kakao.maps.LatLng(33.450879, 126.569940)
    },
    {
        title: 'MEMBER3',
        latlng: new kakao.maps.LatLng(33.451393, 126.570738)
    }
];

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
  });
})

