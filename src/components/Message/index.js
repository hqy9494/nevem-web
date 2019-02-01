import React from "react";
import Notifications from "../../common/Notifications.run";

class Form extends React.Component {
  componentDidMount() {
    Notifications();
  }

  render() {
    return (
      <a
        data-notify=""
        data-message={this.props.content || ""}
        data-options={`{&quot;status&quot;:&quot;${this.props.type ||
          "info"}&quot;}`}
        data-onload={this.props.show || undefined}
      />
    );
  }
}

export default Form;
