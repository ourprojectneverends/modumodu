import React from 'react'
import "./MeetingInfoPage.css";
import { ResultMap } from "./ResultMap.js";

function MeetingInfoPage(props) {

    return (
        <div>
            <p className="page-title">우리 여기서 모이면 돼!</p>

            <div className="page-content">
                <div className="meeting-info-map">
                    <p>{props.meetingData.meetingName} 최종 모임 장소</p>
                    <ResultMap memberData={props.memberData} />
                </div>

                <div className="meeting-info-member-area">
                    <p>현재 모임 참여자</p>
                    <div>
                        {props.memberData.map(function (memberInfo) {
                            return (
                                <div className="member">
                                    <img src="./img/logo.png" alt="member"></img>
                                    <p>{memberInfo.name}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="meeting-info-share-area">
                    <p>초대하기</p>
                    <div>
                        <input type="text" value="http://localhost:3000/join_meeting" disabled />
                        <button>복사</button>
                    </div>
                    <button>카카오톡 공유하기</button>
                </div>
            </div>
        </div>
    );
}

export { MeetingInfoPage }