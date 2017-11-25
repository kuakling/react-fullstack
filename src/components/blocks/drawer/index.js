import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './index.scss';
import { Layout, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

export const dimensionMap = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600,
};

export class Drawer extends Component {
  state = {
    collapsed: this.props.collapsed && false,
    type: 'responsive',
  }

  handleTrigger = (collapsed, type) => {
    this.setState({collapsed, type});
    // console.log(collapsed, type);
    if(this.props.onCollapse) this.props.onCollapse(collapsed, type);
  }

  handleClick = (e) => {
    const w = window.innerWidth,
          d = dimensionMap[this.props.breakpoint];
    if(!!this.props.breakpoint && w <= d) {
      setTimeout(() => {
        this.handleTrigger(true, 'clickTrigger');
      }, 500);
      
    }
    // console.log(window.innerWidth);
    // console.log(dimensionMap[this.props.breakpoint]);
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if(nextProps.collapsed !== undefined) {
      const { collapsed } = nextProps;
      this.setState({
        collapsed,
        type: 'clickTrigger'
      });
    }
  }
  

  render() {
    return (
      <span className={css.drawer__component}>
        <div 
          className={`${css.mask} ${this.state.collapsed ? css.hide : css.show}`} 
          onClick = { () => this.handleTrigger(true, 'clickTrigger') }
        />
        <Sider {...this.props}
          collapsed={this.state.collapsed}
          onCollapse={this.handleTrigger}
          className={`${css.sider}${!!this.props.className ? ' '+this.props.className : ''}`}
        >
          <div onClick={this.handleClick}>
            {this.props.children}
          </div>
        </Sider>
      </span>
    );
  }
}



const ndDfps = {
  title: '',
  rightContent: '',
  headerProps: {},
  headerContent: '',
  drawerProps: {},
  drawerContent: '',
  contentProps: {},
  footerProps: {},
  foterContent: '',
}
export class NavigationDrawer extends Component {
  
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired,
    rightContent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired,
    headerProps: PropTypes.object.isRequired,
    headerContent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired,
    drawerProps: PropTypes.object.isRequired,
    drawerContent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired,
    contentProps: PropTypes.object.isRequired,
    footerProps: PropTypes.object.isRequired,
    foterContent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]).isRequired,
  }

  static defaultProps = ndDfps;

  state = {
    collapsed: !!this.props.collapsed || false,
    type: 'responsive',
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  rootProps = () => {
    const props = { ...this.props }
    for (var key in ndDfps) {
      if (props.hasOwnProperty(key)) {
          delete props[key]
      }
    }
    delete props.children;

    return props;
  }

  render() {
    // console.log(this.rootProps());
    return (
      <Layout {...this.rootProps()}>
        <Header className={css.header} {...this.props.headerProps}>
            <div className={css.title}>
              {this.props.title}
            </div>

            <Icon
              className={css.btn__custom__trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />

            <div className={css.content}>{this.props.headerContent}</div>
            <div>{this.props.rightContent}</div>
        </Header>

        <Layout>
          <Drawer
            {...this.props.drawerProps}
            trigger={null}
            collapsed={this.state.collapsed}
            onCollapse={this.toggle}
          >
            {this.props.drawerContent}
          </Drawer>
          
          <Layout>
            <Content {...this.props.contentProps}>
              {this.props.children}
            </Content>
            <Footer {...this.props.footerProps}>
              {this.props.foterContent}
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}