import React, { useState, useEffect } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

import { HostMap } from './components/HostMap.js';
import { ClientMap } from './components/ClientMap.js';
import { ResultMap } from './ResultMap.js';
import './App.css';
import './Meeting.css';
import './Result.css';
import { MeetingData } from './data/meeting_sample_data2.js';
import { MemberData } from './data/meeting_sample_data.js';

function App() {
  // state
  let [meetingData, setMeetingData] = useState(MeetingData);
  let [memberData, setMemberData] = useState(MemberData);
  let [certified, setCertified] = useState(false);
  let [userInputScreen, setUserInputScreen] = useState(0);

  return (
    <div className="App">
      <Navbar className="nav-bar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img alt="" src="img/logo.svg" width="30" height="30" className="d-inline-block align-top" />{' '}ModuModu
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <NavDropdown title="Start" id="navbarScrollingDropdown">
              <NavDropdown.Item as={Link} to="/open_meeting">새 모임 만들기</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/join_meeting">모임 참여하기</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/guide">Guide</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Switch>
        <Route path="/open_meeting">
          <p className="page-title">새 모임 만들기</p>
          <div className="page-content">
            <div className="user-input-area">
              <div className="user-input-title">모임 이름과 참여자 닉네임을 입력해 주세요</div>
              {
                userInputScreen === 0
                  ? (
                    <div className="user-input-content">
                      <div>
                        <p>모임 이름</p>
                        <input type="text" defaultValue="모두 함께 놀아요"></input>
                      </div>
                      <div>
                        <p>닉네임</p>
                        <input type="text" defaultValue="sims"></input>
                      </div>
                      <button className="next-button" onClick={() => { setUserInputScreen(1) }}>다음</button>
                    </div>
                  ) : null
              }
            </div>
            <div className="user-input-area">
              <div className="user-input-title">출발할 위치를 선택해 주세요</div>
              {
                userInputScreen === 1
                  ? (
                    <div className="user-input-content">
                      <HostMap />
                      <button className="prev-button" onClick={() => { setUserInputScreen(0) }}>이전</button>
                      <button className="next-button" onClick={() => { setUserInputScreen(2) }}>다음</button>
                    </div>
                  ) : null
              }
            </div>
            <div className="user-input-area">
              <div className="user-input-title">모임의 최대 인원 수를 선택해 주세요</div>
              {
                userInputScreen === 2
                  ? (
                    <div className="user-input-content">
                      <div className="input-area-3">
                        <p>최대 <input type="number" defaultValue="2"></input>명까지</p>
                        <p>* 모임 인원은 2~6명까지 선택 가능합니다.</p>
                      </div>
                      <button className="prev-button" onClick={() => { setUserInputScreen(1) }}>이전</button>
                      <button className="submit-button" onClick={() => { window.location.href = "/meeting_info" }}>새 모임 생성</button>
                    </div>
                  ) : null
              }
            </div>
          </div>
        </Route>

        <Route path="/join_meeting">
          <p className="page-title">모임 참여하기</p>
          {
            certified === false
              ? (
                <div className="page-door">
                  <p>모임에 참여하기 위해서는 비밀번호가 필요합니다</p>
                  <input type="text"></input><br />
                  <button onClick={() => {
                    setCertified(true);
                  }}>참여하기</button>
                </div>
              )
              :
              <div className="page-content">
                <p>{meetingData[0].name}</p>
                <p>현재 참여자 수 {meetingData[0].memberNum}/{meetingData[0].memberLimit}</p>
                <div className="user-input-area">
                  <div className="user-input-title">참여자 닉네임을 입력해 주세요</div>
                  {
                    userInputScreen === 0
                      ? (
                        <div className="user-input-content">
                          <div>
                            <p>닉네임</p>
                            <input type="text" defaultValue="sims"></input>
                          </div>
                          <button className="next-button" onClick={() => { setUserInputScreen(1) }}>다음</button>
                        </div>
                      ) : null
                  }
                </div>
                <div className="user-input-area">
                  <div className="user-input-title">출발할 위치를 선택해 주세요</div>
                  {
                    userInputScreen === 1
                      ? (
                        <div className="user-input-content">
                          <ClientMap />
                          <button className="prev-button" onClick={() => { setUserInputScreen(0) }}>이전</button>
                          <button className="submit-button" onClick={() => { window.location.href = "/meeting_info" }}>모임 참여하기</button>
                        </div>
                      ) : null
                  }
                </div>
              </div>
          }
        </Route>

        <Route path="/meeting_info">
          <p className="page-title">우리 여기서 모이면 돼!</p>
          <div className="page-content">
            <ResultMap memberData={memberData} />
            <div className="member-area">
              <p>모임 참여자</p>
              <div>
                {
                  memberData.map(function (memberInfo) {
                    return (
                      <div className="member">
                        <img src="./img/logo.png" alt="member"></img>
                        <p>{memberInfo.name}</p>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className="share-area">
              <p>공유 링크</p>
              <input type="text"></input>
              <button>복사</button><br />
              <button>카카오톡 공유하기</button>
            </div>
          </div>
        </Route>

        <Route path="/guide">
          <p className="page-title">모두모두 사용 방법</p>
          <div className="page-content">
            <div>
              초대 혹은 새 모임 만들기로 모임 생성
            </div>
            <div>
              위치 선택, 기타 정보 입력
            </div>
            <div>
              결과 확인
            </div>
          </div>
        </Route>

        <Route path="/">
          <div className="title-area">
            <img src="img/map.png" alt="map" className="img-fluid" />
            <div className="title-p">
              <p>우리, 어디서 만날까?</p>
              <p>멀리 떨어진 친구들과의 모임, 각종 모임 등<br />
                모임 장소 조율이 불편했다면?</p>
              <button onClick={() => { window.location.href = "/open_meeting" }}>모두모두로 간편하게 약속잡기</button>
            </div>
          </div>
          <div className="detail-area">
            <div className="detail-element">
              <p>◾ 거리 계산 없이 간편하게! ◾</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas arcu leo, fringilla vel justo vel, ornare molestie sem.</p>
            </div>
            <div className="detail-element">
              <p>◾ 특징 2 ◾</p>
              <p>특징 설명들</p>
            </div>
            <div className="detail-element">
              <p>◾ 특징 3 ◾</p>
              <p>특징 설명들</p>
              <button onClick={() => { window.location.href = "/open_meeting" }}>지금 바로 해보기!</button>
            </div>
          </div>
        </Route>
      </Switch>

      <footer>
        <div>Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
      </footer>
    </div>
  );
}

export default App;
