import React, { Component } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import "./homed.css";
import axios from 'axios';

class Homed extends Component {
  constructor(props) {
    super(props);
    this.findplaceholder = this.findplaceholder.bind(this);
    this.displayResults = this.displayResults.bind(this);
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
      return(
        <div className = "row-content">
          <h2>Search results :</h2>

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