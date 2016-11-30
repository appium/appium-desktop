import React, { Component, PropTypes } from 'react';
import styles from './Session.css';

export default class Inspector extends Component {
  constructor (props) {
    super(props);
    this.state = {
      
    };
  }

  static propTypes = {
    newSession: PropTypes.func,
  }

  componentWillUpdate () {
  }

  componentDidUpdate () {
  }

  render () {
    // const { } = this.props;

    return (
      <div className={styles.container}>
        <div>Hello!</div>
      </div>
    );
  }
}
