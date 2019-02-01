import React from "react";
import { Router, Route, Link, History, withRouter } from "react-router-dom";
import pubsub from "pubsub-js";
import { Collapse } from "react-bootstrap";
import { Icon, Popover, Menu } from "antd";
import SidebarRun from "./Sidebar.run";
import menuConfig from "./../../common/menu";

const { SubMenu, MenuItemGroup } = Menu

class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      userBlockCollapse: false,
      visible:false,
      collapse: {}
    };
    this.pubsub_token = pubsub.subscribe("toggleUserblock", () => {
      this.setState({
        userBlockCollapse: !this.state.userBlockCollapse
      });
    });
  }

  componentWillMount() {
//	this.first = 0;
    if (
      this.props.location.pathname !== "/login" &&
      this.props.location.pathname !== "/"
    ) {
      this.initOpenMenu(this.props.location, this.props.menu);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.location.pathname !== "/login" &&
      nextProps.location.pathname !== "/"
    ) {
    	this.initOpenMenu(nextProps.location, nextProps.menu);
    }
  }

  componentDidMount() {
    // pass navigator to access router api
    SidebarRun(this.navigator.bind(this));
  }

  initOpenMenu(location = {}, menu = []) {
    const oneMenu = menu
      .filter(m => Boolean(m.children))
      .map(om => om.component);
    if (
      location.pathname &&
      location.pathname.split("/")[1] &&
      oneMenu.indexOf(location.pathname.split("/")[1]) > -1
    ) {
      this.setState({
        collapse: {
          [location.pathname.split("/")[1]]: true
        }
      });
    }
  }

  navigator(route) {
  	if(route.indexOf('#')===0){
  		route = route.replace('#','');
  	}
    this.props.history.replace(route);
  }

  componentWillUnmount() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token);
  }
	/*shouldComponentUpdate(nextProps, nextState){
		if(nextProps.location.pathname!=='/Agency/AgencyChange'){
			this.first=0;
		}
		else if(nextProps.location.pathname==='/Agency/AgencyChange' && this.first===0 ){
			this.first++;
			return false;
		}
		return true;
  }*/
  routeActive(one, two) {
    let pathArr = this.props.location.pathname.split("/");
    if (two && pathArr[1] === one && pathArr[2] === two) {
      return true;
    } else if (pathArr[1] === one && !two) {
      return true;
    }
    return false;
  }

  toggleItemCollapse(stateName) {
    var newCollapseState = {};
    for (let c in this.state.collapse) {
      if (this.state.collapse[c] === true && c !== stateName)
        this.state.collapse[c] = false;
    }
    this.setState({
      collapse: {
        [stateName]: !this.state.collapse[stateName]
      },
      visible:false
    });
  }
  popoverToUl() {
			let agencyObj;
			let {user} = this.props;
			if(localStorage.xAgentData){
	    		agencyObj = JSON.parse(localStorage.xAgentData);
			}
	    return (
	      <div className="userPopover">
			    {user && user.role.name==='维护员'?<div onClick={this.toChange}>{agencyObj?agencyObj.name:'运营商'}<Icon type="right" theme="outlined" /></div>:''}
			    <div onClick={this.logout}>退出</div>
			  </div>
	    )
	  }
  logout = (e) =>{
		localStorage.removeItem('xAgentData');
		this.props.logout(e);
	}
  handleVisibleChange = (visible) =>{
		this.setState({ visible });
	}
	toChange = () =>{
		const {user} = this.props;
		const obj = encodeURI(JSON.stringify({role:user.role,fullname:user.fullname}));
		this.setState({visible:false},()=>this.props.replace('/Agency/AgencyChange'+`?user=${obj}`));
	}
  render() {
    let menu =
      this.props.menu && this.props.menu.length > 0 ? this.props.menu : [];
    if (this.props.noSync) {
      menu = menuConfig;
    }
		const user = this.props.user;
    return (
      <aside className="aside">
        {/* START Sidebar (left) */}
        <div className="aside-inner">
          <nav data-sidebar-anyclick-close="" className="sidebar">
            {/* START sidebar nav */}
            <ul className="nav">
              {/* START user info */}
              <li className="has-user-block">
                <Collapse id="user-block" in={this.state.userBlockCollapse}>
                  <div>
                    <div className="item user-block">
                      {/* User picture */}
                      <Popover
                        visible={this.state.visible}  content={this.popoverToUl()}  onVisibleChange={this.handleVisibleChange}
                        placement="right"
                        trigger="hover"
                      >
                        <div className="user-block-picture">
                          <div className="user-block-status">
                            <img
                              src="assets/img/avatar.png"
                              alt="Avatar"
                              width="60"
                              height="60"
                              className="img-thumbnail img-circle"
                            />
                            <div className="circle circle-success circle-lg" />
                          </div>
                        </div>
                      </Popover>
                     {/* Name and Job */}
                      <div className="user-block-info">
                        <span className="user-block-name">{user.fullname?user.fullname:'管理员'}</span>
                        {/*<span className="user-block-role">Engineer</span>*/}
                      </div>
                    </div>
                  </div>
                </Collapse>
              </li>
              {/* END user info */}
              {/* Iterates over all sidebar items */}
              <li className="nav-heading ">
                <span data-localize="sidebar.heading.HEADER">主菜单</span>
              </li>

              {menu.map((m, i) => {
                if (!m.children) {
                  return (
                    <li
                      key={m.id}
                      className={this.routeActive(m.component) ? "active" : ""}
                    >
                      <Link to={`/${m.component}`} title={m.name}>
                        <em>
                          <Icon
                            type={m.icon || "ellipsis"}
                            style={{ marginRight: 8 }}
                          />
                        </em>
                        <span
                          data-localize={`sidebar.nav.${m.component.toLocaleUpperCase()}`}
                        >
                          {m.name}
                        </span>
                      </Link>
                    </li>
                  );
                } else {
                  return (
                    <li
                      key={m.id}
                      className={this.routeActive(m.component) ? "active" : ""}
                    >
                      <div
                        className="nav-item"
                        onClick={this.toggleItemCollapse.bind(
                          this,
                          m.component
                        )}
                      >
                        <em>
                          <Icon
                            type={m.icon || "ellipsis"}
                            style={{ marginRight: 8 }}
                          />
                        </em>
                        <span
                          data-localize={`sidebar.nav.${m.component.toLocaleUpperCase()}`}
                        >
                          {m.name}
                        </span>
                        <i className={this.state.collapse[m.component]?"icon upClass":"icon downClass"}></i>
                      </div>
                      <Collapse
                        in={this.state.collapse[m.component]}
                        timeout={100}
                      >
                        <ul id={m.component} className="nav sidebar-subnav">
                          <li className="sidebar-subnav-header">{m.name}</li>
                          {m.children.map((mc, j) => {
                            return (
                              <li
                                key={mc.id}
                                className={
                                  this.routeActive(m.component, mc.component)
                                    ? "active"
                                    : ""
                                }
                              >
                                <Link
                                  to={`/${m.component}/${mc.component}`}
                                  title={mc.name}
                                >
                                  <i className="circleClass"></i><span>{mc.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </Collapse>
                    </li>
                  );
                }
              })}
            </ul>
            {/* END sidebar nav */}
          </nav>
        </div>
        {/* END Sidebar (left) */}
      </aside>
    );
  }
}

export default withRouter(Sidebar);
