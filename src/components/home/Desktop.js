import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import css from './desktop.scss';
import AppItem from 'components/blocks/app-item';
import { appItems, favAppItems } from 'components/blocks/app-item/apps';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { Layout, Button, Row, Col, Icon } from 'antd';

class Desktop extends Component {

  handleMenuClick = (e, data, target) => {
    console.log(e, data, target)
  }

  render() {
    return (
      <Row className={`desktop-components ${css.items} ${css.container}`}>
        { favAppItems.map((item, index) => (
          <Col key={`app-${index}`} className={css.item} xs={6} sm={4} md={4} lg={2} xl={2}>
            <ContextMenuTrigger id={`menu-app-${index}`} holdToDisplay={1000}>
            <Link to={item.to}>
              <AppItem settings={item} />
            </Link>
            </ContextMenuTrigger>
            <ContextMenu id={`menu-app-${index}`}>
                <MenuItem disabled className="head">{item.title}</MenuItem>
                <MenuItem onClick={this.handleMenuClick} data={{ menu: index, item: 1 }}><Icon type="export" /> Open in New Tab</MenuItem>
                <MenuItem onClick={this.handleMenuClick} data={{ menu: index, item: 1 }}><Icon type="info-circle-o" /> App info</MenuItem>
                <MenuItem onClick={this.handleMenuClick} data={{ menu: index, item: 2 }}><Icon type="delete" /> Remove from Desktop</MenuItem>
            </ContextMenu>
          </Col>
        ))}
      </Row>
    );
  }
}

export default Desktop;
