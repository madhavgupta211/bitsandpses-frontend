import React, {Component} from 'react';
import { Card, CardBody, CardTitle, CardText, Button, Input, Form, FormGroup } from 'reactstrap';
import axios from 'axios';

class RenderComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayReplyform: false,
      replyField: null
    }
    this.matchid = this.matchid.bind(this);
    this.handleReplier = this.handleReplier.bind(this);
  }

  matchid = (author) => {
    return this.props.comment.comment.user === author._id;
  };

  handleReplier = (value) => {
    this.setState({
      displayReplyform: value
    })
  };

  handleReplyChange = (event) => {
    this.setState({
      replyField: event.target.value
    });
  };

  handleReplySubmit = async(event) => {
    event.preventDefault();
    if(document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) {
      const cookies = document.cookie.split('; ');
      const value = cookies.find(item => item.startsWith('jwt')).split('=')[1];
      console.log(value);
      const response = await axios({
        method: 'post',
        url: "/api/" + window.localStorage.getItem("stationNo") + '/' + this.props.stationName + "/" + this.props.comment._id + "/reply" ,
        headers: {
          Authorization: `Bearer ${value}`
        },
        data: {
          data: this.state.replyField
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
  };

  render() {
    const author = this.props.authorlist.find(this.matchid);
    const authorName = author.name;
    return(
      <div>
        <Card className = "col-8 my-4">
          <CardBody>
            <CardTitle className = "text-left">{authorName}</CardTitle>
            <CardText className = "text-left">{this.props.comment.comment.data}</CardText>
            <CardText className = "text-right">
              <Button className="btn btn-success" onClick = {() => { this.handleReplier(true)} }>Reply</Button>
            </CardText>
          </CardBody>
        </Card>
        <div className = "col-4" />
        { this.props.comment.comment.replies.map((reply) => {
          function matchreply(author) {
            return reply.user === author._id ;
          }
          const repauthor = this.props.authorlist.find(matchreply);
          const repauthorname = repauthor.name;
          return(
            <div>
              <Card className = "col-8 offset-1 my-4">
                <CardBody>
                  <CardTitle className = "text-left">{ repauthorname }</CardTitle>
                  <CardText className = "text-left">{ reply.data }</CardText>
                  <CardText className = "text-right">
                    <Button className = "btn btn-success" onClick = { () => { this.handleReplier(true)} }>Reply</Button>
                  </CardText>
                </CardBody>
              </Card>
              <div className = "col-3" />
            </div>
          );
        })}
        { this.state.displayReplyform ? 
          <div>
            <div className = "col-8 offset-1">
              <Form autoComplete = "off">
                <FormGroup row>
                  <Input type = "text"
                    name = "data"
                    id = "data"
                    placeholder = "post your reply"
                    className = "col-10"
                    onChange = {(event) => { this.handleReplyChange(event) }}
                  />
                  <Button onClick = {(event) => { this.handleReplySubmit(event) }} className = "col-2" type = "submit">Post reply</Button>
                </FormGroup>
              </Form>
            </div>
            <div className = "col-3" />
          </div>
        : null}
      </div>
    );
  }
}

export default RenderComment;

