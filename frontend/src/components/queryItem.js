import React from "react";
import { useNavigate } from "react-router-dom";

const QueryItem = (props) => {

  const navigate = useNavigate();
  const { id, item, starting_price, highest_bid } = props.queryItem

  // Redirects to an auction page with parameter based on the list item clicked
  const handleClick = () => {
    navigate({ pathname: "/auction", search: "?" + new URLSearchParams({id: id}).toString() })
  }

  return (
    <li className="query-item" onClick={handleClick}>
      <div>
        {item}
      </div>
      <div>
        { highest_bid ? "£" + highest_bid.bid : "£" + starting_price }
      </div>
    </li>
  )

}
export default QueryItem;
