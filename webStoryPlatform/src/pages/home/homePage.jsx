import React, { useState, useEffect, useRef } from 'react';
import StoryList from '../../components/Storylist/storylist.jsx';
import { fetchStoriesByCategory, fetchUserStories } from '../../services/storyServices.js'; 
import './HomePage.css'; 

const categories = ["All", "Food", "Fashion", "Sports", "Travel", "Movie", "Education", "Business"]; 

const HomePage = () => {
  const [storiesByCategory, setStoriesByCategory] = useState({}); 
  const [userStories, setUserStories] = useState([]); // State to track us
  const [visibleStories, setVisibleStories] = useState({}); // Track how many stories are visible for each category and user stories
  const [sortedCategories, setSortedCategories] = useState([]); // State to store sorted categories
  const [selectedCategory, setSelectedCategory] = useState('All'); // State to track the active category
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const categorySliderRef = useRef(null); // Ref for the category slider

  // Fetch stories for each category and sort based on story count
  useEffect(() => {
    const loadStories = async () => {
      const storiesData = {};
      for (let category of categories) {
        const data = await fetchStoriesByCategory(category);
        storiesData[category] = data;
      }
      setStoriesByCategory(storiesData);

      // Initialize visible stories for each category and for user stories to 4
      const initialVisibleStories = { userStories: 4 };
      categories.forEach((category) => {
        initialVisibleStories[category] = 4;
      });
      setVisibleStories(initialVisibleStories);

      // Sort categories by the number of stories in descending order, ignoring "All"
      const sorted = categories
        .filter((category) => category !== 'All')
        .sort((a, b) => (storiesData[b].length || 0) - (storiesData[a].length || 0));
      setSortedCategories(sorted);
    };

    loadStories();
  }, []);

  // Check if the user is logged in and fetch their stories
  useEffect(() => {
    const username = localStorage.getItem('username'); // Fetch username from localStorage
    console.log('Username retrieved:', username); // Debug log the username

    if (username) {
      setIsLoggedIn(true); // Mark the user as logged in
      const fetchUserStoriesData = async () => {
        try {
          const userStories = await fetchUserStories(username); // Fetch user stories
          console.log('User stories fetched:', userStories); // Debug log fetched stories
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

  // Handle horizontal scroll for category slider
  useEffect(() => {
    const categorySlider = categorySliderRef.current;

    const handleScroll = (event) => {
      event.preventDefault();
      categorySlider.scrollLeft += event.deltaY * 0.5; // Adjust scrolling speed by multiplying the deltaY
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

  // Handle "See More" for each category, including user stories
  const handleSeeMore = (category) => {
    setVisibleStories((prevVisible) => ({
      ...prevVisible,
      [category]: prevVisible[category] + 4, // Show 4 more stories for the category
    }));
  };

  return (
    <div className="home-page">
      <header className="category-slider" ref={categorySliderRef}>
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category-item ${selectedCategory === category ? 'active' : ''}`} // Highlight active category
            onClick={() => setSelectedCategory(category)} // Set active category on click
          >
            <img src={`/assets/${category.toLowerCase()}.png`} alt={category} />
            <span>{category}</span>
          </div>
        ))}
      </header>

      {/* Ensure Your Stories show up first */}
      {isLoggedIn && userStories.length > 0 && (
        <section className="story-section your-stories-section">
          <h2>Your Stories</h2>
          <StoryList
            stories={userStories.slice(0, visibleStories.userStories)} // Limit displayed user stories
            showEditButton={true} // Pass a prop to show the edit button on user's stories
          />
          {visibleStories.userStories < userStories.length && (
            <button
              className="see-more-button"
              onClick={() => handleSeeMore('userStories')} // Handle 'See More' for user stories
            >
              See More
            </button>
          )}
        </section>
      )}

      {/* If 'All' is selected, show stories for all categories sorted by the number of stories */}
      {selectedCategory === 'All'
        ? sortedCategories.map((category, index) => (
            <section className="story-section" key={index}>
              <h2>Top Stories About {category}</h2>
              {storiesByCategory[category] && storiesByCategory[category].length > 0 ? (
                <>
                  <StoryList
                    stories={storiesByCategory[category].slice(0, visibleStories[category])} // Limit displayed stories
                  />
                  {visibleStories[category] < storiesByCategory[category].length && (
                    <button
                      className="see-more-button"
                      onClick={() => handleSeeMore(category)} // Handle 'See More' for category stories
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
            // If a specific category is selected, show stories from only that category
            <section className="story-section">
              <h2>Top Stories About {selectedCategory}</h2>
              {storiesByCategory[selectedCategory] && storiesByCategory[selectedCategory].length > 0 ? (
                <>
                  <StoryList
                    stories={storiesByCategory[selectedCategory].slice(0, visibleStories[selectedCategory])} // Limit displayed stories
                  />
                  {visibleStories[selectedCategory] < storiesByCategory[selectedCategory].length && (
                    <button
                      className="see-more-button"
                      onClick={() => handleSeeMore(selectedCategory)} // Handle 'See More' for selected category
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
