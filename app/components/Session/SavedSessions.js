import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'antd';

export default class SavedSessions extends Component {

  handleDelete (index) {
    return () => {
      if (window.confirm('Are you sure?')) {
        this.props.deleteSavedSession(index);
      }
    };
  }

  render () {
    const {savedSessions, setCaps} = this.props;

    return (
      <ul>
        {savedSessions && [...savedSessions].reverse().map((session, index) => {
          index = savedSessions.length - index - 1;
          let anchorStyle = {display: 'block'};
          return <li key={index}>
            <a href='#' style={anchorStyle} onClick={(e) => {e.preventDefault(); setCaps(session.caps);} }>
              {session.name || 'Untitled'}
              &nbsp;&nbsp;
              {`(${moment(session.date).format('YYYY-MM-DD')})`}
            </a>
            <Button icon='delete' onClick={this.handleDelete(index)}/>
          </li>;
        })}
        </ul>
    );
  }
}