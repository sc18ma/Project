import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import tokenRefresh from "../functions/tokenRefresh";

const Auction = props => {

  const [params] = useSearchParams();
  const [auction, setAuction] = useState({ id: "", item: "", description: "", created_by: "", starting_price: "", duration: "", highest_bid: "" });
  const [bid, setBid] = useState({ bid: "" })

  // Function to fetch the auction details from the backend
  function getAuction() {
    fetch('http://localhost:8000/api/get_auction/' + window.location.search, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Something went wrong!');
    })
    .then(data => {
      // Checks if there's an existing bid to store retrieved data correctly
      { data.highest_bid ?
        setAuction({
          id: data.id,
          item: data.item,
          description: data.description,
          created_by: data.created_by,
          starting_price: data.starting_price,
          duration: data.duration,
          highest_bid: data.highest_bid.bid
        })
        :
        setAuction({
          id: data.id,
          item: data.item,
          description: data.description,
          created_by: data.created_by,
          starting_price: data.starting_price,
          duration: data.duration,
        })
      }

    })
    .catch(error => {
      alert(error);
    });
  }

  // Whenever the parameter int he URL is changed, the correct auction is retrieved from the backend
  useEffect(() => {
    if (params.get('id')) {
      getAuction();
    }
  }, [params]);

  // Standard react input field handling
  const onChange = e => {
    setBid(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Validation for making new bids
    if (bid.bid == "") {
      alert("Please enter a price.");
      return;
    }
    if (bid.bid <= auction.highest_bid) {
      alert("The price entered need to be higher than the current price.")
      setBid({ bid: "" })
      return;
    }

    // Refreshes the access token before making a new bid
    if (await tokenRefresh()) {
      fetch('http://localhost:8000/api/create/bid/', {
        method: 'POST',
        headers: {
          Authorization: `JWT ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          auction: auction.id,
          bid: bid.bid
        })
      })
      alert("You bid £" + bid.bid)
      setBid({ bid: "" })
      getAuction()
    } else {
      alert("Something went wrong")
    }
  }

  return (
    <div className="content">
      <h1>{ auction.item }</h1>

      <div className="description">
        Description:
        <p>{ auction.description }</p>
      </div>

      <div className="bid-window">

        Current Price: £{ auction.highest_bid ? auction.highest_bid : auction.starting_price }

        { props.loggedIn ?

          <form onSubmit={handleSubmit} className="bid-form">

            £<input className="bid-input" name="bid" type="text" value={bid.bid} onChange={onChange}/>


            <button className="bid-submit">
              Place Bid
            </button>

          </form>

          :
          <p className="warning">To bid on an auction you need to be logged in.</p>
        }

      </div>

    </div>
  )

}
export default Auction;
