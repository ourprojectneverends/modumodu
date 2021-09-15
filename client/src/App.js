import React, { useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

// css
import "./App.css";
import "./components/views/PageCommon.css";

// page components
import { HomePage } from "./components/views/HomePage.js";
import { OpenMeetingPage } from "./components/views/OpenMeetingPage.js";
import { JoinMeetingPage } from "./components/views/JoinMeetingPage.js";
import { MeetingInfoPage } from "./components/views/MeetingInfoPage.js";
import { GuidePage } from "./components/views/GuidePage.js";

function App() {
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
          <OpenMeetingPage />
        </Route>

        <Route path="/join_meeting">
          <JoinMeetingPage />
        </Route>

        <Route path="/meeting_info">
          <MeetingInfoPage />
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
