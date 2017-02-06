import React, { Component } from 'react';
import formatJSON from 'format-json';
import SessionCSS from '../Session.css';
import { Card } from 'antd';
import { getCapsObject } from '../../actions/Session.js';

export default class NewSessionForm extends Component {

  getFormattedJSON (caps) {
    return formatJSON.plain(getCapsObject(caps));
  }

  render () {
    const {caps, title} = this.props;
    return caps && <Card title={title || "JSON Representation"}
      className={SessionCSS['formatted-caps']}
    ><pre>{this.getFormattedJSON(caps)}</pre></Card>;
  }
}
