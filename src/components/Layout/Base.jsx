import React from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Offsidebar from "./Offsidebar";
import Footer from "./Footer";

class Base extends React.Component {
  logout = e => {
    e.stopPropagation()
    localStorage.clear()

    window.location.reload()
  }
  componentWillMount() {
  }
  render() {
  	
    const authenticated = Boolean(this.props.user);

    if (!authenticated) {
      return <div className="wrapper">{this.props.children}</div>;
    } else {
      return (
        <div className="wrapper">
          <Header logout={this.logout} replace={this.props.replace} user={this.props.user?this.props.user:'管理员'}/>

          <Sidebar menu={
            this.props.user && this.props.user.menu
              ? this.props.user.menu
              : []
          }
          logout={this.logout}
          user={this.props.user?this.props.user:'管理员'}
          replace={this.props.replace}
          />

          <Offsidebar />

          <section className="xyxs-rightContent">{this.props.children}</section>

          {/* <Footer /> */}
        </div>
      );
    }
  }
}

export default Base;
