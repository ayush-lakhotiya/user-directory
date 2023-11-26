import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserCard from './UserCard';
import './UserDirectory.scss'

const UserDirectory = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  return (
    <section className='directory-wrapper'>
        <div className='directory-container'>
            <h1>User Directory</h1>
            {users.map((user) => (
                <Link key={user.id} to={`/user/${user.id}`} className='post-card'>
                <UserCard user={user} />
                </Link>
            ))}
        </div>
    </section>
  );
};

export default UserDirectory;
