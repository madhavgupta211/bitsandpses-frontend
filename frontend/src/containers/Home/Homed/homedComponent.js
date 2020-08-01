import React, { Component } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import "./homed.css";
import axios from 'axios';
import { Link } from 'react-router-dom';

function ListDisplay ({list}) {
  if(list === null) {
    return(
      <div />
    );
  }
  else {
    return(
      <ul className = "list-unstyled">
        {
          list.map((item) => {
            return(
              <li><Link to = { '/' + window.localStorage.getItem("stationNo") + '/station/' + item.station.slug} >{item.station.name}</Link></li>
            );
          })
        }
      </ul>
    );
  }
}

class Homed extends Component {
  constructor(props) {
    super(props);
    this.findplaceholder = this.findplaceholder.bind(this);
    this.handleEmptytype = this.handleEmptytype.bind(this);
    this.state = {
      searchData: null,
      foundResults: false,
      topData: null,
      searchField: ""
    }
  }
  
  async componentDidMount() {
    const query = this.props.location.search.split('=')[1];
    try {
      if(this.props.location.search !== "") {
        const response = await fetch( '/api/' + window.localStorage.getItem("stationNo") + '?name=' + query );
        if(response.ok)
        {
          const json = await response.json();
          this.setState({
            searchData: json
          });
        }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      } else {
        this.setState({
          searchData: null
        })
      }
    } catch(error) {
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

  handleEmptytype = (event) => {
    if(this.state.searchField === null || this.state.searchField === "") {
      event.preventDefault();
    }
  }

  storeSearch = (event) => {
    this.setState({
      searchField: event.target.value
    });
  }

  render() {
    return(
      <div>
        <h5>Search Ps station:</h5>
        <Form className = "row" inline>
          <FormGroup className = "col-8 offset-2">
            <Input type = "text"
             name = "Search"
             defaultValue = { this.findplaceholder() }
             placeholder = "Search"
             className = "col-5 offset-2"
             onChange = { (event) => {this.storeSearch(event)}} />
            <Button onClick = {(event) => { this.handleEmptytype(event) }} type = "submit" className = "offset-1 col-2" >Search</Button>
          </FormGroup>
        </Form>
        <div>
          <ListDisplay list = {this.state.searchData} />
        </div>
      </div>
    );
  }
};

export default Homed;