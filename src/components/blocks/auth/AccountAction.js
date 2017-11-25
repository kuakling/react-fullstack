import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import css from './accountaction.scss';
import UserAvatar from './UserAvatar';

import { graphql, withApollo } from 'react-apollo';
import sessionQuery from 'src/common/gql/queries/session.gql';
import logoutMutation from 'src/common/gql/mutations/logout.gql';
import appConfig from 'src/app-config'

import { Menu, Dropdown, Icon } from 'antd';




@withApollo
@graphql(logoutMutation)
@graphql(sessionQuery)
class AccountAction extends Component {

  tryLogout = async (e) => {
    e.preventDefault();
    try {
      const { data: { logout } } = await this.props.mutate();
      if(logout.ok){
        if (!SERVER) {
          window.localStorage.removeItem(appConfig.token.name);
        }
        this.props.client.resetStore();
      } else {
        throw new Error(logout.message || 'Logout fail');
      }
    } catch (e) {
      console.error('GraphQL error: ', e.message);
    }
  }

  render() {
    if( this.props.data.loading ) return <div>Loading...</div>
    const { session } = this.props.data;
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Link to="/user">User</Link>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
          <div onClick={this.tryLogout}><Icon type="logout" /> Logout</div>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <a href="#" className={this.props.className || ''} style={this.props.style || {}}>
          <UserAvatar className={css.avatar} size="small" />
          {`${session.user.profile.firstname} ${session.user.profile.lastname}`} <Icon type="down" />
        </a>
      </Dropdown>
    );
  }
}

export default AccountAction;
