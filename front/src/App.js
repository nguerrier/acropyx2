import React from 'react';
import './App.css';
import {HashRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/sign-up';
import Home from './pages/home';
import RecipeDashboard from './pages/my-recipes';
import ErrorPage from './pages/error-page';
import PilotDashboard from './pages/pilots';

const App = () => {
  return (
    <div className="App bg-black">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/pilots" element={<PilotDashboard />} />
          <Route exact path="/my-recipes" element={<RecipeDashboard />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/sign-up" element={<SignUp />} />
          <Route exact={true} path="*" element={<ErrorPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
