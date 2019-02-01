import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Row, Col, Panel, Tabs, Tab } from "react-bootstrap";
import { Form, Select, Button, Input, message } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

message.config({
  top: 60
});

export class StaffManagerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getStaff();
    this.getRoles();
  }

  componentWillReceiveProps(nextProps) {}

  getStaff = () => {
    this.props.match.params.id &&
      this.props.rts(
        {
          method: "get",
          url: `/accounts/staffs/${this.props.match.params.id}`
        },
        this.uuid,
        "staff",
        result => {
          if (result.roles) {
            this.setState({
              roles: result.roles.map(r => r.id)
            });
          }
          // this.props.to("/setting/staffManager");
        }
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

  submitFix = (form = {}) => {
    this.props.match.params.id &&
      this.props.rts(
        {
          method: "post",
          url: `/accounts/staffs/${this.props.match.params.id}`,
          data: form
        },
        this.uuid,
        "submitFix",
        () => {
          // this.props.to("/setting/staffManager");
        }
      );
  };

  submitBaseInfo = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.rts(
          {
            method: "put",
            url: `/accounts/staffs/${this.props.match.params.id}`,
            data: values
          },
          this.uuid,
          "submitBaseInfo",
          result => {
            message.success("修改成功", 3, () => {
              this.getStaff();
            });
          }
        );
      }
    });
  };

  submitRoles = () => {
    const { roles } = this.state;
    if (roles && roles.length > 0) {
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { staff, roles } = this.props;
    let form = {},
      options = [];

    if (staff && staff[this.uuid]) {
      form = staff[this.uuid];
    }

    if (roles && roles[this.uuid]) {
      options = roles[this.uuid];
    }

    return (
      <Panel header="基本信息">
        <Form onSubmit={this.submitBaseInfo}>
          <div style={{ maxWidth: 750 }}>
            <FormItem {...formItemLayout} label="昵称">
              {getFieldDecorator("nickname", {
                initialValue: form.nickname,
                rules: [{ required: true, message: "昵称为必填项" }]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="电话">
              {getFieldDecorator("email", {
                initialValue: form.email,
                rules: []
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="邮箱">
              {getFieldDecorator("mobile", {
                initialValue: form.mobile,
                rules: [
                  {
                    type: "email",
                    message: "请输入正确的邮箱"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem wrapperCol={{ span: 12, offset: 6 }}>
              <ButtonGroup>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
                <Button>取消</Button>
              </ButtonGroup>
            </FormItem>
          </div>
        </Form>
        <Tabs id="tabID">
          <Tab eventKey={1} title="员工角色">
            <div className="ant-form-inline">
              {options.length > 0 && (
                <FormItem>
                  <Select
                    mode="multiple"
                    style={{ width: 400 }}
                    placeholder="请选择角色"
                    value={this.state.roles}
                    onChange={values => {
                      this.setState({ roles: values });
                    }}
                    disabled
                  >
                    {options.map(o => (
                      <Option key={o.id} value={o.id}>
                        {o.description}
                      </Option>
                    ))}
                  </Select>
                </FormItem>
              )}
              <FormItem>
                <Button type="primary" onClick={this.submitRoles} disabled>
                  保存
                </Button>
              </FormItem>
            </div>
          </Tab>
        </Tabs>
      </Panel>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const StaffManageruuid = state => state.get("rts").get("uuid");
const staff = state => state.get("rts").get("staff");
const roles = state => state.get("rts").get("roles");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  staff,
  roles
});

const WrappedStaffManagerDetail = Form.create()(StaffManagerDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedStaffManagerDetail
);
