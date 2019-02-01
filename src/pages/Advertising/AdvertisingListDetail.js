import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Form, Select, Button, Col, Row, Input, message ,Switch,InputNumber } from "antd";
import FormExpand from "../../components/FormExpand";
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};



export class AdvertisingListDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      checkState:false,
      role:true,
      roleData: [],
    };
    this.uuid = uuid.v1();
  }
  componentDidMount() {
    const { params } =  this.props.match;
    const {id} = params;
    this.getRole();
    if (id && id !== "add") {
      this.setState({
        disabled: true,
      });
      this.getOne();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { getRole } = nextProps;

    if (getRole && getRole[this.uuid]) {
      this.setState({
        roleData: getRole[this.uuid],
      })
    }
  }

  getOne = (id = this.props.match.params.id) => {
    id &&
      this.props.rts(
        {
          method: "get",
          url: `/Agents/${id}`
        },
        this.uuid,
        "pageInfo"
      );
  };
  getRole = (id = this.props.match.params.id) => {
    this.props.rts(
      {
        method: "get",
        url: `/Agents/roles`
      },
      this.uuid,
      "getRole"
    );
  };
  submitNew = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
          values.roleId += '';
          if (!err) {
          	values.direct = values.direct==='true'?true:false;
            this.props.rts(
              {
                method: "post",
                url: `/Agents/agent`,
                data: values
              },
              this.uuid,
              "newPage",
              () => {
                this.props.goBack();
              }
            );
          }


    })

  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { pageInfo,match } = this.props;
    const id = match.params.id;
    // console.log(id, match);

    // roleData下拉框的值
    const { disabled, roleData } = this.state;

    let page = {};


    if (pageInfo && pageInfo[this.uuid]) {
      page = pageInfo[this.uuid];
    }



    return (
      <Panel>
        <Form onSubmit={this.submitNew}>
          <div style={{ maxWidth: 750 }}>
          <div>
              <FormItem
                {...formItemLayout}
                label="代理商"
              >
                {getFieldDecorator("name", {
                  rules: [{
                    required: true, message: '必填项',
                  }],
                  initialValue: page.name
                })(
                  <Input  placeholder="请输入代理商名称" disabled={disabled}/>

                )}

              </FormItem>
            {
              id && id == 'add' &&
              <div>
                <FormItem
                  {...formItemLayout}
                  label="账号"
                >
                  {getFieldDecorator("username", {
                    rules: [{
                      required: true, message: '必填项',
                    }]
                  })(
                    <Input  placeholder="请输入账号"/>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="密码"
                >
                  {getFieldDecorator('password', {
                    rules: [{
                      required: true, message: '请输入密码',
                    }]
                  })(
                    <Input type="password" placeholder="请输入密码"/>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="业务角色">
                  {getFieldDecorator(`roleId`, {
                    rules: [{required: true, message: '请选择' }],
                    // initialValue: product && product.categoryId ? [product.categoryId] : []
                  })(
                    <Select
                      style={{ width: "100%" }}
                      //defaultValue={this.state.role}
                      //value={this.state.role}
                      //onChange={val => {
                      //  console.log(val)
                      //}}
                    >
                      {
                        roleData && roleData.map((val,key) => {
                          return <Option value={val.id} key={key}>{val.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="代理属性">
                  {getFieldDecorator(`direct`, {
                    rules: [{required: true, message: '请选择' }],
                    // initialValue: product && product.categoryId ? [product.categoryId] : []
                  })(
                    <Select
                      style={{ width: "100%" }}
                      //defaultValue={this.state.role}
                      //value={this.state.role}
                      //onChange={val => {
                      //  console.log(val)
                      //}}
                    >
                    	<Option value='false'>一般代理</Option>
                    	<Option value='true'>直属代理</Option>
                    </Select>
                  )}
                </FormItem>
              </div>

            }
            </div>
              <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                {
                  id && id === 'add' &&
                  <ButtonGroup>

                    <Button type="primary" htmlType="submit"
                            onSubmit={values => {
                              this.submitNew(values)
                            }}>
                      保存
                    </Button>
                    <Button
                      onClick={() => {
                        this.props.goBack();
                      }}
                    >
                      取消
                    </Button>
                  </ButtonGroup>
                }
                {
                  id && id !== 'add' &&
                  <ButtonGroup>
                    <Button
                      onClick={() => {
                        this.props.goBack();
                      }}
                    >
                      返回
                    </Button>
                  </ButtonGroup>
                }

              </FormItem>

          </div>
        </Form>
      </Panel>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const StaffManageruuid = state => state.get("rts").get("uuid");
const pageInfo = state => state.get("rts").get("pageInfo");
const getRole = state => state.get("rts").get("getRole");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  pageInfo,
  getRole
});

const WrappedAdvertisingListDetail = Form.create()(AdvertisingListDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedAdvertisingListDetail
);
