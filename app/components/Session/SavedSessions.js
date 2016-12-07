import React, { Component } from 'react';
import moment from 'moment';
import { Button, Row, Col } from 'antd';
import FormattedCaps from './FormattedCaps';
import SessionCSS from '../Session.css';


export default class SavedSessions extends Component {

  handleDelete (index) {
    return () => {
      if (window.confirm('Are you sure?')) {
        this.props.deleteSavedSession(index);
      }
    };
  }



  render () {
    const {savedSessions, setCaps, capsUUID, switchTabs} = this.props;

    return (<Row>
      <Col span={12}>
        <table className={SessionCSS['saved-sessions']}>
          <tbody>
            {savedSessions && [...savedSessions].reverse().map((session, index) => {
              index = savedSessions.length - index - 1;
              let anchorStyle = {display: 'block'};
              return <tr key={index} className={session.uuid === capsUUID ? SessionCSS['active-session'] : ''} onClick={() => setCaps(session.caps, session.uuid)}> 
                <td>
                  <p style={anchorStyle}>
                  {session.name || 'Untitled'}
                  &nbsp;&nbsp;
                  {`(${moment(session.date).format('YYYY-MM-DD')})`}
                  </p>
                </td>
                <td>
                  {
                    session.uuid === capsUUID &&
                    <div style={{float: 'right'}}>
                      <Button icon='edit' onClick={() => switchTabs('new')} style={{marginRight: '1em'}}/>
                      <Button icon='delete' onClick={this.handleDelete(index)}/>
                    </div>
                  }
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