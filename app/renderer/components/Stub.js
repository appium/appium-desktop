import React, { Component } from 'react';

export default class Stub extends Component {

  render () {
    const { someProp, t } = this.props;

    return <div>
      {t('Hello')} {someProp}!
    </div>;
  }
}
