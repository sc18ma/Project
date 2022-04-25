import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = props => {
  let navigate = useNavigate();
  const [user, setUser] = useState({username: "", password: ""})

  // Standard react input field handling
  const onChange = e => {
    setUser(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  // Fetches JWT tokens from the backend
  const handleSubmit = e => {
    e.preventDefault()
    fetch('http://localhost:8000/api/token/obtain/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Something went wrong!');
    })
    .then(data => {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      props.setLogin(true);
      navigate("/");
    })
    .catch(error => {
      alert(error);
    });
  }


  return (
    <div className="content">

      <div className="form-content">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>

          <label> Username:</label>
          <input name="username" type="text" value={user.username} onChange={onChange}/>

          <label>Password:</label>
          <input name="password" type="password" value={user.password} onChange={onChange}/>

          <input type="submit" value="Submit"/>

        </form>
      </div>
    </div>
  )

}

export default Login;
