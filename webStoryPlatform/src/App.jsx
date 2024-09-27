import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header.jsx';
import HomePage from './pages/home/homePage.jsx';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App

