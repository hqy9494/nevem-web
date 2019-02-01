import React from "react";
import classNames from "classnames";
import { Modal, Button } from "antd";
import { Gird } from "../Modal/index";

class Modal extends React.Component {
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
    const { defaultValues = {}} = this.props;
    const { } = this.state;
    const config = {
      element: [
        {
          Rows: [
            {
              cols: 2,
              title: '地址:',
              key: "2"
            },
            {
              cols: 6,
              title: '山西茂业天地',
              key: "2"
            },
            {
              cols: 2,
              title: '电话:',
              key: "2"
            },
            {
              cols: 6,
              title: '4009939138:',
              key: "2"
            },
            {
              cols: 2,
              title: '',
              key: "2"
            },
            {
              cols: 6,
              title: '',
              key: "2"
            }
          ]
        },
        {
          Rows: [
            {
              cols: 2,
              title: '地址:',
              key: "2"
            },
            {
              cols: 6,
              title: '山西茂业天地',
              key: "2"
            },
            {
              cols: 2,
              title: '电话:',
              key: "2"
            },
            {
              cols: 6,
              title: '4009939138:',
              key: "2"
            },
            {
              cols: 2,
              title: '单号:',
              key: "2"
            },
            {
              cols: 6,
              title: 'CG18051409511886278',
              key: "2"
            }
          ]
        },
        {
          Rows: [
            {
              cols: 2,
              title: '地址:',
              key: "2"
            },
            {
              cols: 6,
              title: '山西茂业天地',
              key: "2"
            },
            {
              cols: 2,
              title: '电话:',
              key: "2"
            },
            {
              cols: 6,
              title: '4009939138:',
              key: "2"
            },
            {
              cols: 2,
              title: '',
              key: "2"
            },
            {
              cols: 6,
              title: '',
              key: "2"
            }
          ]
        },
        {
          Rows: [
            {
              cols: 2,
              title: '2',
              key: "2"
            }
          ]
        }
      ]
    }
    const element = ""
    return (
      <Modal
        visible = {visible}
        title = {title}
        onOk = {this.handleOk}
        onCancel = {this.handleCancel}
        footer={[
          <Button key={} onClick={this.handleCancel}>{{cancelTitle}}</Button>,
          <Button key={} type="primary" onClick={this.handleOk}>{{okTitle}}</Button>,
        ]}
      >
        {/*<div className="Modal-head">{{this.headTitle}}</div>*/}
        <Gird
          {...config}
        />
      </Modal>
    )
  }
}

export default FormSubmit;
