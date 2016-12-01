import React, { Component } from 'react';
import moment from 'moment';
window.moment = moment;

export default class SavedSessions extends Component {

  componentDidMount () {
    this.props.getSavedSessions();
  }

  render () {
    const {savedSessions, setCaps} = this.props;

    return (
      <ul>
        {savedSessions && [...savedSessions].reverse().map((session, index) => {
          let dcaps = session.desiredCapabilities || {};
          return <li key={index}>
            <a href='#' onClick={(e) => {e.preventDefault(); setCaps(dcaps);} }>
              {moment(session.date).format('YYYY-MM-DD')}&nbsp;&nbsp;
              {dcaps.platformName}
            </a>
          </li>;
        })}
        </ul>
    );
  }
}