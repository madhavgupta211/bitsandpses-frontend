import React, { Component } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import "./homed.css";
import axios from 'axios';
import { Link } from 'react-router-dom';

function ListDisplay ({list}) {
  console.log(list);
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
              <li><Link to = { '/' + window.localStorage.getItem("stationNo") + '/station/' + item.slug} >{item.name}</Link></li>
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
    let stationChoice = window.localStorage.getItem("stationNo");
    let color = null;
    if(stationChoice === "1") {
      color = "green";
    }
    else if(stationChoice === "2") {
      color = "blue";
    }
    return(
      <div className = "envelope">
        <div className = "container">
          <div className = "row row-contents justify-content-center">
            <div className = { "col-11 search-box-" + color }>
              <h1 className = "search-heading text-left text-md-center">Search.</h1>
              <h6 className = "search-sub-text text-left text-md-center d-none d-md-block">
              Find the station you are looking for according to the priorities you set.<br />
              Search by name or location, filter according to your preferences.
              </h6>
              <h6 className = "search-sub-text text-left text-md-center d-block d-md-none">
              We will try to find what you are looking for
              </h6>
              <div className = "search-bar-hold">
                <Form className = "row ">
                  <div className = "col-12 col-md-8 offset-md-1 text-left text-md-center padding-remover">
                  <Input type = "text"
                    name = "Search"
                    defaultValue = { this.findplaceholder() }
                    placeholder = "Search"
                    className = "home-search-bar"
                    onChange = { (event) => {this.storeSearch(event)}} />
                  </div>
                  <div className = "col-12 col-md-2 text-left text-md-center padding-remover">
                    <Button className = "search-button mt-3 mt-md-0" onClick = {(event) => { this.handleEmptytype(event) }} type = "submit" >{">>>"}</Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className = "container d-none d-lg-block">
          <div className = "row row-contents justify-content-center align-items-start">
            <div className = "col-4 filter-box">
              <h1 className = "text-left filter-heading">Filters<br /><br /><br /><br /><br />
              </h1>
            </div>
            <div className = "col-6 offset-1 results-box">
              <div>
                <ListDisplay list = {this.state.searchData} />
              </div>
            </div>
          </div>
        </div>
        <div className = "row row-contents d-block d-lg-none">
          <h1 className = "filter-box-small">Filters</h1>
        </div>
        <div className = "container">
          <div>
            <ListDisplay list = {this.state.searchData} />
          </div>
        </div>
      </div>
    );
  }
};

export default Homed;