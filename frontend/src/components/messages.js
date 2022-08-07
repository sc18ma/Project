import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Message from "./message";

import tokenRefresh from "../functions/tokenRefresh";

const Messages = props => {

  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  async function getMessages() {
    if (await tokenRefresh()) {
      await fetch('http://localhost:8000/api/get_messages/', {
        method: 'GET',
        headers: {
          Authorization: `JWT ${localStorage.getItem('access_token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setMessages(data);
      });
    } else {
      alert("Something went wrong")
    }
  }

  useEffect(() => {
    // Navigates back to the home page if logged out
    // Prevents from accessing the page through direct url
    if (props.loggedIn !== true) {
      navigate('/');
    }
    // Otherwise retrieves a list of messages
    else{
      getMessages();
    }
  }, [])



  return (
    <div className="content">
      <h1>Messages</h1>
      <table className="message-list">
        {messages.map(message => (
          <Message
            key={message.id}
            message={message}
          />
        ))}
      </table>
    </div>
  )

}
export default Messages;
