import React, { Component, PropTypes } from 'react';
import { Window, Content } from 'react-photonkit';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render () {
    return (
      <Window>
        <Content>
          {this.props.children}
        </Content>
      </Window>
    );
  }
}
