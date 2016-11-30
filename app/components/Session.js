import React, { Component, PropTypes } from 'react';
import styles from './Session.css';
import { Button, CheckBox } from 'react-photonkit';

let { desiredCapabilityConstraints } = require('appium-base-driver/build/lib/basedriver/desired-caps');

desiredCapabilityConstraints = {
  app: {
    isFile: true,
    presence: true,
  },
  ...desiredCapabilityConstraints,
};

function unCamelCase (str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
    .replace(/^./, function (str) { return str.toUpperCase(); });
}

export default class Session extends Component {
  constructor (props) {
    super(props);
    this.state = {
      
    };
  }

  static propTypes = {
    newSession: PropTypes.func,
  }

  componentWillUpdate () {
  }

  componentDidUpdate () {
  }

  handleChangeCapability (key) {
    return (evt) => {
      console.log(key, evt.target, evt);
      let state = this.state;
      let nextState = {...state};
      nextState[key] = evt.target.value;
      this.setState(nextState);
    };
  }

  render () {
    const { newSession } = this.props;

    return (
      <div className={styles.container}>
        <h2>Start New Session</h2>
        <form>
        <table>
          <tbody>
          {Object.keys(desiredCapabilityConstraints).map((key) => {
            let cap = desiredCapabilityConstraints[key];
            let form;

            if (cap.inclusionCaseInsensitive || cap.inclusion) {
              let inclusion = cap.inclusionCaseInsensitive || cap.inclusion;
              form = <select value={this.state[key]} onChange={this.handleChangeCapability(key)}>
                { inclusion.map((name) => <option key={name} name={name}>{name}</option>) }
              </select>;
            } else if (cap.isBoolean) {
              form = <CheckBox id={key} name={key} value={this.state[key]} onChange={this.handleChangeCapability(key)}></CheckBox>;
            } else if (cap.isFile) {
              form = form = <input id={key} type='text' name={key} value={this.state[key]} onChange={this.handleChangeCapability(key)}/>; 
            } else {
              let type = cap.isNumber ? 'number' : 'text';
              form = <input id={key} type={type} name={key} value={this.state[key]} onChange={this.handleChangeCapability(key)}/>;
            }

            return <tr key={key}>
              <td>
                  <label htmlFor={key}>{unCamelCase(key)}</label>
              </td>
              <td>{form}</td>
            </tr>;

          })}
          <tr>
            <td colSpan='2'>
              <Button ptStyle='default' type='button' onClick={() => newSession(this.state)} text='Create New Session' />
            </td>
          </tr>
          </tbody>
        </table>
        </form>
      </div>
    );
  }
}
