import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Col, Row, Icon, Card, Modal, Form, Select, Table, Button, Input, message ,Switch,InputNumber } from "antd";
import FormExpand from "../../components/FormExpand";
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class AdvertisingStrategyListAdd extends React.Component {
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

        }else {
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
                message.success('修改成功');
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
          //     this.props.goBack();
          //   }
          // );
        }

      }


    })

  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { pageInfo,match } = this.props;
    const id = match.params.id;

    const { disabled, roleData } = this.state;

    let page = {};

    if (pageInfo && pageInfo[this.uuid]) {
      page = pageInfo[this.uuid];
    }

    return (
      <section className="GoodManagementDetail-page EquipmentInfoDetail-page">
        <div className="project-title">基本信息</div>
        <Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleSubmit}>
          <Card title="策略信息">
            <Row gutter={24}>
              <Col sm={8}>
                <FormItem label={`策略名称`} {...formItemLayout}>
                  {getFieldDecorator(`name`, {
                    rules: [{ message: '请输入策略名称', required: true}],
                    initialValue: page && page.role && page.role.name || ""
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={8}>
                <FormItem label={`备注`} {...formItemLayout}>
                  {getFieldDecorator(`manufacturer`, {
                    rules: [{message: '请输入备注', required: true}],
                    initialValue: page && page.fullname || ''
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="策略内容" className="mt-20">
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem style={{ border: '1px solid #ddd', borderRadius: '3px'}}>
                  <div style={{
                    width: '100%', 
                    padding: '5px', 
                    borderBottom: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <div>素材</div>
                    <Button>新建</Button>
                  </div>
                  <Table
                    bordered
                    locale={{
                      emptyText: '暂无数据'
                    }}
                  />
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem style={{ border: '1px solid #ddd', borderRadius: '3px'}}>
                  <div style={{
                    width: '100%', 
                    padding: '5px', 
                    borderBottom: '1px solid #ddd',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <div>设备</div>
                    <Button>新建</Button>
                  </div>
                  <Table
                    bordered
                    locale={{
                      emptyText: '暂无数据'
                    }}
                  />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <div className="ta-c mt-20">
            <Button style={{ marginRight: 8 }} onClick={() => {
              this.props.goBack()
            }}>
              返回
            </Button>
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </section>
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

const WrappedAdvertisingStrategyListAdd = Form.create()(AdvertisingStrategyListAdd);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedAdvertisingStrategyListAdd
);
