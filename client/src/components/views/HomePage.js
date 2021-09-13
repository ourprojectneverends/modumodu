import React from 'react'
import "./HomePage.css";

function HomePage() {

    return (
        <div>
            <div className="title-area">
                <img src="img/map.png" alt="map" className="img-fluid" />
                <div className="title-p">
                    <p>우리, 어디서 만날까?</p>
                    <p>
                        멀리 떨어진 친구들과의 모임, 여행 장소 고민, 각종 미팅 등<br />
                        모임 장소 조율이 불편했다면?
                    </p>
                    <button
                        onClick={() => {
                            window.location.href = "/open_meeting";
                        }}
                    >
                        모두모두로 간편하게 약속잡기
                    </button>
                </div>
            </div>

            <div className="detail-area">
                <div className="detail-element">
                    <p>- 1️ -</p>
                    <p>거리 계산 없이 간편하게!</p>
                    <p>
                        모임 주최자가 모든 사람의 위치를 수집할 필요 없이, 각자 입력하면
                        끝!
                    </p>
                    <img src="./img/travel.png" alt=""></img>
                </div>
                <div className="detail-element">
                    <p>- 2 -</p>
                    <p>카카오톡으로 공유하기 기능</p>
                    <p>
                        어디서 만날지 캡쳐해서 보낼 필요 없이 [카카오톡 공유] 하나로
                        메세지 전달 가능!
                    </p>
                    <img src="./img/travel.png" alt=""></img>
                </div>
                <div className="detail-element">
                    <p>- 3 -</p>
                    <p>공평한 모임 장소</p>
                    <p>
                        모임 참여자들의 위치를 고려한 모임 장소로 모두가 만족할 수 있는
                        모임 장소 설정!
                    </p>
                    <img src="./img/travel.png" alt=""></img>
                </div>

                <button
                    onClick={() => {
                        window.location.href = "/open_meeting";
                    }}
                >
                    지금 바로 시작하기!
                </button>
            </div>

        </div>
    );
}

export { HomePage };