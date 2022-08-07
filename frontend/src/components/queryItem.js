import React from "react";
import { useNavigate } from "react-router-dom";

import placeholder from "../images/placeholder.jpg";

const QueryItem = (props) => {

  const navigate = useNavigate();
  const { id, image, item, starting_price, highest_bid } = props.queryItem

  // Redirects to an auction page with parameter based on the list item clicked
  const handleClick = () => {
    navigate({ pathname: "/auction", search: "?" + new URLSearchParams({id: id}).toString() })
  }

  return (
    <tr className="query-item" onClick={handleClick}>
      <td>
        {image ? <img src={image} /> : <img src={placeholder} />}
      </td>
      <td className="mid-col">
        {item}
      </td>
      <td>
        { highest_bid ? "£" + highest_bid.bid : "£" + starting_price }
      </td>
    </tr>
  )

}
export default QueryItem;
