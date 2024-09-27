import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header.jsx';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route component={NotFound} /> */}
      </Routes>
    </Router>
  )
}

export default App

