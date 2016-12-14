import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Row, Col, Card } from 'antd';
import Source from './Inspector/Source';
import Screenshot from './Inspector/Screenshot';
import SelectedElement from './Inspector/SelectedElement';

export default class Inspector extends Component {

  componentWillMount () {
    this.props.applyClientMethod({methodName: 'source'});
    this.props.bindSessionDone();
  }

  render () {
    const {applyClientMethod, methodCallRequested, screenshot, selectedPath} = this.props;

    return <div style={{width: '100%', padding: '1em'}}>
      <Row gutter={16}>
        <Col span={12}>
          <Card style={{height: 800}} loading={!!methodCallRequested} title='Source'>
            <div style={{height: selectedPath ? 400 : 800, overflow: 'scroll', borderBottom: '1px solid black'}}>
              <Button icon='reload' onClick={() => applyClientMethod({methodName: 'source'})}></Button>
              <Source {...this.props} />
            </div>
            {selectedPath && <SelectedElement {...this.props}/>}
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{height: 800}} loading={!!methodCallRequested}>
            <div style={{position: 'relative'}}>
              {screenshot && <Screenshot {...this.props} />}
            </div>
          </Card>
        </Col>
      </Row>
    </div>;
  }
}
