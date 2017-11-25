import React, { Component } from 'react';
import appConfig from 'src/app-config';
import css from './login.scss';
import LoginForm from 'components/blocks/auth/LoginForm';
import { Card, Spin, Modal, message } from 'antd';

import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import sessionQuery from 'src/common/gql/queries/session.gql';
import loginMutation from 'src/common/gql/mutations/login.gql';


@graphql(sessionQuery)
@graphql(loginMutation, {
  options: {
    update(proxy, { data: { login } }) {
      const data = proxy.readQuery({
        query: sessionQuery,
      });
      // console.log(login)
      data.session = login;
      proxy.writeQuery({ query: sessionQuery, data });
    },
  },
})
// @connect(null, { showDialog, addToast })
// @withRouter
class Login extends Component {

  state = {
    loading: false,
  }
  
  onSubmit = async (e, data) => {
    e.preventDefault();
    try {
      this.setState({ loading: true })
      const { data: { login } } = await this.props.mutate({
        variables: {
          identity: data.identity,
          password: data.password,
        },
      });

      if (login.errors) { //On login error
        this.setState({ loading: false });
        const errorMessage = login.errors.map(err => (`${err.field}: ${err.message}`)).join("<br />");
        Modal.error({
          title: 'Login error',
          content: errorMessage,
          okType: 'danger',
        });
        console.error(login.errors);
        return;
      }

      //on login success
      message.info(`Login Success: Welcome ${login.user.profile.firstname} ${login.user.profile.lastname}`);
      if (!SERVER) {
        window.localStorage.setItem(appConfig.token.name, login.jwt);
      }
    } catch (e) {
      Modal.error({
        title: 'Login error',
        content: e.message,
        okType: 'danger',
      });
      this.setState({ loading: false })
      console.error('GraphQL error : ', e.message);
    }
  }

  render() {
    return (
      <Card className={css.login__component}>
        <h3 style={{marginBottom: 24, fontSize: 20}}>Login</h3>
        <Spin tip="Logging in..." spinning={this.state.loading} >
          <LoginForm onSubmit={this.onSubmit} />
        </Spin>
      </Card>
    );
  }
}

export default Login;
