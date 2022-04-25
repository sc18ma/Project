import React from "react";
import { Link, useNavigate } from "react-router-dom";

const LoggedInNav = props => {

  let navigate = useNavigate();

  // Function to handle logging out (blacklist the refresh token on the backend)
  const logOut = () => {
    fetch('http://localhost:8000/api/token/blacklist/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh: localStorage.getItem('refresh_token')})
    }).then(data => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      props.setLogin(false);
      navigate("/");
    });
  }

  return (
    <div>
      <nav>
        <li>
          <Link className={"nav-link"} to={"/"}>Home</Link>
        </li>
        <li>
          <Link className={"nav-link"} to={"/create-auction/"}>Create Auction</Link>
        </li>
        <li onClick={logOut}>
          <a>Log Out</a>
        </li>
      </nav>
    </div>
  )

}
export default LoggedInNav;
