import React, { useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

// css
import "./App.css";
import "./components/views/PageCommon.css";
import "./components/views/Meeting.css";

// components
import { HomePage } from "./components/views/HomePage.js";
import { MeetingInfoPage } from "./components/views/MeetingInfoPage.js";
import { GuidePage } from "./components/views/GuidePage.js";
import { HostMap } from "./components/views/HostMap.js";
import { ClientMap } from "./components/views/ClientMap.js";
import LoginPage from "./components/views/LoginPage/LoginPage";

// data
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
        <Route exact path="/login" component={LoginPage} />

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
          <MeetingInfoPage memberData={memberData} meetingData={meetingData} />
        </Route>

        <Route path="/guide">
          <GuidePage />
        </Route>

        <Route path="/">
          <HomePage />
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
