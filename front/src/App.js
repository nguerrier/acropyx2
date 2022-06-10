import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/login';
import SignUp from './pages/sign-up';
import Home from './pages/home';
import RecipeDashboard from './pages/my-recipes';
import ErrorPage from './pages/error-page';
import PilotDashboard from './pages/pilots';

const PATH_PREFIX = process.env.REACT_APP_URI_ROOT || "/";

const App = () => {
  return (
    <div className="App bg-black">
      <BrowserRouter basename={PATH_PREFIX}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/pilots" element={<PilotDashboard />} />
          <Route exact path="/my-recipes" element={<RecipeDashboard />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/sign-up" element={<SignUp />} />
          <Route exact={true} path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
