import React, { Component } from 'react';
import { graphql } from 'react-apollo'
import databaseQuery from 'src/common/gql/queries/database.gql'
import { Alert } from 'antd';


@graphql(databaseQuery)
class AppInit extends Component {
  render() {
    const { data } = this.props
    const error = data.dbConnCheck && data.dbConnCheck.error
    const message = data.dbConnCheck && data.dbConnCheck.message
    return (
      <div>
        { error ? <Alert type="error" message={ message } banner closable /> : '' }
      </div>
    );
  }
}

export default AppInit;
