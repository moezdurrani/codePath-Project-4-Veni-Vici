import React, { useState, useEffect } from "react";
import './App.css';

const App = () => {
  const [data, setData] = useState(null); // Store API data
  const [banList, setBanList] = useState([]); // Store banned attributes
  const [loading, setLoading] = useState(false); // Loading state

  // Function to fetch random user data
  const fetchRandomUser = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://randomuser.me/api/');
      const json = await response.json();
      const user = json.results[0];

      // Check if any attributes are in ban list
      if (!banList.includes(user.nat) && !banList.includes(user.name.first) && !banList.includes(user.location.city)) {
        setData({
          imageUrl: user.picture.large,
          name: `${user.name.first} ${user.name.last}`,
          nationality: user.nat,
          age: user.dob.age,
          location: `${user.location.city}, ${user.location.country}`,
        });
      } else {
        // Recursively call again if the result has banned attributes
        fetchRandomUser();
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  // Handle banning an attribute by clicking on it
  const banItem = (attribute) => {
    if (!banList.includes(attribute)) {
      setBanList([...banList, attribute]);
    }
  };

  // Handle removing an attribute from the ban list
  const removeBanItem = (attribute) => {
    setBanList(banList.filter(item => item !== attribute));
  };

  // Fetch a random user when the app first loads
  useEffect(() => {
    fetchRandomUser();
  }, []);

  return (
    <div className="app">
      <h1>Veni Vici - Discover New Friends</h1>
      <div className="main-container">
        <div className="content">
          <button onClick={fetchRandomUser} disabled={loading}>
            {loading ? "Loading..." : "Show me something new!"}
          </button>

          {/* Display the fetched data */}
          {data && (
            <div className="display-section">
              <div className="info-container">
                <div className="info-box" onClick={() => banItem(data.name)}>
                  <p><strong>Name:</strong> {data.name}</p>
                </div>
                <div className="info-box" onClick={() => banItem(data.nationality)}>
                  <p><strong>Nationality:</strong> {data.nationality}</p>
                </div>
                <div className="info-box" onClick={() => banItem(data.age)}>
                  <p><strong>Age:</strong> {data.age}</p>
                </div>
                <div className="info-box" onClick={() => banItem(data.location)}>
                  <p><strong>Location:</strong> {data.location}</p>
                </div>
              </div>
              <img src={data.imageUrl} alt="Random User" className="display-image" />
            </div>
          )}
        </div>

        {/* Display ban list on the side */}
        {banList.length > 0 && (
          <div className="ban-list-container">
            <div className="ban-list">
              <h3>Banned Attributes (Click to Remove):</h3>
              <ul>
                {banList.map((item, index) => (
                  <li key={index} onClick={() => removeBanItem(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
