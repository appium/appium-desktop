import React, { Component } from 'react';
import { Collapse, Form, Row, Col, Checkbox, Input } from 'antd';
import styles from './Session.css';

const {Panel} = Collapse;
const FormItem = Form.Item;

export default class AdvancedServerParams extends Component {


  render () {
    const {server, setServerParam, t} = this.props;

    return <Row gutter={8}>
      <Col className={styles.advancedSettingsContainerCol}>
        <div className={styles.advancedSettingsContainer}>
          <Collapse bordered={true}>
            <Panel header={t('Advanced Settings')}>
              <Row>
                <Col span={6}>
                  <FormItem>
                    <Checkbox checked={!!server.advanced.allowUnauthorized} onChange={(e) => setServerParam('allowUnauthorized', e.target.checked, 'advanced')}>{t('allowUnauthorizedCerts')}</Checkbox>
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem>
                    <Checkbox checked={!!server.advanced.useProxy} onChange={(e) => setServerParam('useProxy', e.target.checked, 'advanced')}>{t('Use Proxy')}</Checkbox>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem>
                    <Input disabled={!server.advanced.useProxy} onChange={(e) => setServerParam('proxy', e.target.value, 'advanced')}
                      placeholder={t('Proxy URL')} value={server.advanced.proxy} />
                  </FormItem>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </div>
      </Col>
    </Row>;
  }
}
