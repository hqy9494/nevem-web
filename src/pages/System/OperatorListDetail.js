import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Row, Col, Panel, Tabs, Tab } from "react-bootstrap";
import { Form, Select, Button, Input, message ,Switch,InputNumber } from "antd";
import FormExpand from "../../components/FormExpand";
import { getRegular } from '../../components/CheckInput';
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};



export class OperatorListDetail extends React.Component {
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
        url: `/Operators/${id}`
      },
      this.uuid,
      "pageInfo"
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
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      //values.roleId += '';
      values.mobile+= '';
      if (!err) {
        this.props.rts(
          {
            method: "post",
            url: `/Operators`,
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



    const child = (
      <Panel>
        <Form onSubmit={this.submitNew}>
          <div style={{ maxWidth: 750 }}>
            <div>
              <FormItem
                {...formItemLayout}
                label="运营商"
              >
                {getFieldDecorator("name", {
                  rules: [{
                    required: true, message: '必填项',
                  }],
                  initialValue: page.name
                })(
                  <Input  placeholder="请输入运营商名称" disabled={disabled}/>

                )}

              </FormItem>

              {
                id && id === 'add' &&
                <div>
                  <FormItem
                    {...formItemLayout}
                    label="手机号"
                  >
                    {getFieldDecorator("mobile", {
                      rules: [{
                        required: true,
                        message: '请输入正确的11位手机号',
                        pattern: getRegular('mobile-phone')
                      }],
                      initialValue: page.mobile

                    })(
                      <InputNumber placeholder="请输入账号" length={11} style={{width: "100%"}}/>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="登录账号"
                  >
                    {getFieldDecorator("username", {
                      rules: [{
                        required: true, message: '必填项',
                      }],
                      initialValue: page.username
                    })(
                      <Input  placeholder="请输入登录账号" disabled={disabled}/>

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
                      <Input  placeholder="请输入登录密码" disabled={disabled}/>
                    )}
                  </FormItem>
                </div>

              }

            </div>
           {/* <FormItem wrapperCol={{ span: 12, offset: 6 }}>
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
	      	cancleText={id && id !== 'add'?'返回':'取消'}
	      	onCancle={this.props.goBack}
	      	removeOkButton={id && id !== 'add'?true:false}
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

const WrappedOperatorListDetail = Form.create()(OperatorListDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedOperatorListDetail
);
