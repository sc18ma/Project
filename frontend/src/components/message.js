import React from "react";


const Message = (props) => {

  const { id, message } = props.message



  return (
    <li className="message">
        {message}
    </li>
  )

}
export default Message;
