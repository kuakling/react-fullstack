import React, { Component } from 'react';
import appConfig from 'src/app-config';
import css from './usercover.scss';

import { graphql } from 'react-apollo';
import sessionQuery from 'src/common/gql/queries/session.gql';

const NoCover = ({props}) => (
  <div className={css.no__cover}>
    <div className={css.bg__img} />
  </div>
)

@graphql(sessionQuery)
class UserCover extends Component {
  render() {
    if (this.props.data.loading) return <div>Loading...</div>
    const { session } = this.props.data;
    const arrUrl = [
      appConfig.upload.baseUrl,
      appConfig.modules.user.upload.path,
      appConfig.modules.user.cover.path,
      session.user.id,
      session.user.profile.cover_cropped,
    ];
    const coverUrl = arrUrl.join("/");
    if (!session.user.profile.cover_cropped_exists) return <NoCover />
    const coverSrc = session.user.profile.cover_cropped_exists ? coverUrl : "/images/image-icon.png";
    const coverProps = { ...this.props};
    delete(coverProps.data);
    return (
      <div className={css.cover__container} style={{backgroundImage: `url('${coverSrc}')`}}>
        {/* <img alt="example" src={coverSrc} /> */}
      </div>
    );
  }
}

export default UserCover;
