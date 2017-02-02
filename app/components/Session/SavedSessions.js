import React, { Component } from 'react';
import moment from 'moment';
import { Button, Row, Col, Table } from 'antd';
import FormattedCaps from './FormattedCaps';
import SessionCSS from '../Session.css';


export default class SavedSessions extends Component {

  handleDelete (uuid) {
    return () => {
      if (window.confirm('Are you sure?')) {
        this.props.deleteSavedSession(uuid);
      }
    };
  }

  sessionFromUUID (uuid) {
    const {savedSessions} = this.props;
    for (let session of savedSessions) {
      if (session.uuid === uuid) {
        return session;
      }
    }
    throw new Error(`Couldn't find session with uuid ${uuid}`);
  }

  render () {
    const {savedSessions, setCaps, capsUUID, switchTabs} = this.props;

    const columns = [{
      title: 'Capability Set',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: 'Created',
      dataIndex: 'date',
      key: 'date'
    }, {
      title: 'Actions',
      key: 'action',
      render: (text, record) => {
        let session = this.sessionFromUUID(record.key);
        return (
          <div>
            <Button icon='edit'
             onClick={() => {setCaps(session.caps, session.uuid); switchTabs('new');}}
             className={SessionCSS['edit-session']}
            />
            <Button icon='delete' onClick={this.handleDelete(session.uuid)}/>
          </div>
        );
      }
    }];

    let dataSource = [];
    if (savedSessions) {
      dataSource = savedSessions.map((session) => {
        return {
          key: session.uuid,
          name: (session.name || '(Unnamed)'),
          date: moment(session.date).format('YYYY-MM-DD')
        };
      });
    }

    let onRowClick = (record) => {
      let session = this.sessionFromUUID(record.key);
      setCaps(session.caps, session.uuid);
    };

    return (<Row gutter={20}>
      <Col span={12}>
        <Table className={SessionCSS['saved-sessions']}
         pagination={false}
         dataSource={dataSource}
         columns={columns}
         onRowClick={onRowClick}
        />
      </Col>
      <Col span={12} className={SessionCSS.savedCaps}>
        <FormattedCaps {...this.props}
         title={capsUUID ? this.sessionFromUUID(capsUUID).name : null}
        />
      </Col>
    </Row>);
  }
}
