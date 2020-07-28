import React, { Component } from 'react';
import './stationDisplay.css';
import NotFound from '../../NotFound/notfoundComponent';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';

function RenderComments ({list, authorlist}) {
  if(!list || list.length === 0) {
    return(
      <div />
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
        
          {list.map((comment) => {
              function matchid (author) {
                return comment.comment.user === author._id;
              }
              const author = authorlist.find(matchid);
              const authorName = author.name;
              return(
                <div key = {comment._id}>
                  <Card className = "col-8 my-4">
                    <CardBody>
                      <CardTitle className = "text-left">{authorName}</CardTitle>
                      <CardText className = "text-left">{comment.comment.data}</CardText>
                    </CardBody>
                  </Card>
                  <div className = "col-4" />
                  { comment.comment.replies.map((reply) => {
                      function matchreply (author) {
                        return reply.user === author._id;
                      }
                      const repauthor = authorlist.find(matchreply);
                      const repauthorName = repauthor.name;
                      return(
                        <div key = {reply._id}>
                          <Card className = "col-8 offset-1 my-4">
                            <CardBody>
                              <CardTitle className = "text-left">{repauthorName}</CardTitle>
                              <CardText className = "text-left">{reply.data}</CardText>
                            </CardBody>
                          </Card>
                          <div className = "col-3" />
                        </div>
                      );
                    })}
                </div>
              );
            })}
        </div>
    );
  }
};

class StationDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationDetails: {
        station: {
          name: null,
          discussion: []
        },
        users: []
      },
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
              <RenderComments list = {this.state.stationDetails.station.discussion} authorlist = {this.state.stationDetails.users} />
            </div>
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

export default StationDisplay;