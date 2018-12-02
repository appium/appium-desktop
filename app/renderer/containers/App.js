import { Component, PropTypes } from 'react';

class App extends Component {
  render () {
    return this.props.children;
  }
}

App.propTypes = { 
  children: PropTypes.element.isRequired
};

if (module.hot) {
  const { hot } = require('react-hot-loader');
  module.exports = hot(module)(App);
} else {
  module.exports = App;
}

export default App;