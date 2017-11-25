import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Modal } from 'antd';
import css from './main.scss';

function about(e) {
  e.preventDefault();
  Modal.info({
    // title: 'This is a notification message',
    content: (
      <div>
        <h3>React version: { React.version }</h3>
        <h3>Developer: Mr.Surakit Choodet</h3>
      </div>
    ),
    onOk() {},
  });
}

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="#" onClick={about}>About this Application</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);

class RootMenu extends Component {
  render() {
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a {...this.props} href="#">
          <Icon type="apple" />
        </a>
      </Dropdown>
    );
  }
}

export default RootMenu;
