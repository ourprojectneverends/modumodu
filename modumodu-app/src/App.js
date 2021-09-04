import React, { useState, useEffect } from "react";
import { Link, Route, Switch } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

import { HostMap } from "./components/HostMap.js";
import { ClientMap } from "./components/ClientMap.js";
import { ResultMap } from "./components/ResultMap.js";
import "./App.css";
import "./Meeting.css";
import "./Result.css";
import "./Guide.css";
import { MeetingData } from "./data/meeting_sample_data2.js";
import { MemberData } from "./data/meeting_sample_data.js";

function App() {
  // state
  let [meetingData, setMeetingData] = useState(MeetingData);
  let [memberData, setMemberData] = useState(MemberData);
  let [certified, setCertified] = useState(false);
  let [userInputScreen, setUserInputScreen] = useState(0);

  const [newMeetingInputs, setNewMeetingInputs] = useState({
    meetingName: "",
    memberName: "",
    lat: "",
    lng: "",
    meetingLimit: "",
  });

  const { meetingName, memberName, lat, lng, meetingLimit } = newMeetingInputs;

  const onChange = (e) => {
    const { value, newMeetingInputs } = e.target;
    setNewMeetingInputs({
      ...newMeetingInputs,
      [meetingName]: value,
    });
  };

  const onReset = () => {
    setNewMeetingInputs({
      meetingName: "",
      memberName: "",
      lat: "",
      lng: "",
      meetingLimit: "",
    });
  };

  return (
    <div className="App">
      <Navbar className="nav-bar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              alt=""
              src="img/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            <span>ModuModu</span>
            {/* 로고+로고이름 이미지로 변경하기 */}
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <NavDropdown title="Start" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to="/open_meeting">
                <span>새 모임 만들기</span>
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/join_meeting">
                <span>모임 참여하기</span>
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/guide">
              Guide
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Switch>
        <Route path="/open_meeting">
          <p className="page-title">새 모임 만들기</p>
          <div className="page-content">
            <div className="user-input-area">
              <div
                className={
                  userInputScreen === 0
                    ? "user-input-title opened"
                    : "user-input-title"
                }
                onClick={() => {
                  setUserInputScreen(0);
                }}
              >
                모임 이름과 참여자 닉네임을 입력해 주세요
              </div>
              {userInputScreen === 0 ? (
                <div className="user-input-content">
                  <div>
                    <p>모임 이름</p>
                    <input
                      type="text"
                      name="meetingName"
                      placeholder="모임 이름"
                      onChange={onChange}
                      value={meetingName}
                    />
                  </div>
                  <div>
                    <p>닉네임</p>
                    <input type="text" defaultValue="sims" />
                  </div>
                  <div className="user-input-buttons">
                    <button className="none">x</button>
                    <button
                      className="next-button"
                      onClick={() => {
                        setUserInputScreen(1);
                      }}
                    >다음</button>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="user-input-area">
              <div
                className={
                  userInputScreen === 1
                    ? "user-input-title opened"
                    : "user-input-title"
                }
                onClick={() => {
                  setUserInputScreen(1);
                }}
              >
                출발할 위치를 선택해 주세요
              </div>
              {userInputScreen === 1 ? (
                <div className="user-input-content">
                  <HostMap />

                  <div className="user-input-buttons">
                    <button
                      className="prev-button"
                      onClick={() => {
                        setUserInputScreen(0);
                      }}
                    >이전</button>
                    <button
                      className="next-button"
                      onClick={() => {
                        setUserInputScreen(2);
                      }}
                    >다음</button>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="user-input-area">
              <div
                className={
                  userInputScreen === 2
                    ? "user-input-title opened"
                    : "user-input-title"
                }
                onClick={() => {
                  setUserInputScreen(2);
                }}
              >
                모임의 최대 인원 수를 선택해 주세요
              </div>
              {userInputScreen === 2 ? (
                <div className="user-input-content">
                  <div className="input-area-3">
                    <p>
                      최대 <input type="number" defaultValue="2" />명까지
                    </p>
                    <p>* 모임 인원은 2~6명까지 선택 가능합니다.</p>
                  </div>

                  <div className="user-input-buttons">
                    <button
                      className="prev-button"
                      onClick={() => {
                        setUserInputScreen(1);
                      }}
                    >이전</button>
                    <button
                      className="submit-button"
                      onClick={() => {
                        window.location.href = "/meeting_info";
                      }}
                    >새 모임 생성</button>
                    <button className="none">x</button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Route>

        <Route path="/join_meeting">
          <p className="page-title">모임 참여하기</p>
          {certified === false ? (
            <div className="page-door">
              <p>모임에 참여하기 위해서는 비밀번호가 필요합니다</p>
              <input type="password" />
              <br />
              <button
                onClick={() => {
                  setCertified(true);
                }}
              >
                참여하기
              </button>
            </div>
          ) : (
            <div className="page-content">
              <div className="join-meeting-info">
                <p>{meetingData[0].name}</p>
                <p>
                  현재 참여자 수 {meetingData[0].memberNum}/
                  {meetingData[0].memberLimit}
                </p>
              </div>

              <div className="user-input-area">
                <div
                  className={
                    userInputScreen === 0
                      ? "user-input-title opened"
                      : "user-input-title"
                  }
                  onClick={() => {
                    setUserInputScreen(0);
                  }}
                >참여자 닉네임을 입력해 주세요</div>
                {userInputScreen === 0 ? (
                  <div className="user-input-content">
                    <div>
                      <p>닉네임</p>
                      <input type="text" placeholder="sims" />
                    </div>
                    <button
                      className="next-button"
                      onClick={() => {
                        setUserInputScreen(1);
                      }}
                    >다음</button>
                  </div>
                ) : null}
              </div>
              <div className="user-input-area">
                <div
                  className={
                    userInputScreen === 1
                      ? "user-input-title opened"
                      : "user-input-title"
                  }
                  onClick={() => {
                    setUserInputScreen(1);
                  }}
                >출발할 위치를 선택해 주세요</div>
                {userInputScreen === 1 ? (
                  <div className="user-input-content">
                    <ClientMap />
                    <button
                      className="prev-button"
                      onClick={() => {
                        setUserInputScreen(0);
                      }}
                    >
                      이전
                    </button>
                    <button
                      className="submit-button"
                      onClick={() => {
                        window.location.href = "/meeting_info";
                      }}
                    >
                      모임 참여하기
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </Route>

        <Route path="/meeting_info">
          <p className="page-title">우리 여기서 모이면 돼!</p>
          <div className="page-content">
            <div className="meeting-info-map">
              <p>{meetingName} 최종 모임 장소</p>
              <ResultMap memberData={memberData} />
            </div>
            <div className="meeting-info-member-area">
              <p>현재 모임 참여자</p>
              <div>
                {memberData.map(function (memberInfo) {
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
                <input type="text" value="http://localhost:3000/join_meeting" disabled/>
                <button>복사</button>
              </div>
              <button>카카오톡 공유하기</button>
            </div>
          </div>
        </Route>

        <Route path="/guide">
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
        </Route>

        <Route path="/">
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
              <img src="./img/travel.png"></img>
            </div>
            <div className="detail-element">
              <p>- 2 -</p>
              <p>카카오톡으로 공유하기 기능</p>
              <p>
                어디서 만날지 캡쳐해서 보낼 필요 없이 [카카오톡 공유] 하나로
                메세지 전달 가능!
              </p>
              <img src="./img/travel.png"></img>
            </div>
            <div className="detail-element">
              <p>- 3 -</p>
              <p>공평한 모임 장소</p>
              <p>
                모임 참여자들의 위치를 고려한 모임 장소로 모두가 만족할 수 있는
                모임 장소 설정!
              </p>
              <img src="./img/travel.png"></img>
            </div>
            <button
              onClick={() => {
                window.location.href = "/open_meeting";
              }}
            >
              지금 바로 시작하기!
            </button>
          </div>
        </Route>
      </Switch>

      <footer>
        <div>
          Icons made by{" "}
          <a href="https://www.freepik.com" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
