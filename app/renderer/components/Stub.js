import React, { Component } from 'react';

export default class Stub extends Component {

  render () {
    const { someProp } = this.props;

    return <div>
      Hello {someProp}!
    </div>;
  }
}
