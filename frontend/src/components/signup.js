import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Signup = props => {
  let navigate = useNavigate();

  const [user, setUser] = useState({username: "", email: "", password: ""})

  // Standard react input field handling
  const onChange = e => {
    setUser(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }


  // Creates a new user in the backend
  const handleSubmit = e => {
    e.preventDefault()
    if (user.password.length < 8) {
      alert("The password must be at least 8 characters.")
      setUser({ username: user.username, email: user.email, password: "" })
      return;
    }
    fetch('http://localhost:8000/api/create/user/', {
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
    .then(() => {
      navigate("/");
    })
    .catch(error => {
      alert(error);
    });

  }


  return (
    <div className="content">
      <div className="form-content">
        <h1>Signup</h1>
        <form onSubmit={handleSubmit}>

          <label>Username:</label>
          <input name="username" type="text" value={user.username} onChange={onChange}/>

          <label>Email:</label>
          <input name="email" type="email" value={user.email} onChange={onChange}/>

          <label>Password:</label>
          <input name="password" type="password" value={user.password} onChange={onChange}/>

          <input type="submit" value="Submit"/>

        </form>
      </div>
    </div>
  )

}
export default Signup;
