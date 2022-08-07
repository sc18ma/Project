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
        <table>
          <thead>
            <tr className="query-header">
              <th>Image</th>
              <th className="mid-col">Name</th>
              <th>Current Price</th>
            </tr>
          </thead>
          <tbody>
            {queryResults.auctions.map(queryItem => (
              <QueryItem
                key={queryItem.id}
                queryItem={queryItem}
              />
            ))}
          </tbody>
        </table>
      : null
      }
    </div>
  )

}
export default QueryList;
