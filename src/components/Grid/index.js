import React from "react";
import classNames from "classnames";
import { Row, Col } from "antd";

class Grid extends React.Component {
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
    // FormValidationRun();
  }

  setDefault() {
    // const { defaultValues = {} } = this.props;
    // const { form = {} } = this.state;

    // if (JSON.stringify(form) === "{}") {
    //   this.setState({ form: defaultValues });
    // }
  }

  render() {
    const { defaultValues = {}, element = [] } = this.props;
    return (
      <div className="">
        {element.map((b, i) => {
          return (
            <Row
              type="flex"
              justify="start"
            >
              {b.Rows.map((r, c) => {
                return (
                  <Col
                    span={r.cols}
                    key={`col-${r.key}-${c}`}
                  >
                    {r.title}
                  </Col>
                )
              })}
            </Row>
          )
        })}
      </div>
    );
  }
}

export default FormSubmit;
