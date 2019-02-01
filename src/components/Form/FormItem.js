import React from "react";
import classNames from "classnames";
import { Row, Col, FormGroup, FormControl } from "react-bootstrap";

class FormItem extends React.Component {
  componentDidMount() {}

  returnFormElement = type => {
    const { options = [] } = this.props;
    switch (type) {
      case "text":
        return (
          <Col sm={10}>
            <FormControl
              type="text"
              className="form-control"
              value={this.props.value || ""}
              onChange={e => {
                this.props.onChange && this.props.onChange(e.target.value);
              }}
            />
          </Col>
        );
      case "textarea":
        return (
          <Col sm={10}>
            <FormControl componentClass="textarea" placeholder="textarea" />
          </Col>
        );
      case "select":
        return (
          <Col sm={10}>
            <FormControl
              componentClass="select"
              className="form-control m-b"
              value={this.props.value || ""}
              onChange={e => {
                this.props.onChange && this.props.onChange(e.target.value);
              }}
            >
              {options.map((o, i) => {
                return (
                  <option key={`options-${o.value}`} value={o.value}>
                    {o.title}
                  </option>
                );
              })}
            </FormControl>
          </Col>
        );
      case "checkbox":
        return (
          <Col sm={10}>
            <label className="checkbox-inline c-checkbox">
              <input id="inlineCheckbox10" type="checkbox" value="option1" />
              <em className="fa fa-check" />a
            </label>
            <label className="checkbox-inline c-checkbox">
              <input id="inlineCheckbox20" type="checkbox" value="option2" />
              <em className="fa fa-check" />b
            </label>
            <label className="checkbox-inline c-checkbox">
              <input id="inlineCheckbox30" type="checkbox" value="option3" />
              <em className="fa fa-check" />c
            </label>
          </Col>
        );
      case "radio":
        return (
          <Col sm={10}>
            <label className="radio-inline c-radio">
              <input type="radio" name="i-radio" value="option1" />
              <em className="fa fa-check" />a
            </label>
            <label className="radio-inline c-radio">
              <input type="radio" name="i-radio" value="option2" />
              <em className="fa fa-check" />b
            </label>
            <label className="radio-inline c-radio">
              <input type="radio" name="i-radio" value="option3" />
              <em className="fa fa-check" />c
            </label>
          </Col>
        );
      default:
        break;
    }
  };

  render() {
    const { label, type } = this.props;

    return (
      <fieldset>
        <FormGroup>
          <label className="col-sm-2 control-label">{label}</label>
          {this.returnFormElement(type)}
        </FormGroup>
      </fieldset>
    );
  }
}

export default FormItem;
