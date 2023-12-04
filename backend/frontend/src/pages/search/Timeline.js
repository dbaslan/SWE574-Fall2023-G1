import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './Timeline.css';
import StoryDetailsBox from './StoryDetailsBox';

const LocationSearch = () => {

  const [locationName, setLocationName] = useState('');
  const [locationStories, setLocationStories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  useEffect(() => {
    // Check if stories are passed in state
    if (location.state && location.state.stories) {
      setLocationStories(location.state.stories);
    } else {
      // Handle case when no stories are passed
      // Redirect back or show a message, etc.
    }
  }, [location.state]);


  const handleStoryClick = async (id) => {
    navigate(`/story/${id}`);
  };

  const formatDate = (story) => {

    let dateString = "";
    const optionsWithoutTime = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const dateOptions = story.include_time ? options : optionsWithoutTime;

    switch (story.date_type) {
      case "decade":
        dateString = `Memory Time: ${story.decade}s`;
        break;
      case "year":
        dateString = `Memory Time: ${story.year}`;
        break;
      case "year_interval":
        const startYear = story.start_year;
        const endYear = story.end_year;
        dateString = `Memory Time: ${startYear}-${endYear}`;
        break;
      case "normal_date":
        const date = new Date(story.date).toLocaleDateString("en-US", dateOptions);
        dateString = `Memory Time: ${date}`;
        break;
      case "interval_date":
        const startDate = new Date(story.start_date).toLocaleDateString("en-US", dateOptions);
        const endDate = new Date(story.end_date).toLocaleDateString("en-US", dateOptions);
        dateString = `Memory Time: ${startDate}-${endDate}`;
        break;
      default:
        dateString = "";
    }
    return dateString;
  };

  const extractFirstImageUrl = (htmlContent) => {
    const imgRegex = /<img.*?src=["'](.*?)["']/;
    const match = htmlContent.match(imgRegex);
    return match ? match[1] : null;
  };

  return (
    <div>
      <h2>TIMELINE!!!</h2>
      <div className="timeline">
        {locationStories.map((story, index) => {
          const imageUrl = extractFirstImageUrl(story.content);
          return (
            <div key={story.id} className="dot" style={{ left: `${(index + 1) * 10}%` }}>
              <StoryDetailsBox
                story={story}
                onClick={() => handleStoryClick(story.id)}
                imageUrl={imageUrl}
              />
              <p className="story-date">{formatDate(story)}</p>
            </div>
          );
        })}
      </div>




      {/* Rest of your component content */}
    </div>
  );
};

export default LocationSearch;
