import React, { Component } from 'react';
import formatJSON from 'format-json';

export default class NewSessionForm extends Component {

  getCapsObject (caps) {
    let capsObject = {};
    caps.forEach((cap) => cap.name ? capsObject[cap.name] = cap.value : '');
    return capsObject;
  }

  getFormattedJSON (caps) {
    return formatJSON.plain(this.getCapsObject(caps));
  }

  render () {
    const {caps} = this.props;
    return caps && <textarea rows={15} style={{padding: '4px', width: '100%', backgroundColor: '#d3d3d3'}} onChange={() => {}} value={ this.getFormattedJSON(caps) } />
  }
}