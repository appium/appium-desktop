import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';

export default class Action extends Component {

  render () {
    const { t, applyClientMethod } = this.props;

    return <div>
      <Row>
        <Col span={4}>
          <Button onClick={() => applyClientMethod({methodName: 'backgroundApp', args: [10]})}>{t('Background App')}</Button>
        </Col>
      </Row>
    </div>;
  }
}
