import React, { Component } from 'react';
import "./home.css";
import { Route } from 'react-router-dom';
import NotFound from '../NotFound/notfoundComponent';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let stationNo = parseInt(this.props.match.params.stationNo);
    window.localStorage.setItem("stationNo",stationNo.toString(10));
    if(stationNo === 1 || stationNo === 2) {
      return(
        <h1>{stationNo}</h1>
      );
    }
    else {
      return(
        <Route component = {NotFound} />
      );
    }
  }
};

export default Home;