import React, { Component } from 'react';
import "./home.css";
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import NotFound from '../NotFound/notfoundComponent';
import Header from './Header/headerComponent';
import Homed from './Homed/homedComponent';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let stationNo = parseInt(this.props.match.params.stationNo);
    window.localStorage.setItem("stationNo",stationNo.toString(10));
    if(stationNo === 1 || stationNo === 2) {
      return(
        <div>
          <Header urlinfo = {this.props.match} />
          <Switch>
            <Route path = {this.props.match.url + '/home' } component = {Homed} />
            <Redirect to = {this.props.match.url + '/home'} />
          </Switch>
        </div>
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