import React, { Component } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import "./homed.css";
import axios from 'axios';

class Homed extends Component {
  constructor(props) {
    super(props);
    this.findplaceholder = this.findplaceholder.bind(this);
    this.displayResults = this.displayResults.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
  }
  
  fetchResults = async() => {
    try {
      const query = this.props.location.search.split('=')[1];
      const response = await axios({
        url: '/api/' + window.localStorage.getItem("stationNo") + '/search?name=' + query,
        method: 'get'
      });
      if(response.status === 200) {
        return response;
      }
      else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    }
    catch(error) {
      alert("could not fetch search results.\nError: "+ error.message);
    }
  }

  findplaceholder = () => {
    if( this.props.location.search !== "") {
      return this.props.location.search.split("=")[1];
    }
    else {
      return null;
    }
  };

  displayResults = () => {
    if(this.props.location.search !== "") {
      const results = this.fetchResults();
      let list = results.map((item) => item.name);
      return(
        <div className = "row-content">
          <h2>Search results :</h2>
          <ul className = "list-unstyled">
            {  
              list.map((item) => {
                return(
                  <li>{item}</li>
                );
              })
            }
          </ul>
        </div>
      );
    }
    else {
      return(
        <div />
      );
    }
  }

  render() {
    console.log(this.props);
    return(
      <div>
        <h5>Search Ps station:</h5>
        <Form className = "row" inline>
          <FormGroup className = "col-8 offset-2">
            <Input type = "text"
             name = "Search"
             defaultValue = { this.findplaceholder() }
             placeholder = "Search"
             className = "col-5 offset-2" />
            <Button type = "submit" className = "offset-1 col-2" >Search</Button>
          </FormGroup>
        </Form>
        {this.displayResults() }
      </div>
    );
  }
};

export default Homed;