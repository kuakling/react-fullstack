import React, { Component } from 'react';
import css from './index.scss';
// import "src/styles/react-contextmenu.css";
import AppDrawer from 'components/blocks/app-drawer';
// import AccountAction from 'components/blocks/auth/AccountAction';
// import RootMenu from './root-menu';
import Login from './Login';
import Desktop from './Desktop';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import { graphql } from 'react-apollo'
import sessionQuery from 'src/common/gql/queries/session.gql'

import { Layout, Button, Row, Col, Icon } from 'antd';
const { Header, Footer, Content } = Layout;


@graphql(sessionQuery)
class Index extends Component {
  state = {
    appDrawerVisible: false,
  }

  showAppDrawer = () => this.setState({ appDrawerVisible: true });
  hideAppDrawer = () => this.setState({ appDrawerVisible: false });
  toggleAppDrawer = () => this.setState({ appDrawerVisible: !this.state.appDrawerVisible });

  render() {
    if( this.props.data.loading ) return <div>Loading...</div>
    const isAuthenticated = this.props.data.session.ok;
    const contentClassNames = [
      css.content,
      this.state.appDrawerVisible ? css.app__drower_shown : null,
      !this.props.data.session.ok ? css.state__login : null,
    ];
    return (
      <Layout>
        {/* <Header className={css.header}>
          <div className={css.left__pane}>
            <RootMenu className={`ant-dropdown-link ${css.item}`} />
            <div className={css.item}>ReactQL Application</div>
          </div>
          <div className={css.right__pane}>
            { isAuthenticated ? <AccountAction className={`ant-dropdown-link ${css.item}`} style={{color: '#fff'}} /> : '' }
          </div>
        </Header> */}

        <Content className={contentClassNames.filter(e => !!e).join(' ')}>
          { isAuthenticated ? <Desktop /> : <Login /> }
        </Content>

        <Footer className={css.footer}>
          <Button ghost shape="circle" icon="appstore" className={css.btn__call__app__drawer} onClick={this.toggleAppDrawer} />
        </Footer>

        <AppDrawer visible={this.state.appDrawerVisible} onCancel={this.hideAppDrawer} />

      </Layout>
    );
  }
}

export default Index;
