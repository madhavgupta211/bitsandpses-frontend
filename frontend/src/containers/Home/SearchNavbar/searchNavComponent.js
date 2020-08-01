import React, { Component } from 'react';
import { FormGroup, Input, Button, Row } from 'reactstrap';
import "./searchNav.css";
import { Redirect } from 'react-router-dom';
import { LocalForm , Errors, Control } from 'react-redux-form';

const minLength = (len) => (val) => val && (val.length >= len);

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      router: false,
      searchField: null
    };
    this.preventSearch = this.preventSearch.bind(this);
  }

  preventSearch = (values) => {
    this.setState({
      router: true,
      searchField: values.search
    });
  }
  
  render() {
    return(
      <div className = "row row-search align-items-center">
        <div className = "col-8 offset-2 justify-content-center">
          <LocalForm onSubmit = { (values) => { this.preventSearch(values) } }>
            <Row className = "form-group">
              <div className = "col-8 offset-1">
                <Control.text
                model = ".search"
                name = "search"
                id = "search"
                placeholder = "Search for station"
                className = "col-12 form-control"
                validators = { { minLength: minLength(1)} } />
                &nbsp;
                <Errors className = "col-12 text-success text-left"
                 model = ".search"
                 show = "touched"
                 messages = {{
                   minLength: 'Search field is empty'
                 }} />
              </div>
              <Button 
               type = "submit" 
               className = "btn btn-success col-2 align-self-start">Search</Button>
            </Row>
          </LocalForm>
          { this.state.router ? 
            <Redirect to = { "/" + window.localStorage.getItem("stationNo") + "/home?Search=" + this.state.searchField } />
          : null}
        </div>
      </div>
    );
  }
};

export default SearchBar;