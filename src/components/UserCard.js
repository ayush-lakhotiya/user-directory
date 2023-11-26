import React, { useEffect, useState } from 'react';

const UserCard = ({ user }) => {
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
      .then((response) => response.json())
      .then((data) => setPostCount(data.length))
      .catch((error) => console.error('Error fetching posts:', error));
  }, [user.id]);

  return (
    <div className="user-card">
      <div className="user-info">
        <p>Name:<span>{user.name}</span></p>
        <p>Posts:<span>{postCount}</span></p>
      </div>
    </div>
  );
};

export default UserCard;