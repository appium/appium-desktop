import React, { Component } from 'react';
import moment from 'moment';
window.moment = moment;

export default class SavedSessions extends Component {

  render () {
    const {savedSessions, setCaps} = this.props;

    return (
      <ul>
        {savedSessions && [...savedSessions].reverse().map((session, index) => {
          return <li key={index}>
            <a href='#' onClick={(e) => {e.preventDefault(); setCaps(session.caps);} }>
              {session.name || 'Untitled'}
              &nbsp;&nbsp;
              {`(${moment(session.date).format('YYYY-MM-DD')})`}
            </a>
          </li>;
        })}
        </ul>
    );
  }
}