import React, { Component } from 'react';
import _ from 'lodash';
import {getLocators} from './shared';
import styles from './Inspector.css';
import { Button, Row, Col, Input, Modal, Table, Alert, Tooltip, Select } from 'antd';
import { withTranslation } from '../../util';
import {clipboard, shell} from 'electron';
import {
  LoadingOutlined,
  CopyOutlined,
  AimOutlined,
  EditOutlined,
  UndoOutlined,
  HourglassOutlined,
} from '@ant-design/icons';
import { ROW, ALERT } from '../../../../../shared/components/AntdTypes';

const ButtonGroup = Button.Group;
const NATIVE_APP = 'NATIVE_APP';
const selectedElementTableCell = (text) => (
  <div className={styles['selected-element-table-cells']}>{text}</div>);

/**
 * Shows details of the currently selected element and shows methods that can
 * be called on the elements (tap, sendKeys)
 */
class SelectedElement extends Component {

  constructor (props) {
    super(props);
    this.handleSendKeys = this.handleSendKeys.bind(this);
    this.contextSelect = this.contextSelect.bind(this);
  }

  handleSendKeys () {
    const {sendKeys, applyClientMethod, hideSendKeysModal, selectedElementId: elementId} = this.props;
    applyClientMethod({methodName: 'sendKeys', elementId, args: [sendKeys]});
    hideSendKeysModal();
  }

  contextSelect () {
    let {applyClientMethod, contexts, currentContext, setContext, t} = this.props;

    return (
      <Tooltip title={t('contextSwitcher')}>
        <Select value={currentContext} onChange={(value) => {
          setContext(value);
          applyClientMethod({methodName: 'switchContext', args: [value]});
        }}
        className={styles['locator-strategy-selector']}>
          {contexts.map(({id, title}) =>
            <Select.Option key={id} value={id}>{title ? `${title} (${id})` : id}</Select.Option>
          )}
        </Select>
      </Tooltip>
    );
  }

  render () {
    let {
      applyClientMethod,
      contexts,
      currentContext,
      setFieldValue,
      getFindElementsTimes,
      findElementsExecutionTimes,
      isFindingElementsTimes,
      sendKeys,
      selectedElement,
      sendKeysModalVisible,
      showSendKeysModal,
      hideSendKeysModal,
      selectedElementId: elementId,
      sourceXML,
      elementInteractionsNotAvailable,
      t,
    } = this.props;
    const {attributes, classChain, predicateString, xpath} = selectedElement;
    const isDisabled = !elementId || isFindingElementsTimes;

    if (!currentContext) {
      currentContext = NATIVE_APP;
    }

    // Get the columns for the attributes table
    let attributeColumns = [{
      title: t('Attribute'),
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: selectedElementTableCell

    }, {
      title: t('Value'),
      dataIndex: 'value',
      key: 'value',
      render: selectedElementTableCell
    }];

    // Get the data for the attributes table
    let attrArray = _.toPairs(attributes).filter(([key]) => key !== 'path');
    let dataSource = attrArray.map(([key, value]) => ({
      key,
      value,
      name: key,
    }));
    dataSource.unshift({key: 'elementId', value: elementId, name: 'elementId'});

    // Get the columns for the strategies table
    let findColumns = [{
      title: t('Find By'),
      dataIndex: 'find',
      key: 'find',
      width: 100,
      render: selectedElementTableCell
    }, {
      title: t('Selector'),
      dataIndex: 'selector',
      key: 'selector',
      render: selectedElementTableCell
    }];

    if (findElementsExecutionTimes.length > 0) {
      findColumns.push({
        title: t('Time'),
        dataIndex: 'time',
        key: 'time',
        align: 'right',
        width: 100,
        render: selectedElementTableCell
      });
    }

    // Get the data for the strategies table
    let findDataSource = _.toPairs(getLocators(attributes, sourceXML)).map(([key, selector]) => ({
      key,
      selector,
      find: key,
    }));

    // If XPath is the only provided data source, warn the user about it's brittleness
    let showXpathWarning = false;
    if (findDataSource.length === 0) {
      showXpathWarning = true;
    }

    // Add class chain to the data source as well
    if (classChain && currentContext === NATIVE_APP) {
      const classChainText = <Tooltip title={t('This selector is in BETA, it is the XML selector translated to `-ios class chain`.')}>
        <span>
          -ios class chain
          <strong>
            <a onClick={(e) => e.preventDefault() || shell.openExternal('https://github.com/facebookarchive/WebDriverAgent/wiki/Class-Chain-Queries-Construction-Rules')}>(beta)</a>
          </strong>
        </span>
      </Tooltip>;

      findDataSource.push({
        key: '-ios class chain',
        find: classChainText,
        selector: classChain,
      });
    }

    // Add predicate string to the data source as well
    if (predicateString && currentContext === NATIVE_APP) {
      const predicateStringText = <Tooltip title={t('This selector is in BETA, it is the XML selector translated to `-ios predicate string`.')}>
        <span>
          -ios predicate string
          <strong>
            <a onClick={(e) => e.preventDefault() || shell.openExternal('https://github.com/facebookarchive/WebDriverAgent/wiki/Predicate-Queries-Construction-Rules')}>(beta)</a>
          </strong>
        </span>
      </Tooltip>;

      findDataSource.push({
        key: '-ios predicate string',
        find: predicateStringText,
        selector: predicateString,
      });
    }

    // Add XPath to the data source as well
    if (xpath) {
      findDataSource.push({
        key: 'xpath',
        find: 'xpath',
        selector: xpath,
      });
    }

    // Replace table data with table data that has the times
    if (findElementsExecutionTimes.length > 0) {
      findDataSource = findElementsExecutionTimes;
    }

    let tapIcon = <AimOutlined/>;
    if (!(elementInteractionsNotAvailable || elementId)) {
      tapIcon = <LoadingOutlined/>;
    }

    return <div>
      {elementInteractionsNotAvailable && <Row type={ROW.FLEX} gutter={10}>
        <Col>
          <Alert type={ALERT.INFO} message={t('Interactions are not available for this element')} showIcon />
        </Col>
      </Row>}
      <Row justify="center" type={ROW.FLEX} align="middle" gutter={10} className={styles.elementActions}>
        <Col>
          <ButtonGroup>
            <Tooltip title={t('Tap')}>
              <Button
                disabled={isDisabled}
                icon={tapIcon}
                id='btnTapElement'
                onClick={() => applyClientMethod({methodName: 'click', elementId})}
              />
            </Tooltip>
            <Tooltip title={t('Send Keys')}>
              <Button
                disabled={isDisabled}
                id='btnSendKeysToElement'
                icon={<EditOutlined/>}
                onClick={() => showSendKeysModal()}
              />
            </Tooltip>
            <Tooltip title={t('Clear')}>
              <Button
                disabled={isDisabled}
                id='btnClearElement'
                icon={<UndoOutlined/>}
                onClick={() => applyClientMethod({methodName: 'clear', elementId})}
              />
            </Tooltip>
            <Tooltip title={t('Copy Attributes to Clipboard')}>
              <Button
                disabled={isDisabled}
                id='btnCopyAttributes'
                icon={<CopyOutlined/>}
                onClick={() => clipboard.writeText(JSON.stringify(dataSource))}/>
            </Tooltip>
            <Tooltip title={t('Get Timing')}>
              <Button
                disabled={isDisabled}
                id='btnGetTiming'
                icon={<HourglassOutlined/>}
                onClick={() => getFindElementsTimes(findDataSource)}
              />
            </Tooltip>
          </ButtonGroup>
        </Col>
      </Row>
      {findDataSource.length > 0 &&
        <Row>
          <Table
            columns={findColumns}
            dataSource={findDataSource}
            size="small"
            tableLayout='fixed'
            pagination={false} />
        </Row>
      }
      <br />
      {currentContext === NATIVE_APP && showXpathWarning &&
        <div>
          <Alert
            message={t('usingXPathNotRecommended')}
            type={ALERT.WARNING}
            showIcon
          />
          <br />
        </div>
      }
      {currentContext === NATIVE_APP && contexts && contexts.length > 1 &&
        <div>
          <Alert
            message={t('usingSwitchContextRecommended')}
            type={ALERT.WARNING}
            showIcon
          />
          <br />
        </div>
      }
      {currentContext !== NATIVE_APP &&
        <div>
          <Alert
            message={t('usingWebviewContext')}
            type={ALERT.WARNING}
            showIcon
          />
          <br />
        </div>
      }
      {contexts && contexts.length > 1 &&
        <div>
          {this.contextSelect()}
          <br /><br />
        </div>
      }
      {dataSource.length > 0 &&
        <Row>
          <Table
            columns={attributeColumns}
            dataSource={dataSource}
            size="small"
            pagination={false} />
        </Row>
      }
      <Modal title={t('Send Keys')}
        visible={sendKeysModalVisible}
        okText={t('Send Keys')}
        cancelText={t('Cancel')}
        onCancel={hideSendKeysModal}
        onOk={this.handleSendKeys}
      >
        <Input
          placeholder={t('Enter keys')}
          value={sendKeys}
          onChange={(e) => setFieldValue('sendKeys', e.target.value)}
        />
      </Modal>
    </div>;
  }
}

export default withTranslation(SelectedElement);
