import React, { Component } from 'react';
import { Navbar, Nav, NavItem, FormGroup, Form, Input, Button } from 'reactstrap';
import "./searchNav.css";
import { Redirect } from 'react-router-dom';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchField: null,
      router: false
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.preventSearch = this.preventSearch.bind(this);
  }
  
  handleSearch = (event) => {
    this.setState({
      searchField: event.target.value
    });
  }

  preventSearch = (event) => {
    event.preventDefault();
    this.setState({
      router: true
    });
  }
  
  render() {
    return(
      <div className = "row row-search align-items-center">
        <div className = "col-8 offset-2 justify-content-center">
          <Form>
            <FormGroup row>
              <Input type = "text"
               className = "col-8 offset-1"
               onChange = {(event) => { this.handleSearch(event) } } />
               &nbsp;
              <Button onClick = { (event) => { this.preventSearch(event) } } 
               type = "submit" 
               className = "btn btn-success col-2">Search</Button>
            </FormGroup>
          </Form>
          { this.state.router ? 
            <Redirect to = { "/" + window.localStorage.getItem("stationNo") + "/home?Search=" + this.state.searchField } />
          : null}
        </div>
      </div>
    );
  }
};

export default SearchBar;