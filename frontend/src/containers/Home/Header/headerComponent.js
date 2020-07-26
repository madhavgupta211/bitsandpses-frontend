import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, Input, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

class Header extends Component {

  constructor(props) {
    super(props);
    this.loginHandle = this.loginHandle.bind(this);
    this.handlelogout = this.handlelogout.bind(this);
    this.state = {
      userLoggedin: true
    };
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
  
  loginHandle = () => {
    if (document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) {
      window.sessionStorage.setItem("loggedin","1");
    }
    if(window.sessionStorage.getItem("loggedin") === "1")
    {
      return(
        <Button className = "btn btn-secondary" onClick = {this.handlelogout}>Logout</Button>  
      );
    }
    else {
      return(
        <a href = "/auth/google" className = "btn btn-primary">Login</a>
      );
    }
  };
  
  render() {
    return(
      <Navbar light>
        <NavbarBrand><NavLink to = {this.props.urlinfo.url + '/home'} >Ps Website</NavLink></NavbarBrand>
        <Nav Navbar>
          <NavItem className = "m-2">
            <NavLink className = "btn btn-primary" to = {this.props.urlinfo.url + '/home'} >Home</NavLink>
          </NavItem>
          <NavItem className = "m-2">
            <NavLink className = "btn btn-primary" to = {this.props.urlinfo.url + '/contact'}>Contact Us</NavLink>
          </NavItem>
          <NavItem className = "m-2">
            <this.loginHandle />
          </NavItem>
        </Nav>
      </Navbar>
    );
  }

};

export default Header;
