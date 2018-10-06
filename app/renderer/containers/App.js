import { Component, PropTypes } from 'react';

export default class App extends Component {
  render () {
    return this.props.children;
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired
};