import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './UserDetails.scss';

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isClockPaused, setIsClockPaused] = useState(false);
  const [countries, setCountries] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [timeZone, setTimeZone] = useState('UTC');
  const [currentTime, setCurrentTime] = useState(() => {
    return new Date().getTime();
  });

  const fetchTime = async (area) => {
    try {
      const url = `http://worldtimeapi.org/api/timezone/${area}`;
      const response = await fetch(url);
      const data = await response.json();
      setTimeZone(area);
      setCurrentTime(new Date(data.datetime));
    } catch (error) {
      console.error('Error fetching time:', error);
    }
  };

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error fetching user details:', error));

    fetch('http://worldtimeapi.org/api/timezone')
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error('Error fetching countries:', error));

    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));

    fetchTime(timeZone);
  }, [userId]);

  useEffect(() => {
    let timerId;
    if (!isClockPaused) {
      timerId = setInterval(() => {
        setCurrentTime(prevTime => new Date(prevTime.getTime() + 1000));
      }, 1000);
    }

    return () => clearInterval(timerId);
  }, [isClockPaused, currentTime]);

  function formatTimeFromDate(dateObject) {
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false, timeZone: timeZone };
    const formattedTime = dateObject.toLocaleString('en-US', options);
    return formattedTime;
  }

  const handlePauseToggle = () => {
    setIsClockPaused((prevIsClockPaused) => !prevIsClockPaused);
  };

  const handleCountryChange = (event) => {
    fetchTime(event.target.value);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const PostModal = ({ post }) => {
    return (
      <div className="post-modal modal" onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      </div>
    );
  };

  return (
    <section className="user-detail-wrapper">
      <div className="user-detail-container">
        <div className="user-header">
          <Link to="/">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </Link>
          <div className="country-selector">
            <select id="countrySelector" name="countrySelector" onChange={handleCountryChange}>
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <p className='timer'>{formatTimeFromDate(currentTime)}</p>

          <div className='timer-control' onClick={handlePauseToggle}>
            {isClockPaused ?
              <span className="material-symbols-outlined">
                play_circle
              </span>
              :
              <span className="material-symbols-outlined">
                pause_circle
              </span>
            }
          </div>
        </div>
        <h1>Profile Page</h1>

        <div className='user-profile-card'>
          {user &&
            <div className='card-row'>
              <p>Name: <span>{user.name}</span></p>
              <p>Address: <span>{user.address.street} {user.address.city} {user.address.zipcode}</span></p>
              <p>UserName | Catch Phrase: <span>{user.username} | {user.company.catchPhrase}</span></p>
              <p>Email | Phone: <span>{user.email} | {user.phone}</span></p>
            </div>
          }
        </div>

        <div className="user-posts">
          {posts.map((post, index) => (
            <div key={post.id} className="post" onClick={() => handlePostClick(post)}>
              <h4>{post.title}</h4>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPost && <PostModal post={selectedPost} />}

    </section>
  );
};

export default UserDetail;