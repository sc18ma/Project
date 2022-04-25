import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import './App.css';

import Login from "./components/login";
import Signup from "./components/signup";
import Home from "./components/home";
import LoggedOutNav from "./components/loggedOutNav";
import LoggedInNav from "./components/loggedInNav";
import Auction from "./components/auction";
import CreateAuction from "./components/createAuction";

import tokenRefresh from "./functions/tokenRefresh";

const App = () => {

  const [loggedIn, setLoggedIn] = useState()
  const [user, setUser] = useState({id: "", username: "", email: ""})

  // A function to fetch user data from the backend
  // Uses async to ensure the token is refreshed before attempting to fetch user data
  async function getUser() {
    // First tries to refresh the access token using the function in './functions/tokenRefresh.js'
    if (await tokenRefresh()) {
      await fetch('http://localhost:8000/api/get_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('access_token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser({ id: data.id, username: data.username, email: data.email });
      });
    }
    else {
      // If the token couldn't be refreshed then we ensure the user is logged out
      await fetch('http://localhost:8000/api/token/blacklist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: localStorage.getItem('refresh_token')})
      }).then(data => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setLogin(false);
      });
    }
  }

  // Runs upon mounting
  // Allows the user to be automatically log in between new sessions
  useEffect(() => {
    if (localStorage.getItem('refresh_token')) {
      setLoggedIn(true);
    };
  }, [])

  // Get the user info upon each log in
  useEffect(() => {
    // Stops from getUser() being called a second time on mounting if a user is still logged in
    if (loggedIn === !null) {
      if (localStorage.getItem('refresh_token')) {
        getUser();
      };
    };
  }, [loggedIn])


  const setLogin = (login) => {
    setLoggedIn(login);
  };



  return(
    <div className="site">
      { loggedIn ? <LoggedInNav loggedIn={loggedIn} setLogin={setLogin} /> : <LoggedOutNav /> }
      <main>
        <Routes>
          <Route path="/login/" element={<Login setLogin={setLogin} />}/>
          <Route path="/signup/" element={<Signup />}/>
          <Route path="/auction/" element={<Auction loggedIn={loggedIn} />}/>
          <Route path="/create-auction/" element={<CreateAuction loggedIn={loggedIn} userId={user.id} />}/>
          <Route path="*" element={<Home loggedIn={loggedIn} user={user} />}/>
        </Routes>
      </main>
    </div>
  );

}

export default App;
