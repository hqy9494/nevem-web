import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Row, Col, Panel, Tabs, Tab} from "react-bootstrap";
import {Form, Select, Button, Input, message, Switch, InputNumber} from "antd";
import FormExpand from "../../components/FormExpand";
import DetailTemplate from "../../components/DetailTemplate"
import { getRegular } from '../../components/CheckInput';
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14}
};

export class UserListDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      checkState: false,
      role: true,
      roleData: [],
    };
    this.uuid = uuid.v1();
  }

  componentDidMount() {
    const {params} =  this.props.match;
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
    const {getRole} = nextProps;

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
        url: `/accounts/${id}`
      },
      this.uuid,
      "pageInfo",
      (v)=>{
        // console.log(v);
        this.setState({
          initRole:v && v.role && v.role.id,
          initMobile:v && v.mobile,
        }
          )
      }
    );
  };
  getRole = (id = this.props.match.params.id) => {
    this.props.rts(
      {
        method: "get",
        url: `/Operators/roles`
      },
      this.uuid,
      "getRole"
    );
  };

  submitNew = e => {
    const id = this.props.match.params.id;
    const {initRole,initMobile}=this.state;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      values.roleId += '';
      values.mobile += '';
      let val = {};
      val.accountId = id;
      val.roleId = values.roleId;




      if (!err) {

          if (id && id === "add") {
            // console.log(values, 'submit');
              this.props.rts(
                {
                  method: "post",
                  url: `/accounts`,
                  data: values
                },
                this.uuid,
                "newPage",
                () => {
                  this.props.goBack();
                }
              );

          }
          else {


            if(values.roleId !==initRole){
              // 修改角色
              this.props.rts(
                {
                  method: "post",
                  url: `/accounts/role/set`,
                  data: val
                },
                this.uuid,
                "newPage",
                (v) => {
                  // console.log(v,"修改角色成功")
                  message.success('修改角色成功');
                }
              );
            }

            if(values.mobile !==initMobile){
              // 修改电话号码
              this.props.rts(
                {
                  method: "post",
                  url: `/accounts/${id}/resetMobile`,
                  data: values
                },
                this.uuid,
                "resetMobile",
                (v) => {
                  // console.log(v,"修改手机号码成功")
                  message.success('修改手机号码成功');
                }
              );
            }
            // 重置密码
              this.props.rts(
               {
                 method: "post",
                 url: `/accounts/${id}/resetPassword`,
                 data: values
               },
               this.uuid,
               "resetPassword",
               () => {
                 // this.props.goBack();
                 this.props.replace(this.props.path);
               }
              );


          }

      }

    })

  };





  render() {
    const {getFieldDecorator} = this.props.form;
    const {pageInfo, match} = this.props;
    const id = match.params.id;
  

    // roleData下拉框的值
    const {disabled, roleData} = this.state;

    let page = {};

    if (pageInfo && pageInfo[this.uuid]) {
      page = pageInfo[this.uuid];
    }
    

    const child  = (
      <Panel>
        <Form onSubmit={this.submitNew}>
          <div style={{maxWidth: 750}}>
            <div>
              <FormItem
                {...formItemLayout}
                label="用户姓名"
              >
                {getFieldDecorator("fullname", {
                  rules: [{
                    required: true, message: '必填项',
                  }],
                  initialValue: page.fullname || page.username

                })(
                  <Input placeholder="请输入用户姓名" disabled={disabled}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="用户账号"
              >
                {getFieldDecorator("username", {
                  rules: [{
                    required: true, message: '必填项',
                  }],
                  initialValue: page.username

                })(
                  <Input placeholder="请输入用户账号" disabled={disabled}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="登录手机号"
              >
                {getFieldDecorator("mobile", {
                  rules: [{
                    required: true,
                    message: '请输入正确的11位手机号',
                    pattern: getRegular('mobile-phone')
                  }],
                  initialValue: page.mobile
                })(
                  <InputNumber placeholder="请输登录手机号" length={11} style={{width: "100%"}}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="用户密码"
              >
                {getFieldDecorator("password", {
                  rules: [{
                    required: true, message: '必填项',
                  }],
                  //initialValue: page.fullname||page.username

                })(
                  <Input placeholder="请输入用户密码" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="角色">
                {getFieldDecorator(`roleId`, {
                  rules: [{required: true, message: '请为该用户选择一个角色'}],
                  initialValue: page && page.role ? page.role.id : ""
                })(
                  <Select
                    style={{width: "100%"}}

                  >
                    {
                      roleData && roleData.map((val, key) => {
                        return <Option value={val.id} key={key}>{val.name}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>

            </div>
            {/*<FormItem wrapperCol={{span: 12, offset: 6}}>
              {
                id && id === 'add' &&
                <ButtonGroup>

                  <Button type="primary" htmlType="submit"
                          onSubmit={values => {
                            this.submitNew(values)
                          }}
                  >
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
                  <Button type="primary" htmlType="submit"
                          onSubmit={values => {
                            this.submitNew(values)
                          }}
                  >
                    确认修改
                  </Button>
                  <Button
                    onClick={() => {
                      this.props.goBack();
                    }}
                  >
                    返回
                  </Button>
                </ButtonGroup>
              }

            </FormItem>*/}

          </div>
        </Form>
      </Panel>
    );
    return (
      <section>
	      <DetailTemplate
	      	config = {this.props.config}
	      	title = {page && page.name || this.props.title}
	      	child={child}
	      	okText={id && id !== 'add'?'确认修改':'保存'}
	      	onCancle={this.props.goBack}
	      	onOk={this.submitNew}
	      />
        
	  </section>
    )
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

const WrappedUserListDetail = Form.create()(UserListDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedUserListDetail
);
