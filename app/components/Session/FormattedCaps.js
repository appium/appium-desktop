import React, { Component } from 'react';
import formatJSON from 'format-json';
import SessionCSS from '../Session.css';

export default class NewSessionForm extends Component {

  getCapsObject (caps) {
    let capsObj = caps.filter((cap) => cap.name).map((cap) => {
      return {[cap.name]: cap.value};
    });
    return Object.assign({}, ...capsObj);
  }

  getFormattedJSON (caps) {
    return formatJSON.plain(this.getCapsObject(caps));
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