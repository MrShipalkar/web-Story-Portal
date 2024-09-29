import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header.jsx';
import HomePage from './pages/home/homePage.jsx';
import StoryModalWrapper from './pages/StoryModalWrapper/StoryModalWrapper.jsx';
import BookmarkedStories from './pages/BookmarkedStories/BookmarkedStories.jsx';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/stories/:storyId/slides/:slideNumber" element={<StoryModalWrapper/>} />
      <Route path="/bookmarked-stories" element={<BookmarkedStories />} />
      </Routes>
    </Router>
  )
}

export default App

