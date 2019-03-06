import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from '../util';

class App extends React.Component {
  render () {
    const { children } = this.props;
    return (
      <React.Fragment>{children}</React.Fragment>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired
};

export default withTranslation(App);
