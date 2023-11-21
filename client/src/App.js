import React, { useState, useEffect } from 'react';
import Amplify, { Auth } from 'aws-amplify';

import './App.css'; // You may need to import your CSS file here

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOL_CLIENT_ID,
  },
});

function App() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const signInUser = async () => {
      try {
        await Auth.signIn('username', 'password'); // Replace with actual username and password
        const session = await Auth.currentSession();
        setAccessToken(session.accessToken.jwtToken);
      } catch (error) {
        console.error(error);
      }
    };

    signInUser();
  }, []);

  const getProtectedData = async () => {
    try {
      const response = await fetch('http://localhost:3001/protected', {
        headers: {
          Authorization: accessToken,
        },
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert('Unauthorized');
    }
  };

  return (
    <div className="App">
      {accessToken ? (
        <div>
          <h1>Welcome!</h1>
          <button onClick={getProtectedData}>Get Protected Data</button>
        </div>
      ) : (
        <div>
          <h1>Authentication Required</h1>
          <p>This page requires authentication. Please wait...</p>
        </div>
      )}
    </div>
  );
}

export default App;
