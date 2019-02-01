import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Form, Input, InputNumber, Modal, Select,Button,Card,Divider,Table,message,Popconfirm } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
// import styles from "./Index.scss";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

export class BatchManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OrderRefundMsg:{},
      orderByIdData: {},
      result: "true",
      reason:"1",
      loading:false,
      replyResult:"",
      disabled:false,
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }


  componentWillReceiveProps(nextProps) {
    const { getOrderId } = nextProps;
    if (getOrderId && getOrderId[this.uuid]) {
      const res = getOrderId[this.uuid]

      this.setState({
        orderByIdData: res,
        // money: res.refundReply || 0
      })
    }
  }



  confirm(id, bool) {

    this.props.rts(
      {
        method: "put",
        url: `/accounts/${id}/${bool ? 'enable' : 'disable'}`,
        // data: {
        //   active: bool
        // }
      },
      this.uuid,
      'pageInfo', () => {
        this.setState({refreshTable: true})
      }
    );
  }
    //
  // changeOrderRefundMsg = () => {
  //   const { OrderRefundMsg = {} } = this.state;
  //   Number(OrderRefundMsg.price)&& OrderRefundMsg.id &&
  //   this.props.rts(
  //     {
  //       method: "put",
  //       url: `/Products/${OrderRefundMsg.id}`,
  //       data: {
  //         price: product.price*100
  //       }
  //     },
  //     this.uuid,
  //     "fixProducts",()=>{
  //       this.setState({visible:false,refreshTable:true})
  //     }
  //   );
  // };


  check = () => {
    const {orderByIdData} = this.state;



    let id = orderByIdData.id;






    this.props.form.validateFieldsAndScroll((err, values) => {
      let agree = {
        price:values.refundedFee,
        reply:values.dealreason
      };
      let refuse = {
        reply:values.dealreason
      };

      if (!err) {


        if(values.refundStatus == "true"){
          if (values.refundedFee == 0){
            message.error("退款金额为0不可退款");
          }else{

            this.props.rts(
              {
                method: "post",
                url: `/Orders/${id}/audit/refund`,
                data:agree
              },
              this.uuid,
              "fixActive",
              () => {
                this.setState({ visible: false ,refreshTable:true,reason:"",loading:false});
                message.success("处理成功");

              }
            );
          }

        }else{

          this.props.rts(
            {
              method: "post",
              url: `/Orders/${id}/audit/refund`,
              data:refuse
            },
            this.uuid,
            "fixActive",
            () => {
              this.setState({ visible: false ,refreshTable:true,reason:"",loading:false});
              message.success("处理成功");

            }
          );
        }
      }
    });

    // const { OrderRefundMsg = {} , reason,} = this.state;
    // if (orderByIdData.id && !this.state.loading) {
    //
    // }
    //   this.state.loading = true;
  };


  getOrderId = (id) => {
    this.props.rts(
      {
        method: "get",
        url: `/Orders/${id}`,
        params: {
          filter: {
            include: 'terminal'
          }
        }
      },
      this.uuid,
      "getOrderId"
    );
  };

  refundStatus =(e) =>{


  }


  render() {
    const { getOrderId} = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // const { getFieldDecorator } = form;
    const {disabled, orderByIdData} = this.state;




    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/BatchCodes/pickup/record",
        include: ["account"],
      },
      // buttons: [
      //   {
      //     title: "新建",
      //     onClick: () => {
      //       this.setState({
      //         visible: true
      //       });
      //     }
      //   }
      // ],
      search: [
        {
          type: "field",
          field: "encryptCode",
          title: "批次号"
        },
        {
          type: "date",
          field: "createdAt",
          title: "领取时间"
        },
        {
          type: "relevance",
          field: "agentId",
          title: "代理商名称",
          model: {
            api: "/Agents",
            field: "name"
          }
        },
        {
          type: "relevance",
          field: "accountId",
          title: "申请补货员",
          model: {
            api: "/accounts",
            field: "fullname"
          }
        },
      ],
      columns: [
        {
          title: "批次号",
          dataIndex: "encryptCode",
          key: "encryptCode "
        },
        {
          title: "补货员",
          dataIndex: "account.fullname",
          key: "account.fullname",
        },
        {
          title: "代理商名称",
          dataIndex: "agent.name",
          key: "agent.name",
        },
        {
          title: "领取时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        // {
        //   title: "交易操作",
        //   key: "handle",
        //   render: (text, record) => (
        //     <span>
        //       <Button
        //         type="primary"
        //         size="small"
        //         style={{marginRight: '5px'}}
        //         onClick={() => {
        //           this.getOrderId(record.id);
        //           this.setState({
        //             visible: true
        //           });
        //         }}
        //       >
        //         编辑
        //       </Button>
        //       {record.enabled ? (
        //           <Popconfirm
        //             title="确认禁用该用户?"
        //             onConfirm={() => {
        //               this.confirm(record.id, false);
        //             }}
        //             okText="是"
        //             cancelText="否"
        //           >
        //             <Button type="danger" size="small" style={{marginRight: '5px'}}>禁用</Button>
        //           </Popconfirm>
        //         ) : (
        //           <Popconfirm
        //             title="确认启用该用户?"
        //             onConfirm={() => {
        //               this.confirm(record.id, true);
        //             }}
        //             okText="是"
        //             cancelText="否"
        //           >
        //             <Button size="small">启用</Button>
        //           </Popconfirm>
        //         )}
        //       {/*<Divider type="vertical" />*/}
        //       {/*<Popconfirm*/}
        //       {/*title="确认删除该页面?"*/}
        //       {/*onConfirm={() => {*/}
        //       {/*this.remove(record.id);*/}
        //       {/*}}*/}
        //       {/*okText="是"*/}
        //       {/*cancelText="否"*/}
        //       {/*>*/}
        //       {/*<a href="javascript:;">删除</a>*/}
        //       {/*</Popconfirm>*/}
        //     </span>
        //   )
        // }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      config:this.props.config,
	    title:this.props.title
    };
    // 弹框的表头&数据
    const columns2 = [
      {
        title: '商品图片',
        dataIndex: 'product.imageUrl',
        key: 'product.imageUrl',
        render: text => (
          <img
            src={text}
            alt="商品图片"
            title="点击放大"
            height="80"
            style={{background:"#af2e2d"}}
            onClick={() => {
              this.setState({ previewVisible: true, previewImage: text });
            }}
          />
        )
      },
      {
      title: '商品名称',
      dataIndex: 'product.name',
      key: 'product.name',
      },
      {
      title: '出货货道',
      dataIndex: 'product.barcode',
      key: 'product.barcode',
      }];
    const orderIdItems = this.state.orderByIdData.items;



    return (
      <section className="OrderManagement-page">
        <TableExpand
          {...config}
        />


        {/*退款审核弹框*/}
        <Modal
          //width="80%"
          visible={this.state.visible}
          title="批次详情"
          okText="确定"
          cancelText="取消"
          loading={this.state.loading}
          // style={{display:"flex"}}
          onOk={() => {
            this.check();
            this.props.form.resetFields()
          }}
          onCancel={() => {
            this.setState({
              visible: false,
              disabled: false
            }, () => {
              this.props.form.resetFields()
            });
          }}

        >
          <Form layout="vertical">
            {/*<div className="project-title">批次详情</div>*/}
            <FormItem {...formItemLayout} label="批次名称："  >
              {getFieldDecorator("reason", {
                rules: [{
                  required: true, message: '必填项',
                }],
                initialValue:orderByIdData.refundReason || ""
              })(
                <Input placeholder="请输入批次名称"/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="处理结果："  >
              {getFieldDecorator("refundStatus", {
                rules: [{
                  required: true, message: '必填项',
                }],
                initialValue: orderByIdData.refundStatus =="pass"? "同意退款":"拒绝退款"
              })(
                <Select
                  placeholder="请选择"
                  style={{ width: "100%" }}
                  // defaultValue={this.state.result}
                  // value={this.state.result}
                  // value={disabled?(orderByIdData.refundStatus == "apply")?"同意退款":(orderByIdData.refundStatus == "none"?"未申请退款":"拒绝退款"):this.state.result}
                  // onChange={val => {
                  //   this.setState({ result: val });
                  // }}
                  disabled={disabled}
                >
                  <Option value="true" disabled={getFieldValue('refundedFee') === 0}>同意退款</Option>
                  <Option value="false">拒绝退款</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="价格："  >
              {
                disabled?
                  <strong style={{color:"red"}}> ¥{orderByIdData.refundedFee}</strong>:
                  ( getFieldDecorator("refundedFee", {
                      rules: [{
                        required: true, message: '必填项',
                      }],
                      initialValue: orderByIdData.refundedFee || 0
                    })(

                      <InputNumber
                        min={0}
                        max={orderByIdData.price}
                        disabled={disabled}
                        style={{color:"red"}}
                      />)
                  )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => {
            this.setState({ previewVisible: false });
          }}
        >
          <img
            alt="商品图片(大)"
            style={{ width: "100%" }}
            src={this.state.previewImage}
          />
        </Modal>
    </section>
  )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const getOrderId = state => state.get("rts").get("getOrderId");

const mapStateToProps = createStructuredSelector({
  UUid,
  getOrderId
});
const WrappeBatchManagement = Form.create()(BatchManagement);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeBatchManagement);
