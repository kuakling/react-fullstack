import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Icon, Breadcrumb } from 'antd';

/**
 * Example
 * const menus = [
 *   {
 *     to: '/',
 *     title: 'Root',
 *   },
 *   {
 *     to: `${TO_PREFIX}`,
 *     title: 'Home',
 *     icon: 'home'
 *   },
 *   {
 *     to: `${TO_PREFIX}/profile`,
 *     title: 'Profile',
 *     icon: 'contacts'
 *   },
 *   {
 *     to: `${TO_PREFIX}/change-password`,
 *     title: 'Change password',
 *     icon: 'key'
 *   },
 * ];
 * .......
 * <Breadcrumbs list={menus} pathname={this.props.location.pathname}/>
 */


const Breadcrumbs = (props) => {
  const paths = props.pathname.split("/");
  const arrLink = [];
  const cProps = {...props};
  delete cProps.list;
  delete cProps.pathname;
  return (
    <Breadcrumb {...cProps}>
      {paths.map((path, index) => {
        arrLink.push(path);
        const to = arrLink.join("/");
        const mnu = props.list.find(function(value, index) {
          return value.to === (to == "" ? "/" : to);
        });
        return mnu ? <Breadcrumb.Item key={`breadcrumb-${index}`}><Link to={to}>{!!mnu.icon ? <Icon type={mnu.icon} /> : ''} {mnu.title}</Link></Breadcrumb.Item> : '';
      })}
    </Breadcrumb>
  )
}

Breadcrumbs.propTypes = {
  list: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired,
}

export default Breadcrumbs;