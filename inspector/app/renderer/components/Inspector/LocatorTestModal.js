import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
import LocatedElements from './LocatedElements';
import ElementLocator from './ElementLocator';
import { withTranslation } from '../../util';


class LocatorTestModal extends Component {

  onSubmit () {
    const {
      locatedElements,
      locatorTestStrategy,
      locatorTestValue,
      searchForElement,
      clearSearchResults,
      hideLocatorTestModal,
    } = this.props;
    if (locatedElements) {
      hideLocatorTestModal();
      clearSearchResults();
    } else {
      searchForElement(locatorTestStrategy, locatorTestValue);
    }
  }

  onCancel () {
    const {hideLocatorTestModal, clearSearchResults} = this.props;
    hideLocatorTestModal();
    clearSearchResults();
  }

  render () {
    const {
      isLocatorTestModalVisible,
      isSearchingForElements,
      locatedElements,
      t,
    } = this.props;

    return <Modal visible={isLocatorTestModalVisible}
      okText={locatedElements ? t('Done') : t('Search')}
      cancelText={t('Cancel')}
      title={t('Search for element')}
      confirmLoading={isSearchingForElements}
      onOk={this.onSubmit.bind(this)}
      onCancel={this.onCancel.bind(this)}>
      {!locatedElements && <ElementLocator {...this.props} />}
      {locatedElements && <LocatedElements {...this.props} />}
    </Modal>;
  }
}

export default withTranslation(LocatorTestModal);