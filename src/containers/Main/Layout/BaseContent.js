import React from "react";

class BaseContent extends React.Component {
	render() {
    return <div className="content-page">{this.props.children}</div>;
  }
}

export default BaseContent;
