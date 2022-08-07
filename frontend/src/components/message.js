import React from "react";


const Message = (props) => {

  const { id, message } = props.message



  return (
    <tr className="message">
        <td>{message}</td>
    </tr>
  )

}
export default Message;
