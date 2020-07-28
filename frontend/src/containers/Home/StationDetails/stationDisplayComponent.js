import React, { Component } from 'react';
import './stationDisplay.css';
import NotFound from '../../NotFound/notfoundComponent';

class StationDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationDetails: {},
      stationFound: true
    }
  }
  
  async componentDidMount() {
    const query = this.props.match.params.stationName;
    try {
      const response = await fetch('/api/' + window.localStorage.getItem("stationNo") + '/' + query);
      if(response.ok) {
        const json = await response.json();
        this.setState({
          stationDetails: json,
          stationFound: true
        });
      }
      else if(response.status === 404) {
        this.setState({
          stationFound: false
        })
      }
      else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        this.setState({
          stationFound: false
        });
        throw error;
      }
    } catch(error) {
      alert("could not fetch Station Details.\nError: "+ error.message);
    }
  }

  render() {
    console.log(this.props);
    if(this.state.stationFound === true) {
      return(
        <h1>Hola</h1>
      );
    }
    else {
      return(
        <NotFound />
      );
    }
  };
};

export default StationDisplay;