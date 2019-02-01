import React, { Component } from "react";
import {
  Layout,
  Menu,
  Icon,
  Breadcrumb,
  Dropdown,
  Avatar,
  Row,
  Col,
  Spin
} from "antd";
import { ContainerQuery } from "react-container-query";
import classNames from "classnames";
import Index from "../../../pages/Indexs/Index";
import Exception from "../../../pages/Exception";
import MenuConfig from "../../../common/menu";
import PowerConfig from "../../../common/power";
import "./BasicLayout.scss";

const SubMenu = Menu.SubMenu;
const { Header, Sider, Content } = Layout;
const contentHeight = document.body.clientHeight - 102;
const isMobile = /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent);

const query = {
  "screen-xs": {
    maxWidth: 575
  },
  "screen-sm": {
    minWidth: 576,
    maxWidth: 767
  },
  "screen-md": {
    minWidth: 768,
    maxWidth: 991
  },
  "screen-lg": {
    minWidth: 992,
    maxWidth: 1199
  },
  "screen-xl": {
    minWidth: 1200
  }
};

export class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: isMobile ? true : false
    };
  }
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
    this.triggerResizeEvent();
  };
  triggerResizeEvent() {
    const event = document.createEvent("HTMLEvents");
    event.initEvent("resize", true, false);
    window.dispatchEvent(event);
  }
  onMenuClick = menu => {
    menu && menu.key == "logout" && this.props.logout();
  };
  render() {
    const role =
      (this.props.user && this.props.user.roles && this.props.user.roles[0]) ||
      "";
    const authority = PowerConfig[role] || {};
    const { spin, user } = this.props;
    const { collapsed } = this.state;

    const layout = (
      <Layout className="container">
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onCollapse={this.onCollapse}
          width={180}
          className="sider"
        >
          <div className="logo">
            <a>
              <h1>我是模板</h1>
            </a>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[this.props.selectedKeys]}
            defaultOpenKeys={[this.props.openKeys]}
            onClick={item => {
              let params = this.props.match.path.split("/");
              if (item.key === params[1] && !params[2]) {
                this.props.replace(this.props.match.path);
              } else if (item.key === params[1] && params[2]) {
                this.props.to("/" + params[1]);
              } else {
                this.props.to("/" + item.key);
              }
            }}
          >
            {MenuConfig &&
              MenuConfig.map((m, i) => {
                if (authority[m.module] || true) {
                  if (m.sub) {
                    return (
                      <SubMenu
                        key={m.key}
                        title={
                          <span>
                            <Icon type={m.icon} />
                            <span className="layout-submenu-span">
                              {m.title}
                            </span>
                          </span>
                        }
                      >
                        {m.sub.map((ms, j) => {
                          return (
                            <Menu.Item key={ms.key}>
                              <span className="layout-inner-span">
                                {ms.title}
                              </span>
                            </Menu.Item>
                          );
                        })}
                      </SubMenu>
                    );
                  } else {
                    return (
                      <Menu.Item key={m.key}>
                        <Icon type={m.icon} />
                        <span className="layout-submenu-span">{m.title}</span>
                      </Menu.Item>
                    );
                  }
                }
              })}
          </Menu>
        </Sider>
        <Layout>
          <Header className="header">
            <Icon
              className="trigger"
              type={collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
            <div className="right">
              {user && (user.nickname || user.username) ? (
                <Dropdown
                  overlay={
                    <Menu className="menu" onClick={this.onMenuClick}>
                      <Menu.Item key="logout">
                        <Icon type="logout" /> 退出登录
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <span className="account action">
                    <Avatar size="small" className="avatar" icon="user" />
                    {user.nickname || user.username}
                  </span>
                </Dropdown>
              ) : (
                <Spin size="small" style={{ marginLeft: 8 }} />
              )}
            </div>
          </Header>
          {this.props.match &&
          this.props.match.url &&
          this.props.match.url.split("/")[1] === "index" ? (
            <Layout>
              <Content style={{ margin: "16px 16px 0"}}>
                <Spin spinning={spin === undefined ? false : spin}>
                  {authority["Indexs"] || true ? (
                    <div
                      // style={{ minHeight: "calc(100vh - 66px)" }}
                    >
                      <Index
                        to={this.props.to}
                        rts={this.props.rts}
                        match={this.props.match}
                      />
                    </div>
                  ) : (
                    <div
                      // style={{ minHeight: "calc(100vh - 66px)" }}
                    >
                      <Exception type={404} />
                    </div>
                  )}
                </Spin>
              </Content>
            </Layout>
          ) : (
            <Layout>
              <Breadcrumb
                style={{
                  paddingLeft: "20px"
                }}
              >
                {this.props.subTitle.map((item, i) => {
                  return (
                    <Breadcrumb.Item key={i}>
                      <a
                        className="c-h-origin"
                        style={{
                          fontSize: "16px",
                          lineHeight: "50px"
                        }}
                        onClick={() => {
                          if (item.path) {
                            this.props.to(item.path);
                          } else if (item.goBack) {
                            this.props.goBack();
                          }
                        }}
                      >
                        {item.display}
                      </a>
                    </Breadcrumb.Item>
                  );
                })}
              </Breadcrumb>
              <Content
                style={Object.assign(
                  {},
                  this.props.pageStyle ? this.props.pageStyle : {},
                  { margin: "0 16px", height: "100%" }
                )}
              >
                <Spin spinning={spin === undefined ? false : spin}>
                  <div
                    // style={{ background: "#fff", padding: "20px", borderRadius: '4px' }}
                    // style={{ minHeight: "calc(100vh - 66px)" }}
                  >
                    {this.props.contents.map(item => {
                      return item;
                    })}
                  </div>
                </Spin>
              </Content>
            </Layout>
          )}
        </Layout>
      </Layout>
    );

    return (
      <ContainerQuery query={query}>
        {params => <div className={classNames(params)}>{layout}</div>}
      </ContainerQuery>
    );
  }
}

export default BasicLayout;
