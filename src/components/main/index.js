// Main React component, that we'll import in `src/app.js`
//
// Note a few points from this file:
//
// 1.  We're using the format `main/index.js` for this file, which means we
// can simply import 'src/components/main', which will auto-default to index.js.
// This is a useful pattern when you have styles/images to pull from, and you
// want to keep the component tree organised.
//
// 2.  We import SASS and a logo SVG file directly.  Classnames will be hashed
// automatically, and images will be compressed/optimised in production.  File
// names that are made available in the import variable will be identical on
// both the server and browser.
//
// 3.  We're introducing React Router in this component.  In RR v4, routes are
// not defined globally-- they're defined declaratively on components, so we
// can respond to route changes anywhere.
//
// 4.  We're using `react-helmet`, which allows us to set <head> data like
// a <title> or <meta> tags, which are filtered up to the main <Html> component
// before HTML rendering.

// ----------------------
// IMPORTS

/* NPM */

// React
import React from 'react';

// Routing via React Router
import {
  Link,
  Route,
  Switch,
} from 'react-router-dom';

// <Helmet> component for setting the page title/meta tags
import Helmet from 'react-helmet';

/* ReactQL */

// NotFound 404 handler for unknown routes, and the app-wide `history` object
// we can use to make route changes from anywhere
import { Redirect, history } from 'kit/lib/routing';

/* App */

// Child React components. Note:  We can either export one main React component
// per file, or in the case of <Home>, <Page> and <WhenFound>, we can group
// multiple components per file where it makes sense to do so
// import GraphQLMessage from 'components/graphql';
import AppInit from 'components/blocks/app-init';
import { Page, WhenNotFound } from 'components/routes';
import Home from 'components/home';
import UserApp from 'components/apps/user';
// import ReduxCounter from 'components/redux';
// import Stats from 'components/stats';
// import Styles from 'components/styles';

import AccountAction from 'components/blocks/auth/AccountAction';
import RootMenu from './root-menu';

// ----------------------
// GraphQL decorator to handle our login mutation
import { graphql } from 'react-apollo'
import sessionQuery from 'src/common/gql/queries/session.gql'

// Styles
import css from './main.scss';

// Get the ReactQL logo.  This is a local .svg file, which will be made
// available as a string relative to [root]/dist/assets/img/
// import logo from './reactql-logo.svg';

import { LocaleProvider, Row, Col } from 'antd';
import thTH from 'antd/lib/locale-provider/th_TH';


@graphql(sessionQuery)
class Main extends React.Component {
  render() {
    if(this.props.data.loading) return <div>Loading...</div>
    const user = this.props.data.session || this.props.data.session.user;
    const isAuthenticated = this.props.data.session.ok;
    return (
      <LocaleProvider locale={thTH}>
        <div className={`${css.container} main-component flex__full__page`} style={{
          backgroundImage: 'url(/images/bg_default.jpg)',
        }}>
          <Helmet>
            <title>ReactQL application</title>
            <meta name="description" content="ReactQL starter kit app" />
          </Helmet>
          <AppInit />
          <Row className={css.header}>
            <Col span={12} className={css.left__pane}>
              <RootMenu className={`ant-dropdown-link ${css.item}`} />
              <span className={css.item}>ReactQL Application</span>
            </Col>
            <Col span={12} className={css.right__pane}>
              { isAuthenticated ? <AccountAction className={`ant-dropdown-link ${css.item}`} style={{color: '#fff'}} /> : '' }
            </Col>
          </Row>

          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/user" render={() => (
              user.ok ? 
                <UserApp />
              : 
                <Redirect to={ { pathname: '/' } } />
            )}/>
            <Route path="/page/:name" component={Page} />
            <Redirect from="/old/path" to="/new/path" />
            <Route component={WhenNotFound} />
          </Switch>
        </div>
      </LocaleProvider>
    )
  }
}


export default Main;