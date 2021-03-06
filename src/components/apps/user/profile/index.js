import React, { Component } from 'react';
import css from './index.scss';
import AvatarManager from './AvatarManager';
import CoverManager from './CoverManager';

// GraphQL decorator to handle our login mutation
import { graphql } from 'react-apollo';
import sessionQuery from 'src/common/gql/queries/session.gql';
import updateProfileMutation from 'src/common/gql/mutations/user_profile/update.gql';

import { Card, Form, Icon, Input, Button, Modal, message } from 'antd';
const FormItem = Form.Item;

const formItems = [
  {
    label: "First name",
    input: {
      type: 'text',
      placeholder: "First name",
      name:"firstname",
    },
    rules: [{ required: true, message: 'Please input your first name!' }],
  },
  {
    label: "Last name",
    input: {
      placeholder: "Last name",
      name:"lastname",
    },
    rules: [{ required: true, message: 'Please input your last name!' }],
  },
  {
    label: "Bio",
    input: {
      type: 'textarea',
      placeholder: "Bio",
      name:"bio",
      rows: 5,
    },
  },
];

@graphql(sessionQuery)
@graphql(updateProfileMutation, {
  options: {
    update(proxy, { data: { userProfileUpdate } }) {
      const data = proxy.readQuery({
        query: sessionQuery,
      });
      // console.log('Profile.js', updateProfile)
      data.session.user.profile = userProfileUpdate.profile;
      proxy.writeQuery({ query: sessionQuery, data });
    },
  },
})
@Form.create()
class Profile extends Component {

  constructor(props) {
    super(props)

    this.user = props.data.session.user
    const { id, username, email } = this.user
    const { firstname, lastname, bio } = this.user.profile
    this.state = {
      id,
      username,
      email,
      firstname,
      lastname,
      bio,
      loading: false,
      errors: [],
      propsLoaded: false,
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // console.log(this.state);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        this.trySubmit(e)
      }
    });
  }

  trySubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true })
    try {
      const { data: { userProfileUpdate } } = await this.props.mutate({
        variables: {
          user_id: this.state.id,
          ...this.state
        },
      });
      
      if (userProfileUpdate.errors) {
        this.setState({ 
          errors: userProfileUpdate.errors, 
          loading: false 
        });
        return;
      }
      message.success('Update success');
    } catch (err) {
      Modal.error({
        title: 'Update error',
        content: err.message,
      });
      this.setState({ loading: false })
      // Some kind of error was returned -- display it in the console
      // eslint-disable-next-line no-console
      console.error('GraphQL error: ', e.message);
    }
    this.setState({ loading: false })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formLayout = 'horizontal';
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    } : null;
    const buttonItemLayout = formLayout === 'horizontal' ? {
      wrapperCol: { span: 20, offset: 4 },
    } : null;

    return (
      <Card bodyStyle={{ padding: 0 }}>
        <div className={css.cropper__zone}>
          <CoverManager />
          <AvatarManager />
        </div>
        <Form onSubmit={this.handleSubmit} layout={'horizontal'} className={`profile-form ${css.profile__form}`}>
          {formItems.map(item => (
            <FormItem
              key={`form-item-${item.input.name}`}
              label={item.label}
              {...formItemLayout}
            >
              {getFieldDecorator(item.input.name, {
                rules: item.rules || [],
                initialValue: this.state[item.input.name],
              })(
                <Input {...item.input} onChange={this.handleChange} />
              )}
            </FormItem>
          ))}

          <FormItem {...buttonItemLayout}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Submit
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default Profile;
