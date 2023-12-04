import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Timeline.css';
import StoryDetailsBox from './StoryDetailsBox';

const LocationSearch = () => {
  const [radiusDiff, setRadiusDiff] = useState(5);
  const [locationStories, setLocationStories] = useState([]);
  const [locationName, setLocationName] = useState('');
  const { locationJSON } = useParams();
  const navigate = useNavigate();


  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const reverseGeocodeLocation = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`);
      console.log("response:",response)
      if (response.data.results.length > 0) {
        return response.data.results[0];
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
    return `Latitude: ${latitude}, Longitude: ${longitude}`;
  };

  useEffect(() => {
    const handleSearch = async () => {
      console.log("locCSON",locationJSON)
      if (locationJSON) {
        try {
          const locationData = JSON.parse(locationJSON);
          setLocationName(determineLocationName(locationData));
          //const locationName = await reverseGeocodeLocation(locationData.latitude, locationData.longitude);

          if (locationName) {
          } else {
            const locationName = await reverseGeocodeLocation(locationData.latitude, locationData.longitude);
            setLocationName(locationName);
          }

          const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_HOST_NAME}:8000/user/storySearchByLocation`, {
            params: {
              location: locationJSON,
              radius_diff: radiusDiff,
            },
            withCredentials: true,
          });

          setLocationStories(response.data.stories);
        } catch (error) {
          console.error('Error fetching location stories:', error);
          setLocationStories([]);
        }
      }
    };

    handleSearch();
  }, [locationJSON, radiusDiff]);

  const determineLocationName = (locationData) => {
    console.log("Location Data", locationData)
    if (locationData.name) {
      return locationData.name;
    }
    else{
      switch (locationData.type) {
        case 'Point':
          return `Latitude: ${locationData.latitude}, Longitude: ${locationData.longitude}`;
        case 'LineString':
          return 'Line Location';
        case 'Polygon':
          return 'Polygon Location';
        case 'Circle':
          return `Circle Location with center at Latitude: ${locationData.center.lat}, Longitude: ${locationData.center.lng}`;
        default:
          return 'Unknown Location';
      }
    }
  };

  const handleStoryClick = async (id) => {
    navigate(`/story/${id}`);
  };

  const handleGoBack = () => {
    navigate(-1); // This will navigate back to the previous page
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
      <h2>Memories in {locationName}</h2>



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
