import React, { Component } from 'react';
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

export default class NewSessionForm extends Component {

  static defaultProps = {
    desiredCapabilities: {},
    onCreateNewSession: () => {},
    onChangeCapability: () => {},
  };

  componentWillMount () {
    this.props.getDefaultCaps(desiredCapabilityConstraints);
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.onCreateNewSession();
  }

  render () {
    const { newSession, desiredCapabilities, changeCapability } = this.props;

    return desiredCapabilities && (
      <form onSubmit={(e) => {e.preventDefault(); newSession(desiredCapabilities); }}>
        <table>
            <tbody>
            {Object.keys(desiredCapabilityConstraints).map((key) => {
              let capConstraint = desiredCapabilityConstraints[key];
              let options = capConstraint.inclusionCaseInsensitive || capConstraint.inclusion;
              let form;

              if (options) {
                form = <select value={desiredCapabilities[key]} onChange={(e) => changeCapability(key, e.target.value)} name={key}>
                    { options.map((name) => <option key={name} name={name}>{name}</option>) }
                </select>;
              } else if (capConstraint.isBoolean) {
                form = <input type='checkbox' checked={desiredCapabilities[key]} onChange={(e) => changeCapability(key, e.target.checked)} />;
              } else if (capConstraint.isFile) {
                form = form = <input type='text' value={desiredCapabilities[key]} onChange={(e) => changeCapability(key, e.target.value)}/>; 
              } else {
                let type = capConstraint.isNumber ? 'number' : 'text';
                form = <input type={type} value={desiredCapabilities[key]} onChange={(e) => changeCapability(key, e.target.value)}/>;
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
                <button type="submit">Submit</button>
            </td>
            </tr>
            </tbody>
        </table>
      </form>
    );
  }
}