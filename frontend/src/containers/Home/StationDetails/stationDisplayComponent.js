import React, { Component, useState } from 'react';
import './stationDisplay.css';
import NotFound from '../../NotFound/notfoundComponent';
import { Card, CardBody, CardTitle, CardText, FormGroup, Form, Input, Button, CardFooter } from 'reactstrap';
import axios from 'axios';
import RenderComment from './renderCommentsComponent/renderComments';
import { withRouter } from 'react-router-dom';

function RenderComments ({list, authorlist, stationName}) {
  if(!list || list.length === 0) {
    return(
      <div className = "col-12 discussion-container">
        <h4 className = "m-4">No comments</h4>
      </div>
    );
  }
  
  console.log(list);
  console.log(authorlist);

  if( !authorlist || authorlist.length === 0) {
    return(
      <div />
    );
  }

  else {
    return(
      <div className = "col-12 discussion-container">
        { list.map((comment) => {
          return(
            <RenderComment 
            key = {comment._id} 
            comment = {comment} 
            authorlist = {authorlist}
            stationName = {stationName} />
          );
        })}    
      </div>
    );
  }
};

class StationDisplay extends Component {
  constructor(props) {
    super(props);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.state = {
      stationDetails: {
        station: {
          name: null,
          discussion: []
        },
        users: []
      },
      stationFound: true,
      commentField: null
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

  handleCommentChange = (event) => {
    this.setState({
      commentField: event.target.value
    });
    console.log(this.state.commentField);
  };

  handleCommentSubmit = async e => {
    e.preventDefault();
    if(document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) {
      const cookies = document.cookie.split('; ');
      const value = cookies.find(item => item.startsWith('jwt')).split('=')[1];
      console.log(value);
      const response = await axios({
        method: 'post',
        url: "/api/" + window.localStorage.getItem("stationNo") + '/' + this.props.match.params.stationName + "/comment" ,
        headers: {
          Authorization: `Bearer ${value}`
        },
        data: {
          data: this.state.commentField
        }
      });
      if(response.status === 200) {
        window.location.reload();
      }
      else {
        alert('Error ' + response.status + ': ' + response.statusText);
      }
    }
    else {
      alert("you must be logged in to comment on stations.");
    }
  }

  render() {
    console.log(this.props);
    console.log(this.state.stationDetails.users);
    if(this.state.stationFound === true) {
      return(
        <div className = "container">
          <h1 className = "col-12 text-center heading">{this.state.stationDetails.station.name}</h1>
          <h4 className = "col-12 text-center heading">Delhi, India</h4>
          <div className = "col-12" >
            <div className = "row text-center">
              <h3 className = "col-12 sub-heading">CGPA cutoffs for respective campuses</h3>
            </div>
            <div className = "row mt-3">
              <div className = "col-4">
                <Card className = "cg-card">
                  <CardBody className = "text-center d-flex align-items-center justify-content-center">
                    <div>
                      <CardTitle><h3>Pilani campus</h3></CardTitle>
                      <CardText><h5>9.07</h5></CardText>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className = "col-4">
                <Card className = "cg-card">
                  <CardBody className = "text-center d-flex align-items-center justify-content-center">
                    <div>
                      <CardTitle><h3>Goa campus</h3></CardTitle>
                      <CardText><h5>8.34</h5></CardText>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className = "col-4">
                <Card className = "cg-card">
                  <CardBody className = "text-center d-flex align-items-center justify-content-center">
                    <div>
                      <CardTitle><h3>Hyderabad campus</h3></CardTitle>
                      <CardText><h5>7.58</h5></CardText>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
          <div className = "col-12">
            <div className = "row text-center">
              <h3 className = "col-12 sub-heading">Discussion</h3>
              <RenderComments list = {this.state.stationDetails.station.discussion} 
               authorlist = {this.state.stationDetails.users}
               stationName = {this.props.match.params.stationName} />
            </div>
          </div>
          <div class = "col-12">
            <Form autoComplete = "off">
              <FormGroup row>
                <Input type = "text"
                 name = "data"
                 id = "data"
                 className = "col-10"
                 onChange = {(event) => {this.handleCommentChange(event) }}>
                </Input>
                <div className = "col-2">
                  <Button onClick = {(event) =>{this.handleCommentSubmit(event)}} type = "submit">Post Comment</Button>
                </div>
              </FormGroup>
            </Form>  
          </div>
        </div>
      );
    }
    else {
      return(
        <NotFound />
      );
    }
  };
};

export default withRouter(StationDisplay);