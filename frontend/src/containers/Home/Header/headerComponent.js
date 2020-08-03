import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, Input, Button, Form, FormGroup, NavbarToggler, Collapse } from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import './header.css';

class Header extends Component {

  constructor(props) {
    super(props);
    this.loginHandle = this.loginHandle.bind(this);
    this.handlelogout = this.handlelogout.bind(this);
    this.displayStationButton = this.displayStationButton.bind(this);
    this.state = {
      userLoggedin: true,
      isNavOpen: false
    };
  }

  toggleNav = () => {
    this.setState({
      isNavOpen: !this.state.isNavOpen
    });
  }
  
  displayStationButton = (num,color) => {
    if(parseInt(window.localStorage.getItem("stationNo")) === num)
    {
      return(
        <Button className = { "toggle-head-" + color } >PS{num}</Button>
      );
    }
    else {
      return(
        <Link to = { '/' + num + '/home' } className = "btn toggle-head-grey">PS{num}</Link>
      );
    }
  }
  
  handlelogout = async() => {
    try {
      const cookies = document.cookie.split('; ');
      const value = cookies.find(item => item.startsWith('jwt')).split('=')[1];
      const response = await axios({
        url: window.location.origin + '/auth/logout',
        method: 'post',
        headers: {
          Authorization: `Bearer ${value}`
        }
      })

      if(response.status === 200) {
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.sessionStorage.setItem("loggedin","0");
        this.setState({
          userLoggedin: false
        });
        alert("you have been logged out");
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    } catch(error) { 
      alert("could not logout.\nError: "+ error.message);
    }; 
  };
  
  loginHandle = ({color}) => {
    if (document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) {
      window.sessionStorage.setItem("loggedin","1");
    }
    if(window.sessionStorage.getItem("loggedin") === "1")
    {
      return(
        <Button className = {"btn nav-linker-" + color} onClick = {this.handlelogout}>LOGOUT</Button>  
      );
    }
    else {
      console.log(color);
      return(
        <a href = "/auth/google" className = {"nav-linker-" + color}>LOGIN</a>
      );
    }
  };
  
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
      <Navbar light className = "white-bg-navbar" expand = "md">
        <div className = "container">
          <NavbarBrand className = "mr-auto"><NavLink to = {this.props.urlinfo.url + '/home'} className = "text-decoration-none" >
            <h1 className = "navbrand-title">  
              <span className = "green">BITS</span>
              <span className = "dark-grey">and</span>
              <span className = "blue">PS</span>
              <span className = "dark-grey">es</span>  
            </h1>
          </NavLink></NavbarBrand>
            <div className = "m-2 ml-auto toggler-background">
              {this.displayStationButton(1,color)}
              &nbsp;
              {this.displayStationButton(2,color)}
            </div>
            <NavbarToggler onClick = {this.toggleNav} className = "nav-toggler" />
            <Collapse isOpen = {this.state.isNavOpen} navbar className="flex-grow-0">
              <Nav navbar>
                <NavItem className = "d-flex align-items-center nav-items">
                  <NavLink className = {"nav-linker-" + color} to = {this.props.urlinfo.url + '/home'} >HOME</NavLink>
                </NavItem>
                <NavItem className = "d-flex align-items-center nav-items">
                  <NavLink className = {"nav-linker-" + color} to = {this.props.urlinfo.url + '/contact'}>CONTACT US</NavLink>
                </NavItem>
                <NavItem className = "d-flex align-items-center nav-items">
                  <this.loginHandle color = {color}/>
                </NavItem>
              </Nav>
            </Collapse>
            
        </div>
      </Navbar>
    );
  }

};

export default Header;
