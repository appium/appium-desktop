import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Card } from 'antd';
import Screenshot from './Inspector/Screenshot';
import SelectedElement from './Inspector/SelectedElement';
import Source from './Inspector/Source';

export default class Inspector extends Component {

  componentWillMount () {
    this.props.applyClientMethod({methodName: 'source'});
    this.props.bindAppium();
  }

  render () {
    const {methodCallRequested, screenshot, selectedPath} = this.props;

    return <Row gutter={16}>
      <Col span={12}>
          <div style={{position: 'relative'}}>
            {screenshot && <Screenshot {...this.props} />}
          </div>
      </Col>
      <Col span={12}>
        <Card style={{height: '98vh'}} loading={!!methodCallRequested} title='Source'>
          <Source {...this.props} />
          {selectedPath && <SelectedElement {...this.props}/>}
        </Card>
      </Col>
    </Row>;
  }
}
