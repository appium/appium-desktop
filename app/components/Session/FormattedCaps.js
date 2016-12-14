import React, { Component } from 'react';
import formatJSON from 'format-json';
import SessionCSS from '../Session.css';
import { getCapsObject } from '../../actions/Session.js';

export default class NewSessionForm extends Component {

  getFormattedJSON (caps) {
    return formatJSON.plain(getCapsObject(caps));
  }

  render () {
    const {caps} = this.props;
    return caps && <textarea rows={15} 
      className={SessionCSS['formatted-caps']}
      onChange={() => {}} 
      value={this.getFormattedJSON(caps)} 
    />;
  }
}