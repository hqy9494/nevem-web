import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Row, Col, Panel, Tabs, Tab } from "react-bootstrap";
import FormSubmit from "../../components/Form/FormSubmit";
import { Form, Select, Button, Input, InputNumber, Checkbox } from "antd";
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class ApiManagerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    if (
      this.props.params &&
      this.props.params.model &&
      this.props.match.params.id
    ) {
      this.getApiRoles(this.props.params.model, this.props.match.params.id);
    }
    this.getRoles();
  }

  componentWillReceiveProps(nextProps) {}

  getApiRoles = (model, name) => {
    model &&
      name &&
      this.props.rts(
        {
          method: "get",
          url: `/Permissions/methods/allRoles`,
          params: {
            model: this.props.params.model,
            methodName: this.props.match.params.id
          }
        },
        this.uuid,
        "apiRoles"
      );
  };

  getRoles = () => {
    this.props.rts(
      {
        method: "get",
        url: `/roleMenus/roles`
      },
      this.uuid,
      "roles"
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { roles, apiRoles } = this.props;
    let allRoles = [],
      curRoles = [];

    if (roles && roles[this.uuid]) {
      allRoles = roles[this.uuid].map(r => {
        return {
          label: r.description,
          value: r.id
        };
      });
    }
    if (apiRoles && apiRoles[this.uuid]) {
      curRoles = apiRoles[this.uuid].map(r => {
        return r.id;
      });
    }

    return (
      <Panel header="基本信息">
        <Form>
          <div style={{ maxWidth: 750 }}>
            <FormItem {...formItemLayout} label="名称">
              <span className="ant-form-text">
                {this.props.match.params.id}
              </span>
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              <span className="ant-form-text">
                {this.props.params && decodeURIComponent(this.props.params.desc)}
              </span>
            </FormItem>
          </div>
          <Tabs id="tabID">
            <Tab eventKey={1} title="可访问接口角色">
              <FormItem>
                {getFieldDecorator("roles", {
                  initialValue: curRoles
                })(<CheckboxGroup options={allRoles} disabled />)}
              </FormItem>
            </Tab>
          </Tabs>
        </Form>
      </Panel>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const ApiManageruuid = state => state.get("rts").get("uuid");
const roles = state => state.get("rts").get("roles");
const apiRoles = state => state.get("rts").get("apiRoles");

const mapStateToProps = createStructuredSelector({
  ApiManageruuid,
  roles,
  apiRoles
});

const WrappedApiManagerDetail = Form.create()(ApiManagerDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedApiManagerDetail
);
