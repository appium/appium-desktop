import React, { Component, PropTypes } from 'react';
import styles from './Session.css';

const { desiredCapabilityConstraints } = require('appium-base-driver/build/lib/basedriver/desired-caps');

function unCamelCase (str) {
  return str
    // insert a space between lower & upper
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // space before last upper in a sequence followed by lower
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
    // uppercase the first character
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

  render () {
    return (
      <div className={styles.container}>
        <h2>Start New Session</h2>
        <form>
        <table>
        {Object.keys(desiredCapabilityConstraints).map((key) => {
          let cap = desiredCapabilityConstraints[key];
          let form;
          if (cap.inclusionCaseInsensitive) {
            form=<select>
              { cap.inclusionCaseInsensitive.map((name) => <option name={name}>{name}</option>) }
            </select>;
          } else if (cap.isBoolean) {
            form = <input id={key} type='checkbox' name={key} />;
          } else if (cap.isNumber) {
            form = <input id={key} type='number' name={key} />;
          } else {
            form = <input id={key} type='text' name={key} />;
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
