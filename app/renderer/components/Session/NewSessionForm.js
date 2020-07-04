import React, { Component } from 'react';
import { Button, Input, Modal, Form, Row, Col, Select } from 'antd';
import FormattedCaps from './FormattedCaps';
import CapabilityControl from './CapabilityControl';
import SessionStyles from './Session.css';
import {
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {remote} from 'electron';
import { HEIGHT_OF_SESSION_CONFIG_AREA } from './Layout';
import { ROW } from '../AntdTypes';

const {Item: FormItem} = Form;
const {Option} = Select;

export default class NewSessionForm extends Component {

  /**
   * Callback when the type of a dcap is changed
   */
  handleSetType (index, type) {
    let {setCapabilityParam, caps} = this.props;
    setCapabilityParam(index, 'type', type);

    // Translate the current value to the new type
    let translatedValue = caps[index].value;
    switch (type) {
      case 'text':
        translatedValue = translatedValue + '';
        break;
      case 'boolean':
        if (translatedValue === 'true') {
          translatedValue = true;
        } else if (translatedValue === 'false') {
          translatedValue = false;
        } else {
          translatedValue = !!translatedValue;
        }
        break;
      case 'number':
        translatedValue = parseInt(translatedValue, 10) || 0;
        break;
      case 'json_object':
      case 'object':
        translatedValue = translatedValue + '';
        break;
      case 'file':
        translatedValue = '';
        break;
      default:
        break;
    }
    setCapabilityParam(index, 'value', translatedValue);
  }

  render () {
    const {setCapabilityParam, caps, addCapability, removeCapability, saveSession, hideSaveAsModal,
           saveAsText, showSaveAsModal, setSaveAsText, isEditingDesiredCaps, t} = this.props;

    return <div>
      <Row type={ROW.FLEX} align="top" justify="start" className={SessionStyles.capsFormRow}>
        <Col order={1} span={12} className={`${SessionStyles.capsFormCol} ${isEditingDesiredCaps ? SessionStyles.capsFormDisabled : ''}`}>
          <Form
            className={SessionStyles.newSessionForm}
            style={{maxHeight: remote.getCurrentWindow().getSize()[1] - HEIGHT_OF_SESSION_CONFIG_AREA}}>

            {caps.map((cap, index) => <Row gutter={8} key={index}>
              <Col span={7}>
                <FormItem>
                  <Input disabled={isEditingDesiredCaps} id={`desiredCapabilityName_${index}`} placeholder={t('Name')}
                    value={cap.name} onChange={(e) => setCapabilityParam(index, 'name', e.target.value)}/>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem>
                  <Select disabled={isEditingDesiredCaps} onChange={(val) => this.handleSetType(index, val)} defaultValue={cap.type}>
                    <Option value='text'>{t('text')}</Option>
                    <Option value='boolean'>{t('boolean')}</Option>
                    <Option value='number'>{t('number')}</Option>
                    <Option value='object'>{t('JSON object')}</Option>
                    <Option value='file'>{t('filepath')}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem>
                  <CapabilityControl {...this.props} cap={cap} id={`desiredCapabilityValue_${index}`}
                    onSetCapabilityParam={(value) => setCapabilityParam(index, 'value', value)} />
                </FormItem>
              </Col>
              <Col span={2}>
                <div className={SessionStyles.btnDeleteCap}>
                  <FormItem>
                    <Button {...{disabled: caps.length <= 1 || isEditingDesiredCaps}}
                      icon={<DeleteOutlined/>}
                      onClick={() => removeCapability(index)}/>
                  </FormItem>
                </div>
              </Col>
            </Row>)}
            <Row>
              <Col span={24}>
                <FormItem>
                  <Button
                    disabled={isEditingDesiredCaps} id='btnAddDesiredCapability'
                    icon={<PlusOutlined/>}
                    onClick={addCapability}
                    className={SessionStyles['add-desired-capability-button']} />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col order={2} span={12} className={SessionStyles.capsFormattedCol}>
          <FormattedCaps {...this.props} />
          <Modal visible={showSaveAsModal}
            title={t('Save Capability Set As')}
            okText='Save'
            cancelText='Cancel'
            onCancel={hideSaveAsModal}
            onOk={() => saveSession(caps, {name: saveAsText})}>
            <Input onChange={(e) => setSaveAsText(e.target.value)} addonBefore={t('Name')} value={saveAsText}/>
          </Modal>
        </Col>
      </Row>
    </div>;
  }
}
