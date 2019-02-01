import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Row, Col, Panel, Tabs, Tab } from "react-bootstrap";
import {Form, Select, Button, Input, message, Switch, InputNumber, Modal, Table, Icon, Popconfirm} from "antd";
//import FormExpand from "../../components/FormExpand";
// import TableExpand from "../../components/TableExpand";
import DetailTemplate from "../../components/DetailTemplate"
import { getRegular } from '../../components/CheckInput';
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};



export class UserListDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      checkState:false,
      role:true,
      roleData: [],
      terminalsData:[],
      selectedTable:[],
      initSelectedTable: [],
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
    const { getRole,getTerminals , getPositionDivides} = nextProps;
    const {selectedTable} = this.state;
    if (getRole && getRole[this.uuid]) {
      this.setState({
        roleData: getRole[this.uuid],
      })
    }

    if (getTerminals && getTerminals[this.uuid] && getTerminals[this.uuid].data) {

      let data = getTerminals[this.uuid].data.map(v => {
        const bol = selectedTable.some(k => k.id === v.id);
        return Object.assign(v, {mystatus: bol})
      }).filter(v =>v.level === null&& v.id !==id);
      this.setState({
        terminalsData: data,
      });
      this.setState({
        terminalsData: getTerminals[this.uuid].data,
      })
    }
    if ( getPositionDivides &&  getPositionDivides[this.uuid]) {
      this.setState({
        selectedTable: getTerminals[this.uuid].data,
        getPositionDividesTotal: getTerminals[this.uuid].total,
        initSelectedTable: getTerminals[this.uuid].data,
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
    const id = this.props.match.params.id;

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values.roleId += '';
      values.mobile+= '';
      // console.log(values,"values");
      let val ={};
      val.accountId=id;
      val.roleId=values.roleId;
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
              message.success('修改密码成功');
            }
          );
          // 修改角色
          // this.props.rts(
          //   {
          //     method: "post",
          //     url: `/accounts/role/set`,
          //     data: val
          //   },
          //   this.uuid,
          //   "newPage",
          //   () => {
          //     //this.props.goBack();
          //
          //   }
          // );
          //修改手机号
          this.props.rts(
            {
              method: "post",
              url: `/accounts/${id}/resetMobile`,
              data: values
            },
            this.uuid,
            "resetMobile",
            () => {
              //this.props.goBack();
              message.success('修改手机成功');
            }
          );
        }

       }


    })

  };

  // Model ok
  handleOk = () =>{

    this.setState({visible:false})
  };




  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {pageInfo, match} = this.props;
    const id = match.params.id;
    // console.log(id, match);

    // roleData下拉框的值
    const { disabled, roleData,terminalsData,selectedTable } = this.state;
    let page = {};


    if (pageInfo && pageInfo[this.uuid]) {
      page = pageInfo[this.uuid];
    }

    // console.log(page,"page")
    const child = (
      <Panel>
        <Form onSubmit={this.submitNew}>
          <div>
            <div style={{maxWidth: 750}}>
              <FormItem
                {...formItemLayout}
                label="用户姓名"
              >
                {getFieldDecorator("fullname", {
                  rules: [{
                    required: true,
                    message: '必填项',
                  }],
                  initialValue:   page.fullname || page.mobile || page.username
                })(
                  <Input  placeholder="请输入用户姓名" disabled={disabled}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="登录账号"
              >
                {getFieldDecorator("username", {
                  rules: [{
                    required: true,
                    message: '必填项',
                  }],
                  initialValue: page.username
                })(
                  <Input placeholder="请输入登录账号" disabled={disabled}/>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="登录密码"
              >
                {getFieldDecorator("password", {
                  rules: [{
                    required: true,
                    message: '必填项',
                  }],
                  initialValue: page.password
                })(
                  <Input placeholder="请输入登录密码"/>
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
              <InputNumber  placeholder="请输登录手机号"  style={{width:"100%"}} />

              )}

              </FormItem>
              <FormItem {...formItemLayout} label="角色">
                {getFieldDecorator(`roleId`, {
                  rules: [{required: true, message: '请为该用户选择一个角色'}],
                  initialValue: page && page.role ? page.role.name : "请为该用户选择一个角色",

                })(
                  <Select
                    style={{width: "100%"}}
                    disabled={disabled}
                  >
                    {
                      roleData && roleData.map((val, key) => {
                        return <Option value={val.id} key={key}>{val.name}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>


              {/*</div>*/}
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
	      	title = {page && page.fullname || this.props.title}
	      	child={child}
	      	onCancle={this.props.goBack}
	      	okText={id && id !== 'add'?'确认修改':'保存'}
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
const getTerminals = state => state.get("rts").get("getTerminals");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  pageInfo,
  getRole,
  getTerminals,
});

const WrappedUserListDetail = Form.create()(UserListDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedUserListDetail
);
