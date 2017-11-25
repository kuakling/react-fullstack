import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import css from './loginform.scss';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
class LoginForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.props.onSubmit(e, values);
      }
    });
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const identityError = isFieldTouched('identity') && getFieldError('identity');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <Form onSubmit={this.handleSubmit} className={`login-form ${css.form}`}>
        <FormItem
          validateStatus={identityError ? 'error' : ''}
          help={identityError || ''}
        >
          {getFieldDecorator('identity', {
            rules: [{ required: true, message: 'Please input your username or e-mail!' }],
          })(
            <Input prefix={<Icon type="user" />} placeholder="Username or E-mail" name="identity" />
          )}
        </FormItem>
        
        <FormItem
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your password!' }],
          })(
            <Input prefix={<Icon type="lock" />} type="password" placeholder="Password" name="password" />
          )}
        </FormItem>
        <FormItem>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon="login" 
            className="login-form-button"
            disabled={hasErrors(getFieldsError())}
          >
            Log in
          </Button>
          <Button className="google-account-button" onClick={() => window.location = "/auth/google"}>
            <img src="/images/svg-icons/google/account.svg" />
            Google Account
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default LoginForm;
