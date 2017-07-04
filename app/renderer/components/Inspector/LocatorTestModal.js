import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';

/**
 * Absolute positioned divs that overlay the app screenshot and highlight the bounding
 * boxes of the elements in the app
 */
export default class LocatorTestModal extends Component {

  render () {
    const {hideLocatorTestModal, isLocatorTestModalVisible} = this.props;

    return <Modal visible={isLocatorTestModalVisible} 
      okText='Search'
      cancelText='Cancel'
      onCancel={hideLocatorTestModal}>Locator Test</Modal>;
  }
}
