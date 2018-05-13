import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Layout, Menu, Dropdown, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;


export default class PerformActionModal extends Component {

  render () {
    const {isPerformActionModalVisible, hidePerformActionModal} = this.props;

    const menu = (<Menu>
      <Menu.Item>1st menu item</Menu.Item>
      <Menu.Item>2nd menu item</Menu.Item>
      <SubMenu title="sub menu">
        <Menu.Item>3rd menu item</Menu.Item>
        <Menu.Item>4th menu item</Menu.Item>
      </SubMenu>
      <SubMenu title="disabled sub menu" disabled>
        <Menu.Item>5d menu item</Menu.Item>
        <Menu.Item>6th menu item</Menu.Item>
      </SubMenu>
    </Menu>);

    return <Modal visible={isPerformActionModalVisible}
      okText="Done"
      cancelText="Cancel"
      title='Perform an Action'
      onCancel={hidePerformActionModal}
      onOk={hidePerformActionModal}>
    </Modal>;
  }
}
