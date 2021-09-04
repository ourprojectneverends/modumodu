import React from 'react'
import "./GuidePage.css";

function GuidePage() {

    return (
        <div>
            <p className="page-title">모두모두 사용 방법</p>
            <div className="page-content">
                <div className="guide-step">
                    <p>1. 페이지 접속</p>
                    <p>
                        모두모두 홈에서 [모두모두로 간편하게 약속잡기] 버튼 또는 상단
                        네비게이션 바에서 [START]-[새 모임 만들기] 로 접속합니다.
                    </p>
                    <img src="./img/map.png"></img>
                </div>
                <div className="guide-step">
                    <p>2. 정보 입력</p>
                    <p>
                        모임 이름, 참여자 이름, 출발 위치, 최대 인원 수를 단계별로
                        입력합니다. 잘못 입력한 부분이 있다면 이전 버튼을 통해 수정할 수
                        있습니다.
                    </p>
                    <img src="./img/map.png"></img>
                </div>
                <div className="guide-step">
                    <p>3. 초대하기</p>
                    <p>
                        새 모임이 개설되었습니다! 모임 결과 창에서 새 모임이 제대로
                        개설된 것을 확인할 수 있습니다. 하단의 참여 링크를 복사하거나
                        카카오톡 공유하기를 통해 이전 단계에서 정한 최대 인원까지 다른
                        사람을 모임에 초대할 수 있습니다.
                    </p>
                    <img src="./img/map.png"></img>
                </div>
                <div className="guide-step">
                    <p>4. 모이기</p>
                    <p>
                        다른 참여자가 생길 경우 결과 위치가 참여자에 따라 실시간으로
                        변경됩니다. 자! 이제 정해진 장소로 모임을 시작해 볼까요?
                    </p>
                    <img src="./img/map.png"></img>
                </div>
            </div>
        </div>
    );
}

export { GuidePage };