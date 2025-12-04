import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Home/Dashboard.jsx';
import InterviewPrep from './pages/InterviewPrep/InterviewPrep.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/interview-prep/:sessionId' element={<InterviewPrep/>} />

      </Routes>
    </Router>
  );
};

export default App;
