import React, { Component } from 'react';
import { Alert, Button } from 'antd';
import { remote } from 'electron';

export default class FoundUpdate extends Component {

  render () {
    const {error} = this.props;
    if (!error) {
      return null;
    }

    return <div>
      <Alert type='error' message={error.message || 'An error has occurred. Try again later.'} />
      <Button onClick={() => remote.getCurrentWindow().close()}>Ok</Button>
    </div>;
  }
}
