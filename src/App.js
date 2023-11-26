import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDirectory from './components/UserDirectory';
import UserDetails from './components/UserDetails';

const App = ({ users }) => (
  <Router>
    <Routes>
      <Route path="/" element={<UserDirectory users={users} />} />
      <Route path="/user/:userId" element={<UserDetails users={users} />} />
    </Routes>
  </Router>
);

export default App;
