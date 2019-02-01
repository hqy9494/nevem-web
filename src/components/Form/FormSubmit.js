import React from "react";
import classNames from "classnames";
import { Col, FormGroup, ButtonToolbar, Button } from "react-bootstrap";
import Form from "./index";
import FormValidationRun from "../../common/FormValidation.run";

class FormSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {}
    };
  }

  componentWillMount() {
    this.setDefault();
  }

  componentWillReceiveProps(nextProps) {
    this.setDefault();
  }

  componentDidMount() {
    FormValidationRun();
  }

  setDefault() {
    const { defaultValues = {} } = this.props;
    const { form = {} } = this.state;

    if (JSON.stringify(form) === "{}") {
      this.setState({ form: defaultValues });
    }
  }

  render() {
    const { defaultValues = {}, element = [] } = this.props;
    const { form } = this.state;
    return (
      <Form className="form-horizontal">
        {element.map((e, i) => {
          return (
            <Form.Item
              key={`element-${i}`}
              label={e.label}
              type={e.type}
              value={form[e.field] || defaultValues[e.field]}
              options={e.options}
              onChange={v => {
                this.setState({
                  form: {
                    ...form,
                    [e.field]: v
                  }
                });
              }}
            />
          );
        })}
        <fieldset>
          <FormGroup>
            <label className="col-sm-2 control-label" />
            <Col sm={10}>
              <ButtonToolbar>
                <Button
                  bsStyle="primary"
                  onClick={() => {
                    this.props.onSubmit(this.state.form);
                  }}
                >
                  提交
                </Button>
                <Button>取消</Button>
              </ButtonToolbar>
            </Col>
          </FormGroup>
        </fieldset>
      </Form>
    );
  }
}

export default FormSubmit;
