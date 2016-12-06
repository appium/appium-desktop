import React, { Component } from 'react';
import prettyJSON from 'prettyjson';

export default class NewSessionForm extends Component {

  getCapsObject () {
    const { caps } = this.props;
    let capsObject = {};
    caps.forEach((cap) => capsObject[cap.name] = cap.value);
    return capsObject;
  }

  render () {
    const { caps } = this.props;
    return <pre>
        {prettyJSON.render(this.getCapsObject(caps))}
    </pre>;
  }
}