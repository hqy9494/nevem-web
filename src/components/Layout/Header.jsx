import React from 'react';
import pubsub from 'pubsub-js';
import HeaderRun from './Header.run'
import { NavDropdown, MenuItem, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Router, Route, Link, History } from 'react-router-dom';
import { Icon, Popover, Menu } from "antd";
// Necessary to create listGroup inside navigation items
class CustomListGroup extends React.Component {
  render() {
    return (
      <ul className="list-group">
        {this.props.children}
      </ul>
    );
  }
}

class Header extends React.Component {
		
		state = {visible:false}
    componentDidMount() {
        HeaderRun();
    }

    toggleUserblock(e) {
        e.preventDefault();
        pubsub.publish('toggleUserblock');
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
		toChange = () =>{
			let {user} = this.props;
			const obj = encodeURI(JSON.stringify({role:user.role,fullname:user.fullname}));
			this.setState({visible:false},()=>this.props.replace('/Agency/AgencyChange'+`?user=${obj}`));
		}
		handleVisibleChange = (visible) =>{
			this.setState({ visible });
		}
    render() {
    		const {user} = this.props;
        const ddAlertTitle = (
            <span>
                <em className="icon-bell"></em>
                <span className="label label-danger">11</span>
            </span>
        )
        return (
            <header className="topnavbar-wrapper">
                { /* START Top Navbar */ }
                <nav role="navigation" className="navbar topnavbar">
                    { /* START navbar header */ }
                    <div className="navbar-header">
                        <a href="#/" className="navbar-brand" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="brand-logo" style={{color: '#fff'}}>
                                {
                                //   <img src="assets/img/logo.png" alt="App Logo" className="img-responsive" />
                                }
                                心愿先生
                            </div>
                            <div className="brand-logo-collapsed">
                                <img src="assets/img/logo.png" alt="App Logo" className="img-responsive" />
                            </div>
                        </a>
                    </div>
                    { /* END navbar header */ }
                    { /* START Nav wrapper */ }
                    <div className="nav-wrapper">
                        { /* START Left navbar */ }
                        <ul className="nav navbar-nav">
                            <li>
                                { /* Button used to collapse the left sidebar. Only visible on tablet and desktops */ }
                                <a href="#" data-trigger-resize="" data-toggle-state="aside-collapsed" className="hidden-xs">
                                    <em className="fa fa-navicon"></em>
                                </a>
                                { /* Button to show/hide the sidebar on mobile. Visible on mobile only. */ }
                                <a href="#" data-toggle-state="aside-toggled" data-no-persist="true" className="visible-xs sidebar-toggle">
                                    <em className="fa fa-navicon"></em>
                                </a>
                            </li>
                            { /* START User avatar toggle */ }
                            { /* 修改新的显示log */}
                            <li>
                                <a id="user-block-toggle" href="#" onClick={ this.toggleUserblock }>
                                    <em className="icon-user"></em>
                                </a>
                            </li>
                            { /* END User avatar toggle */ }
                        </ul>
                        { /* END Left navbar */ }
                       { /* START Right Navbar */ }
                        <Popover placement="bottomRight" visible={this.state.visible}  content={this.popoverToUl()} trigger="click" onVisibleChange={this.handleVisibleChange}>
	                        <ul className="nav navbar-nav navbar-right userBox"  style={{cursor:'pointer',padding:'0 10px',marginRight:'10px'}}>
	                            { /* Search icon onClick={this.props.logout} */ }
	                            {
	                              // <li>
	                              //     <a href="#" data-search-open="">
	                              //         <em className="icon-magnifier"></em>
	                              //     </a>
	                              // </li>
	                            }
	                            { /* START Alert menu */ }
	                            {
	                              // <NavDropdown noCaret eventKey={ 3 } title={ ddAlertTitle } className="dropdown-list" id="basic-nav-dropdown" >
	                              //   <CustomListGroup>
	                              //     <ListGroupItem href="javascript:void(0)">
	                              //          <div className="media-box">
	                              //             <div className="pull-left">
	                              //                <em className="fa fa-twitter fa-2x text-info"></em>
	                              //             </div>
	                              //             <div className="media-box-body clearfix">
	                              //                <p className="m0">New followers</p>
	                              //                <p className="m0 text-muted">
	                              //                   <small>1 new follower</small>
	                              //                </p>
	                              //             </div>
	                              //          </div>
	                              //     </ListGroupItem>
	                              //     <ListGroupItem href="javascript:void(0)">
	                              //          <div className="media-box">
	                              //             <div className="pull-left">
	                              //                <em className="fa fa-envelope fa-2x text-warning"></em>
	                              //             </div>
	                              //             <div className="media-box-body clearfix">
	                              //                <p className="m0">New e-mails</p>
	                              //                <p className="m0 text-muted">
	                              //                   <small>You have 10 new emails</small>
	                              //                </p>
	                              //             </div>
	                              //          </div>
	                              //     </ListGroupItem>
	                              //     <ListGroupItem href="javascript:void(0)">
	                              //          <div className="media-box">
	                              //             <div className="pull-left">
	                              //                <em className="fa fa-tasks fa-2x text-success"></em>
	                              //             </div>
	                              //             <div className="media-box-body clearfix">
	                              //                <p className="m0">Pending Tasks</p>
	                              //                <p className="m0 text-muted">
	                              //                   <small>11 pending task</small>
	                              //                </p>
	                              //             </div>
	                              //          </div>
	                              //     </ListGroupItem>
	                              //     <ListGroupItem href="javascript:void(0)">
	                              //          <small>More notifications</small>
	                              //          <span className="label label-danger pull-right">14</span>
	                              //     </ListGroupItem>
	
	                              //   </CustomListGroup>
	                              // </NavDropdown>
	                            }
	                            { /* END Alert menu */ }
	                            { /* START Offsidebar button */ }
	                            <li style={{color:'#fff',lineHeight:'55px'}}>
		                            {user.fullname?user.fullname:'管理员'}
		                          </li>
		                        	<li className="user-block-status" style={{margin:'10px'}}>
		                            <img
		                              src="assets/img/avatar.png"
		                              alt="Avatar"
		                              width="35"
		                              height="35"
		                              className="img-thumbnail img-circle"
		                            />
		                          </li>
	                            <li>
	                                {
	                                  // <a href="#" data-toggle-state="offsidebar-open" data-no-persist="true">
	                                  //     <em className="icon-notebook"></em>
	                                  // </a>
	                                  /*<a onClick={this.props.logout}>
	                                      <em className="icon-notebook"></em>
	                                  </a>*/
	                                }
	                            </li>
	                            { /* END Offsidebar menu */ }
	                        </ul>
                        </Popover>
                        { /* END Right Navbar */ }
                    </div>
                    { /* END Nav wrapper */ }
                    { /* START Search form */ }
                    <form role="search" action="search.html" className="navbar-form">
                        <div className="form-group has-feedback">
                            <input type="text" placeholder="Type and hit enter ..." className="form-control" />
                            <div data-search-dismiss="" className="fa fa-times form-control-feedback"></div>
                        </div>
                        <button type="submit" className="hidden btn btn-default">Submit</button>
                    </form>
                    { /* END Search form */ }
                </nav>
                { /* END Top Navbar */ }
            </header>
            );
    }

}

export default Header;
