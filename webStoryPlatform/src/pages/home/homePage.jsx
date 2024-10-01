import React, { useState, useEffect, useRef } from 'react';
import StoryList from '../../components/Storylist/storylist.jsx';
import { fetchStoriesByCategory, fetchUserStories } from '../../services/storyServices.js'; 
import './HomePage.css'; 

const categories = ["All", "Food", "Fashion", "Sports", "Travel", "Movie", "Education", "Business"]; 

const HomePage = () => {
  const [storiesByCategory, setStoriesByCategory] = useState({}); 
  const [userStories, setUserStories] = useState([]); 
  const [visibleStories, setVisibleStories] = useState({}); 
  const [sortedCategories, setSortedCategories] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState('All'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const categorySliderRef = useRef(null); 

  
  useEffect(() => {
    const loadStories = async () => {
      const storiesData = {};
      for (let category of categories) {
        const data = await fetchStoriesByCategory(category);
        storiesData[category] = data;
      }
      setStoriesByCategory(storiesData);

     
      const initialVisibleStories = { userStories: 4 };
      categories.forEach((category) => {
        initialVisibleStories[category] = 4;
      });
      setVisibleStories(initialVisibleStories);

     
      const sorted = categories
        .filter((category) => category !== 'All')
        .sort((a, b) => (storiesData[b].length || 0) - (storiesData[a].length || 0));
      setSortedCategories(sorted);
    };

    loadStories();
  }, []);

  
  useEffect(() => {
    const username = localStorage.getItem('username'); 
    console.log('Username retrieved:', username); 

    if (username) {
      setIsLoggedIn(true); 
      const fetchUserStoriesData = async () => {
        try {
          const userStories = await fetchUserStories(username); 
          console.log('User stories fetched:', userStories); 
          setUserStories(userStories);
        } catch (error) {
          console.error('Error fetching user stories:', error);
        }
      };
      fetchUserStoriesData();
    } else {
      console.warn('No username found in localStorage');
    }
  }, []);

  
  useEffect(() => {
    const categorySlider = categorySliderRef.current;

    const handleScroll = (event) => {
      event.preventDefault();
      categorySlider.scrollLeft += event.deltaY * 0.5; 
    };

    if (categorySlider) {
      categorySlider.addEventListener('wheel', handleScroll);
    }

    return () => {
      if (categorySlider) {
        categorySlider.removeEventListener('wheel', handleScroll);
      }
    };
  }, []);

  
  const handleSeeMore = (category) => {
    setVisibleStories((prevVisible) => ({
      ...prevVisible,
      [category]: prevVisible[category] + 4, 
    }));
  };

  return (
    <div className="home-page">
      <header className="category-slider" ref={categorySliderRef}>
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category-item ${selectedCategory === category ? 'active' : ''}`} 
            onClick={() => setSelectedCategory(category)} 
          >
            <img src={`/assets/${category.toLowerCase()}.png`} alt={category} />
            <span>{category}</span>
          </div>
        ))}
      </header>

     
      {isLoggedIn && userStories.length > 0 && (
        <section className="story-section your-stories-section">
          <h2>Your Stories</h2>
          <StoryList
            stories={userStories.slice(0, visibleStories.userStories)} 
            showEditButton={true} 
          />
          {visibleStories.userStories < userStories.length && (
            <button
              className="see-more-button"
              onClick={() => handleSeeMore('userStories')} 
            >
              See More
            </button>
          )}
        </section>
      )}

      
      {selectedCategory === 'All'
        ? sortedCategories.map((category, index) => (
            <section className="story-section" key={index}>
              <h2>Top Stories About {category}</h2>
              {storiesByCategory[category] && storiesByCategory[category].length > 0 ? (
                <>
                  <StoryList
                    stories={storiesByCategory[category].slice(0, visibleStories[category])}
                  />
                  {visibleStories[category] < storiesByCategory[category].length && (
                    <button
                      className="see-more-button"
                      onClick={() => handleSeeMore(category)} 
                    >
                      See More
                    </button>
                  )}
                </>
              ) : (
                <p className="no-stories">No stories available</p>
              )}
            </section>
          ))
        : selectedCategory && (
            
            <section className="story-section">
              <h2>Top Stories About {selectedCategory}</h2>
              {storiesByCategory[selectedCategory] && storiesByCategory[selectedCategory].length > 0 ? (
                <>
                  <StoryList
                    stories={storiesByCategory[selectedCategory].slice(0, visibleStories[selectedCategory])} 
                  />
                  {visibleStories[selectedCategory] < storiesByCategory[selectedCategory].length && (
                    <button
                      className="see-more-button"
                      onClick={() => handleSeeMore(selectedCategory)} 
                    >
                      See More
                    </button>
                  )}
                </>
              ) : (
                <p className="no-stories">No stories available</p>
              )}
            </section>
          )}
    </div>
  );
};

export default HomePage;
