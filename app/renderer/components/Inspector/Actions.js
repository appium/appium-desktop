import React, { Component } from 'react';
import { Select, Col, Row } from 'antd';
import InspectorStyles from './Inspector.css';
import MobileCommands from './Actions/MobileCommands';

const {Option} = Select;

export default class Actions extends Component {

  render () {
    const { sessionDetails } = this.props;

    return <div id='actionsContainer' className={InspectorStyles['tree-container']}>
      <MobileCommands {...this.props} />
    </div>;
  }
}
