import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import routes, { TO_PREFIX } from './routes';
import Helmet from 'react-helmet';
import css from './index.scss';
import { NavigationDrawer } from 'components/blocks/drawer';
import Breadcrumbs from 'components/blocks/breadcrumbs';
import { Layout, Menu, Icon, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

const menus = [
  // {
  //   to: '/',
  //   title: 'Root',
  // },
  {
    to: `${TO_PREFIX}`,
    title: 'Home',
    icon: 'home'
  },
  {
    to: `${TO_PREFIX}/profile`,
    title: 'Profile',
    icon: 'contacts'
  },
  {
    to: `${TO_PREFIX}/change-password`,
    title: 'Change password',
    icon: 'key'
  },
];

const DrawerMenu = ({ location }) => {
  return (
    <Menu theme="dark" mode="inline" selectedKeys={[location.pathname || "root"]}>
      {menus.map(mnu => (
        <Menu.Item key={mnu.to}>
          <Link to={mnu.to}>
            { mnu.icon ? <Icon type={mnu.icon} /> : '' }
            <span className="nav-text">{mnu.title}</span>
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  )
}

@withRouter
class UserApp extends Component {
  render () {
    return(
      <NavigationDrawer
        style={{
          backgroundColor: "#f0f2f5",
        }}
        title="User"
        rightContent={<Link to={'/'} style={{color: '#fff', marginRight: 10}}><Icon type="close" /></Link>}
        headerContent={<Breadcrumbs list={menus} pathname={this.props.location.pathname} className={css.breadcrumbs} />}
        headerProps={{
          style: {
            background: 'teal',
            color: '#fff',
            height: 40,
            lineHeight: '40px',
          }
        }}
        drawerContent={<DrawerMenu location={this.props.location} />}
        drawerProps={{
          breakpoint: "sm",
          collapsedWidth: "0"
        }}
        contentProps={{
          style: {
            margin: '24px 16px 0'
          }
        }}
      >
        <Helmet>
          <link rel="stylesheet" href="/css/antd-themes/teal.min.css" />
        </Helmet>
        
        <ReactCSSTransitionGroup
          transitionName="window-blur"
          transitionEnterTimeout={200}
          transitionLeave={false}
        >
          <Switch location={this.props.location} key={this.props.location.key}>
            { routes.map((route, index) => (
              <Route {...route} key={'route_' + index} />
            ))
            }
          </Switch>
        </ReactCSSTransitionGroup>
      </NavigationDrawer>
    )
  }
}

export default UserApp;
