const API_KEY = config.KAKAO_MAP_API_KEY;

var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스

$.getScript(`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&autoload=false`, function() {
  kakao.maps.load(
    function() {
      var options = { //지도를 생성할 때 필요한 기본 옵션
        center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
        level: 3 //지도의 레벨(확대, 축소 정도)
      };
      var map = new kakao.maps.Map(container, options);
    });
  })
