import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
import LocatedElements from './LocatedElements';
import ElementLocator from './ElementLocator';


export default class LocatorTestModal extends Component {

  onSubmit () {
    const {locatedElements, locatorTestStrategy, locatorTestValue, searchForElement, clearSearchResults, hideLocatorTestModal} = this.props;
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
    const {isLocatorTestModalVisible, isSearchingForElements, locatedElements} = this.props;

    return <Modal visible={isLocatorTestModalVisible} 
      okText={locatedElements ? 'Done' : 'Search'}
      cancelText='Cancel'
      title='Search for element'
      confirmLoading={isSearchingForElements}
      onOk={this.onSubmit.bind(this)}
      onCancel={this.onCancel.bind(this)}>
        {!locatedElements && <ElementLocator {...this.props} />}
        {locatedElements && <LocatedElements {...this.props} />}
    </Modal>;
  }
}
