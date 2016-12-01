import React, { Component } from 'react';

function unCamelCase (str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
    .replace(/^./, function (str) { return str.toUpperCase(); });
}

export default class NewSessionForm extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    // desiredCapabilities: PropTypes.object,
    // desiredCapabilityConstraints: PropTypes.object,
  }

  static defaultProps = {
    desiredCapabilities: {},
    desiredCapabilityConstraints: {},
    onCreateNewSession: () => {},
    onChangeCapability: () => {},
  };

  componentWillUpdate () {
  }

  componentDidUpdate () {
  }

  render () {
    return (
      <form onSubmit={(e) => e.preventDefault && this.props.onCreateNewSession()}>
        <table>
            <tbody>
            {Object.keys(this.props.desiredCapabilityConstraints).map((key) => {
              let cap = this.props.desiredCapabilityConstraints[key];
              let form;

              if (cap.inclusionCaseInsensitive || cap.inclusion) {
                let inclusion = cap.inclusionCaseInsensitive || cap.inclusion;
                form = <select value={this.props.desiredCapabilities[key]} onChange={(e) => this.props.onChangeCapability(key, e.target.value)} name={key}>
                    { inclusion.map((name) => <option key={name} name={name}>{name}</option>) }
                </select>;
              } else if (cap.isBoolean) {
                form = <input type='checkbox' value={this.props.desiredCapabilities[key]}  
                    onChange={(e) => this.props.onChangeCapability(key, e.target.value)} />;
              } else if (cap.isFile) {
                form = form = <input type='text' value={this.props.desiredCapabilities[key]} 
                    onChange={(e) => this.props.onChangeCapability(key, e.target.value)}/>; 
              } else {
                let type = cap.isNumber ? 'number' : 'text';
                form = <input type={type} value={this.props.desiredCapabilities[key]} 
                    onChange={(e) => this.props.onChangeCapability(key, e.target.value)}/>;
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