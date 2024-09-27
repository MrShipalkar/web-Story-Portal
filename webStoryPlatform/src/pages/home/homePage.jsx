// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import StoryList from '../../components/Storylist/storylist.jsx';
import { fetchStoriesByCategory } from '../../services/storyServices.js';
import './HomePage.css'; // Style the homepage

const categories = ['All', 'movie', 'Fruits', 'World', 'India','All', 'movie', 'Fruits', 'World', 'India']; // Define categories

const HomePage = () => {
  const [storiesByCategory, setStoriesByCategory] = useState({}); // State to track stories for each category
  const [visibleStories, setVisibleStories] = useState({}); // Track how many stories are visible for each category
  const [selectedCategory, setSelectedCategory] = useState('All'); // State to track the active category
  const categorySliderRef = useRef(null); // Ref for the category slider

  // Fetch stories for each category
  useEffect(() => {
    const loadStories = async () => {
      const storiesData = {};

      for (let category of categories) {
        const data = await fetchStoriesByCategory(category);
        storiesData[category] = data;
      }

      setStoriesByCategory(storiesData);

      // Initialize visible stories for each category to 4
      const initialVisibleStories = {};
      categories.forEach((category) => {
        initialVisibleStories[category] = 4;
      });
      setVisibleStories(initialVisibleStories);
    };

    loadStories();
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

  // Handle "See More" for each category
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

      {/* If 'All' is selected, show stories for all categories */}
      {selectedCategory === 'All'
        ? categories.map(
            (category, index) =>
              category !== 'All' && ( // Skip "All" as it doesn't have specific stories
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
              )
          )
        : selectedCategory && (
            // If a specific category is selected, show stories from only that category
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
