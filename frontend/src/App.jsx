import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import './i18n';

import BusTimings from './pages/BusTimings';
import TransportDetails from './pages/TransportDetails';
import FamousPlaces from './pages/FamousPlaces';
import Feedback from './pages/Feedback';
// import AdminDashboard from './pages/AdminDashboard'; // To be created
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buses" element={<BusTimings />} />
            <Route path="/transport" element={<TransportDetails />} />
            <Route path="/places" element={<FamousPlaces />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/addadmin04" element={<AdminLogin />} />
            <Route path="/addadmin04/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
