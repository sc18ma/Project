import React from "react";
import { Link } from "react-router-dom";

const LoggedOutNav = () => {

  return (
    <div>
      <nav>
        <li>
          <Link className={"nav-link"} to={"/"}>Home</Link>
        </li>
        <li>
          <Link className={"nav-link"} to={"/login/"}>Login</Link>
        </li>
        <li>
          <Link className={"nav-link"} to={"/signup/"}>Signup</Link>
        </li>
      </nav>
    </div>
  )

}
export default LoggedOutNav;
