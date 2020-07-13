import React, { useState, useEffect } from 'react';
import './App.css';


const Users = () => {
  const [users, setUsers] = useState([]);

  async function fetchData() {
    const result = await fetch('/api/users');
    result
      .json()
      .then(result => setUsers(result));
  }

  useEffect(() => {
    fetchData();
  });

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>
          {u.first_name}
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <div className="App">
      Test
        <Users/>
    </div>
  );
}
export default App;
  
 