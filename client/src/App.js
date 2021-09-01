// import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from 'react-router-dom';

import LandingPage from './components/views/LandingPage/LandingPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path='/' component={LandingPage}/>
          <Route exact path='/register' component={RegisterPage}/>
        </Switch>
      </div>

    </Router>
  );
}

export default App;
