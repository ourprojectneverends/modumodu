import React, { useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';

import './App.css';

function App() {


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

        </Route>
        <Route path="/join_meeting">

        </Route>
        <Route path="/guide">

        </Route>
        <Route path="/">
          <div className="title-area">
            <img src="img/map.png" alt="map" className="img-fluid" />
            <div className="title-p">
              <p>우리, 어디서 만날까?</p>
              <p>멀리 떨어진 친구들과의 모임, 각종 모임 등<br />
                모임 장소 조율이 불편했다면?</p>
              <button>모두모두로 간편하게 약속잡기</button>
            </div>
          </div>

          <div className="detail-area">
            <div className="detail-element">
              <p>◾ 거리 계산 없이 간편하게! ◾</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas arcu leo, fringilla vel justo vel, ornare molestie sem. Fusce cursus turpis sed ex tincidunt, in scelerisque elit placerat. Sed quis pretium quam, id mollis tellus. Nullam convallis massa nisl, sed posuere justo egestas eget. Integer feugiat nunc et sollicitudin mattis.</p>
            </div>

            <div className="detail-element">
              <p>◾ 특징 2 ◾</p>
              <p>특징 설명들</p>
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
