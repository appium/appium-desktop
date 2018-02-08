import React, { Component } from 'react';
import PlaybackStyles from './PlaybackLibrary.css';

export default class TestResults extends Component {

  render () {
    const {testResults} = this.props;

    if (!testResults.length) {
      return <div className={PlaybackStyles.noTests}>
        You don't have any test results. Run some tests and the results will show up here.
      </div>;
    }
  }
}
