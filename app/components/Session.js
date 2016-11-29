import React, { Component, PropTypes } from 'react';
import styles from './Session.css';
import { updateDesiredCapabilities } from '../actions/Session';

const { desiredCapabilityConstraints } = require('appium-base-driver/build/lib/basedriver/desired-caps');

function unCamelCase (str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
    .replace(/^./, function (str) { return str.toUpperCase(); });
}

export default class Session extends Component {
  static propTypes = {
    hello: PropTypes.string.isRequired
  }

  componentWillUpdate () {
  }

  componentDidUpdate () {
  }

  handleChangeCapability (key) {
    return (evt) => {
      updateDesiredCapabilities(key, key, evt.target.value);
    };
  }

  render () {
    return (
      <div className={styles.container}>
        <h2>Start New Session</h2>
        <form>
        <table>
        {Object.keys(desiredCapabilityConstraints).map((key) => {
          let cap = desiredCapabilityConstraints[key];
          let form;

          if (cap.inclusionCaseInsensitive || cap.inclusion) {
            let inclusion = cap.inclusionCaseInsensitive || cap.inclusion;
            form = <select onChange={this.handleChangeCapability(key)}>
              { inclusion.map((name) => <option name={name}>{name}</option>) }
            </select>;
          } else if (cap.isBoolean) {
            form = <input id={key} type='checkbox' name={key} onChange={this.handleChangeCapability(key)}/>;
          } else if (cap.isNumber) {
            form = <input id={key} type='number' name={key} onChange={this.handleChangeCapability(key)} />;
          } else {
            form = <input id={key} type='text' name={key} onChange={this.handleChangeCapability(key)} />;
          } 

          return <tr> 
            <td>
                <label for={key}>{unCamelCase(key)}</label>
            </td>
            <td>{form}</td>
          </tr>;

        })}
        </table>
        </form>
      </div>
    );
  }
}
