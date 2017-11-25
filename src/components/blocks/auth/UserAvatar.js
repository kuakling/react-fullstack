import React, { Component } from 'react';
import appConfig from 'src/app-config';
import { graphql } from 'react-apollo';
import sessionQuery from 'src/common/gql/queries/session.gql';

import { Avatar } from 'antd';

// const AvatarImage = (props) => (
//   <Avatar {...props} src={props.imageUrl} />
// )

// const AvatarFirstChar = (props) => (
//   <Avatar {...props}>{props.char.toUpperCase()}</Avatar>
// )



@graphql(sessionQuery)
class UserAvatar extends Component {
  render() {
    if (this.props.data.loading) return <div>Loading...</div>
    const { session } = this.props.data;
    const arrUrl = [
      appConfig.upload.baseUrl,
      appConfig.modules.user.upload.path,
      appConfig.modules.user.avatar.path,
      session.user.id,
      session.user.profile.avatar_cropped,
    ];
    const avatarUrl = arrUrl.join("/");
    const avatarValue = session.user.profile.avatar_cropped_exists ? {src: avatarUrl} : {icon: "user"};
    const avatarProps = { ...this.props, ...avatarValue};
    delete(avatarProps.data);
    return <Avatar {...avatarProps} />
    // if(session.user.profile.avatar_cropped_exists)
    //   return <AvatarImage {...this.props} imageUrl={session.user.profile.avatar_cropped} />;
      
    // return <AvatarFirstChar {...this.props} char={session.user.profile.firstname.charAt(0)} />;
    
  }
}

export default UserAvatar;
