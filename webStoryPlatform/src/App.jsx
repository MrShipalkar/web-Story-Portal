import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header.jsx';
import HomePage from './pages/home/homePage.jsx';
import StoryModalWrapper from './pages/StoryModalWrapper/StoryModalWrapper.jsx';
import BookmarkedStories from './pages/BookmarkedStories/BookmarkedStories.jsx';
import YourStories from './components/YourStories/YourStories.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <Router>
      <Header />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/stories/:storyId/slides/:slideNumber" element={<StoryModalWrapper/>} />
      <Route path="/bookmarked-stories" element={<BookmarkedStories />} />
      <Route path="/your-stories" element={<YourStories />} />
      </Routes>
    </Router>
  )
}

export default App

