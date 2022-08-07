import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import tokenRefresh from "../functions/tokenRefresh";

const CreateAuction = props => {

  const [auction, setAuction] = useState({item: "", image: null, description: "", created_by: props.userId, starting_price: "", duration: ""});
  const navigate = useNavigate();

  // Navigates back to the home page if logged out
  // Prevents from accessing the page through direct url
  useEffect(() => {
    if (props.loggedIn !== true) {
      navigate('/');
    }
  })

  // Standard react input field handling
  const onChange = e => {
    setAuction(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  // Standard react file input field handling
  const onImageChange = e => {
    setAuction(prevState => ({
      ...prevState,
      [e.target.name]: e.target.files[0]
    }));
  }

  async function createAuction() {
    // First tries to refresh the access token using the function in './functions/tokenRefresh.js'
    let auction_form = new FormData();
    auction_form.append('item', auction.item);
    auction_form.append('image', auction.image, auction.image.name);
    auction_form.append('description', auction.description);
    auction_form.append('created_by', auction.created_by);
    auction_form.append('starting_price', auction.starting_price);
    auction_form.append('duration', auction.duration);
    if (await tokenRefresh()) {
      fetch('http://localhost:8000/api/create/auction/', {
        method: 'POST',
        headers: {
          Authorization: `JWT ${localStorage.getItem('access_token')}`,
        },
        body: auction_form
      })
      .then(res => res.json())
      .then(data => {
        alert("Your auction for " + data.item + " has been created successfully.");
      });
      setAuction({item: "", image: null, description: "", starting_price: "", duration: ""});
    } else {
      alert("Something went wrong")
    }
  }

  // Creates a new auction in the backend
  const handleSubmit = e => {
    e.preventDefault();
    createAuction();
  }

  return (
    <div className="content">
      <h1>Create Auction</h1>
      <form className="form-content" onSubmit={handleSubmit}>

        <label>Item Name:</label>
        <input name="item" type="text" value={auction.item} onChange={onChange}/>

        <label>Image:</label>
        <input name="image" type="file" accept="image/png, image/jpeg" onChange={onImageChange}/>

        <label>Starting Price:</label>
        <input name="starting_price" type="text" value={auction.starting_price} onChange={onChange}/>

        <label>Auction Duration:</label>
        <select name="duration" required onChange={onChange}>
          <option value="">--</option>
          <option value="24:00:00">1 Day</option>
          <option value="72:00:00">3 Days</option>
          <option value="120:00:00">5 Days</option>
          <option value="168:00:00">7 Days</option>
          <option value="336:00:00">14 Days</option>
        </select>

        <label>Description:</label>
        <textarea name="description" rows="10" value={auction.description} onChange={onChange}></textarea>

        <input type="submit" value="Submit"/>

      </form>
    </div>
  )

}
export default CreateAuction;
