import React, { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

import { FaSearch } from "react-icons/fa"

import QueryList from "./queryList";

const Home = props => {

  const navigate = useNavigate();
  const [query, setQuery] = useState({search: ""});

  // Standard react input field handling
  const onChange = e => {
    setQuery(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  // Adds search parameters when a user uses the seacrh bar
  const handleSubmit = e => {
    e.preventDefault()
    navigate({ pathname: "/", search: `${createSearchParams(query)}`})
  }


  return (
    <div className="content">
      <h1>Web Auction Project</h1>
      { props.loggedIn ? <h3>Welcome, {props.user.username}</h3> : null }

      <div className="center">
        <form onSubmit={handleSubmit} className="search-bar">

          <input className="search-input" name="search" type="text" placeholder="Search auctions..." value={query.search} onChange={onChange}/>


          <button className="search-submit">
            <FaSearch
              style={{ color: "black", fontSize: "20px", marginTop: "2px" }}
            />
          </button>

        </form>
      </div>

      <QueryList />

    </div>
  )

}
export default Home;
