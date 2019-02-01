import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Layout, Icon, Avatar } from "antd";
import uuid from "uuid";
import "./Layout.css";

const { Header } = Layout;

export class MyHeader extends Component {
  constructor(props){
    super(props)
    this.state = {
      uuid: uuid.v1(),
      PID: false
    }
  }
  componentWillReceiveProps(nextProps){
    let { uuid } = this.state
    
    if (nextProps['PID'] && nextProps['PID'][uuid]) {
      this.setState({
        PID: nextProps['PID'][uuid].warning
      })
    }
  }
  componentDidMount(){
    this.fetchData({}, 'PID')
  }
  fetchData(params = {}, name){
    let { uuid } = this.state

    this.props.rts({
      method: "get",
      url: "/Settings/warning/pid",
    }, uuid, name)
  }
  render() {
    let { PID } = this.state
    return (
      <Header style={this.props.isMobile ? { height: "100px" } : {}}>
        <a
          className="logo"
          style={Object.assign(
            {},
            this.props.isMobile
              ? { width: "100%", borderBottom: "1px solid #3c4252" }
              : { borderRight: "1px solid #bfbfbf" },
            (() => {
              if (!this.props.isMobile) {
                if (this.props.collapsed) {
                  return { width: "64px" };
                } else {
                  return { width: "180px" };
                }
              }
            })()
          )}
          onClick={()=>this.props.to("/")}
        >
          淘宝合伙人系统
        </a>
        <nav
          className="navbar"
          style={this.props.isMobile ? { width: "100%" } : {}}
        >
          <a className="sidebar-toggle">
            <Icon
              className="trigger"
              type="bars"
              onClick={this.props.onClick}
            />
          </a>
          <div className="navbar-custom-menu">
            {
              PID &&
              <div className="layout-pid" onClick={() => this.props.to('/pidlist')}>PID库存不足</div>
            }
            <Avatar className="layout-avatar">
              <Icon type="user" />
            </Avatar>
            <div className="layout-username">{this.props.name}</div>
            <div className="layout-quit" onClick={this.props.logout}>
              <Icon type="poweroff" />
            </div>
          </div>
        </nav>
      </Header>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const PID = state => state.get("rts").get("PID");

const mapStateToProps = createStructuredSelector({
  UUid,
  PID
});

export default connect(mapStateToProps, mapDispatchToProps)(MyHeader);
