import { Component } from 'react';
import PropTypes from 'prop-types';

export default class App extends Component {
  render () {
    return this.props.children;
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired
};