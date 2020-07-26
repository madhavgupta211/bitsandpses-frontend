import React from 'react';
import './chooser.css';
import { Link, Redirect } from 'react-router-dom';

function Choose () {
  const storedChoice = parseInt(window.localStorage.getItem("stationNo"));
  if(storedChoice === 1 || storedChoice === 2) {
    return(
      <Redirect to =  { "/" + storedChoice } />
    );
  }
  else {
    return(
      <div>
        <Link className = "btn btn-primary" to = { '/' + 1 }>PS1</Link>&nbsp;
        <Link className = "btn btn-primary" to = { '/' + 2 }>PS2</Link>
      </div>
    );
  }
};

export default Choose;