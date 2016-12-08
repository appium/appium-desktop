import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './Session.css';

export default class Inspector extends Component {

  componentWillMount () {
    this.props.applyClientMethod('source');
  }

  render () {
    const { goBackToNewSessionPage, source } = this.props;

    return (
      <div className={styles.container}>
        <pre>{source}</pre>
        <Button onClick={goBackToNewSessionPage}>Go Back</Button>
      </div>
    );
  }
}
