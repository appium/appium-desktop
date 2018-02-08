import React, { Component } from 'react';
import PlaybackStyles from './PlaybackLibrary.css';

export default class SavedTests extends Component {

  render () {
    const {tests} = this.props;

    if (!tests.length) {
      return <div className={PlaybackStyles.noTests}>
        You don't have any tests that can be run. Launch an Inspector session and record a test first!
      </div>;
    }
  }
}
