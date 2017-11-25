import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import css from './index.scss';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { appItems, favAppItems } from 'components/blocks/app-item/apps';
import AppItem from 'components/blocks/app-item';
import { Modal, Input, Row, Col, Icon } from 'antd';

class SvgBlur extends React.Component{
  componentDidMount() {
    document.getElementById('blur-effect-1').innerHTML = '<feGaussianBlur stdDeviation="20" />'
  }
  render() {
    return (
      <div className={`${css.bg__blured} ${this.props.visible ? css.show : ''}`}>
        <div className={css.bg__image}style={{
          backgroundImage: `url(/images/bg_default.jpg`
        }}></div>
        <svg id="svg-image-blur" style={{height: 0}}>
          <filter id="blur-effect-1">
              <fegaussianblur stdDeviation="20" />
          </filter>
        </svg>
      </div>
    )
  }
}


class AppDrawer extends Component { 
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  }

  state = {
    apps: appItems,
    searchText: '',
  }

  searchAppResult = (apps) => {
    this.setState({apps})
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      this.searchApp()
    });
  }

  searchApp = () => {
    const { searchText } = this.state
    const keyword = searchText.toLowerCase()
    const apps = _.filter(appItems, function(app) {
      return  app.name.indexOf(keyword) !== -1 || 
              app.title.indexOf(keyword) !== -1 ||
              app.detail.indexOf(keyword) !== -1 ||
              app.to.indexOf(keyword) !== -1
    });
    this.searchAppResult(apps)
  }

  handleOpenInNewTap = (e, data, target) => {

  }
  
  handleAppInfo = (e, data, target) => {

  }

  handleAddToDesktop = (e, data, target) => {

  }

  onCancel = () => {
    this.props.onCancel()
  }
  render() {
    return (
      <div className="app-drawer-component">
        <SvgBlur visible={this.props.visible} />
        <Modal
          title={<Input.Search
            name="searchText"
            placeholder="Search"
            className={css.search__app}
            onChange={this.onChange}
            value={this.state.searchText}
          />}
          footer={null}
          mask={false}
          wrapClassName={css.app__drawer}
          style={{ top: 0 }}
          visible={this.props.visible}
          onCancel={this.onCancel}
        >
          <Row className={css.items}>
            { this.state.apps.map((item, index) => (
              <Col key={`app-${index}`} className={css.item} xs={6} sm={4} md={4} lg={2} xl={2}>
                <ContextMenuTrigger id={`menu-app-${index}`} holdToDisplay={1000}>
                  <Link to={item.to}>
                    <AppItem settings={item} />
                  </Link>
                </ContextMenuTrigger>
                <ContextMenu id={`menu-app-${index}`}>
                    <MenuItem disabled className="head">{item.title}</MenuItem>
                    <MenuItem onClick={this.handleOpenInNewTap} data={{ index, ...item }}><Icon type="export" /> Open in New Tab</MenuItem>
                    <MenuItem onClick={this.handleAppInfo} data={{ index, ...item }}><Icon type="info-circle-o" /> App info</MenuItem>
                    <MenuItem onClick={this.handleAddToDesktop} data={{ index, ...item }}><Icon type="heart" /> Add to Desktop</MenuItem>
                </ContextMenu>
              </Col>
            ))}
          </Row>
        </Modal>
      </div>
    );
  }
}

export default AppDrawer;
