import React, { Component } from 'react';
import moment from 'moment';
window.moment = moment;

export default class RecentSessions extends Component {

  componentDidMount () {
    this.props.getRecentSessions();
  }

  render () {
    const {recentSessions, setCaps} = this.props;

    return (
      <ul>
        {recentSessions && [...recentSessions].reverse().map((session, index) => {
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