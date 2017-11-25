import React, { Component } from 'react';
import css from './index.scss';
import { Icon, Badge } from 'antd';

class AppItem extends Component {
  render() {
    const { settings: { name, url, title, icon, detail, badge, options }} = this.props
    return (
      <div className={`app-item-component ${css.app__item}`}>
        <Badge count={badge}>
          <span className={css.icon__wrapper} style={options && options.iconCss}>
            <Icon type={icon || "question-circle"} />
          </span>
        </Badge>
        <span className={css.title} style={options && options.titleCss}>{ title }</span>
      </div>
    );
  }
}

export default AppItem;
