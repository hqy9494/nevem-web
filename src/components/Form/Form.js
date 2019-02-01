import React from "react";
import classNames from "classnames";
import FormValidationRun from "../../common/FormValidation.run";

class Form extends React.Component {
  componentDidMount() {
    FormValidationRun();
  }

  render() {
    return (
      <form
        role="form"
        data-parsley-validate=""
        noValidate
        className={classNames(this.props.className)}
        onSubmit={this.props.onSubmit}
      >
        {this.props.children}
      </form>
    );
  }
}

export default Form;
