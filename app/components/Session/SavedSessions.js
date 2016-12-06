import React, { Component } from 'react';
import moment from 'moment';
import { Button, Row, Col } from 'antd';
import FormattedCaps from './FormattedCaps';

export default class SavedSessions extends Component {

  handleDelete (index) {
    return () => {
      if (window.confirm('Are you sure?')) {
        this.props.deleteSavedSession(index);
      }
    };
  }

  render () {
    const {savedSessions, setCaps, capsUUID} = this.props;

    return (<Row>
      <Col span={12}>
        <table style={{width: '40em', maxWidth: '100%'}}>
          <tbody>
            {savedSessions && [...savedSessions].reverse().map((session, index) => {
              index = savedSessions.length - index - 1;
              let anchorStyle = {display: 'block'};
              return <tr key={index} style={{backgroundColor: session.uuid === capsUUID ? 'blue' : ''}}> 
                <td>
                  <a href='#' style={anchorStyle} onClick={(e) => {e.preventDefault(); setCaps(session.caps, session.uuid);} }>
                  {session.name || 'Untitled'}
                  &nbsp;&nbsp;
                  {`(${moment(session.date).format('YYYY-MM-DD')})`}
                  </a>
                </td>
                <td style={{float: 'right'}}>
                  <Button icon='delete' onClick={this.handleDelete(index)}/>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </Col>
      <Col span={12}>
        <FormattedCaps {...this.props} />
      </Col>
    </Row>);
  }
}