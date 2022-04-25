import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import QueryItem from "./queryItem";

const QueryList = () => {

  const [queryResults, setQueryResults] = useState({ auctions: [], })
  const [queryParams] = useSearchParams();

  // Fetches a list of auctions based on search parameters from the backend
  useEffect(() => {
    if (queryParams.get('search')) {
      fetch('http://localhost:8000/api/search/auction/' + window.location.search, {
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
        const searchData = data;
        setQueryResults({ auctions: searchData });
      })
      .catch(error => {
        alert(error);
      });
    }
  }, [queryParams]);




  return (
    <div className="query-list">
      {queryParams.get('search') ?
        <ul>
          {queryResults.auctions.map(queryItem => (
            <QueryItem
              key={queryItem.id}
              queryItem={queryItem}
            />
          ))}
        </ul>
      : null
      }
    </div>
  )

}
export default QueryList;
