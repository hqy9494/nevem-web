import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {
  Tabs,
  Col,
  Row,
  Icon,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Button,
  Card,
  Divider,
  Table,
  message
} from "antd";
import {Panel} from "react-bootstrap";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import { getParameterByName } from '../../utils/utils';
import caibao from "../../assets/img/caibao.png";
// import styles from "./Index.scss";
const TabPane = Tabs.TabPane;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14}
};

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const errInfoObj = {
  'NO_SERIAL_PORT': '没有串口',
  'BUSY': '系统繁忙',
  'TIMEOUT': '系统超时',
  'NO_ELECTRIC': '检测电机不存在',
  'KAWEI': '设备卡位',
  'BOARD_NO_RESPONSE': '设备无响应',
  'UNKNOW': '断电/异常退出',
  'KAISI_03': '位置线断开/电机卡死不转,在缺口位置',
  'KAISI_04': '位置线常闭,转7s多于1圈/电机卡死不转,不在缺口位置',
  'LESS2_05': '转小于2s小于1圈,在缺口位置',
  'DAYU5_06': '转大于2s多于1圈,在缺口位置',
  'DAYU7_07': '转7圈多于1圈,不在缺口位置',
  'LIANGOUAN_10': '电机转了两圈',
  'HWNO_12': '转了半圈,无商品掉下',
  'HWNO_13': '红外检测到低平,被挡住/接触不良',
  'HWZD_17': '转了7s,红外被挡住',
  'HWZD_18': '转了5s,红外被挡住',
  'OTHER': '其他状态',
  'CRC': 'CRC出错',
}


export class OrderRefund extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OrderRefundMsg: {},
      orderByIdData: {},
      result: "true",
      reason: "1",
      loading: false,
      replyResult: "",
      disabled: false,
      screening: "apply",
      thisScreening: {refundStatus: "apply"}
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  	const params = getParameterByName('q')? JSON.parse(decodeURIComponent(getParameterByName('q'))) : {};
    this.setState({screening: params.tabsKey || "apply"});
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const {getOrderId} = nextProps;
    if (getOrderId && getOrderId[this.uuid]) {
      const res = getOrderId[this.uuid]
      this.setState({
        orderByIdData: res,
        // money: res.refundReply || 0
      })
    }
  }
	getPayType(text) {
    switch (text) {
      case "WAIT_PAY":
        return {str:"未付款",className:"statusRedOne"};
      case "PAY":
        return {str:"已付款",className:"statusGreyOne"};
      case "WAIT_REFUND":
        return {str:"等待退款",className:"statusBlueTree"};
      case "REFUND":
        return {str:"已退款",className:"statusGreyOne"};
      default:
        break;
    }
  }

  check = () => {
    const {orderByIdData} = this.state;

    let id = orderByIdData.id;
		console.log(id)
    this.props.form.validateFieldsAndScroll((err, values) => {

    	console.log(values,'values');
      let agree = {
        price: values.refundedFee,
        reply: values.refundReply
      };
      let refuse = {
        reply: values.refundReply
      };
      console.log(values);
      if (!err) {
        if (values.refundStatus == "true") {
          if (values.refundedFee == 0) {
            message.error("退款金额为0不可退款");
          }
          else {
            this.props.rts(
              {
                method: "post",
                url: `/Orders/${id}/audit/refund`,
                data: agree
              },
              this.uuid,
              "fixActive",
              () => {
                this.setState({visible: false, refreshTable: true, reason: "", loading: false});
                message.success("处理成功");
								this.props.form.resetFields()
              }
            );
          }

        }
        else {
          this.props.rts(
            {
              method: "post",
              url: `/Orders/${id}/audit/refund`,
              data: refuse
            },
            this.uuid,
            "fixActive",
            () => {
              this.setState({visible: false, refreshTable: true, reason: "", loading: false});
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
	allBack = (agree,id)=>{
		return new Promise((resolve, reject)=>{
			this.props.rts(
	      {
	        method: "post",
	        url: `/Orders/${id}/audit/refund`,
	        data: agree
	      },
	      this.uuid,
	      "fixActive",
	      () => {
	        message.success("处理成功");
							resolve();
	      }
	    );
		})
	}
	getStatus(obj, status) {
    let str = '';
    let arr = {};
    let result = {};
    for (let x in obj.logs) {
      for (let y in obj.logs[x].failedReasons) {
        arr[obj.logs[x].failedReasons[y]] = 1;
      }
    }
    ;
    for (let z in arr) {
      str += errInfoObj[z] + ',';
    }
    if (status == -1) {
      result.statusName = '失败';
      result.className = 'statusRedOne';
    }
    else if (status == 1) {
      result.statusName = '成功';
      result.className = 'statusGreyOne';
    }
    else {
    	result.className = 'statusBlueTree';
      result.statusName = '等待出货';
    }
    result.str = str.substr(0, str.length - 1);
    return result;
  }


  render() {
    const {getOrderId} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {disabled, orderByIdData, screening, isTabPane, thisScreening} = this.state;
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Orders",
        include: "terminal",
        where: screening === "error" ? {status: "WAIT_REFUND", agent: true} : {refundStatus: screening, agent: true}
      },
	    buttons: [
	      /*{
	        title: "一键退款",
	        onClick:async (data) => {
		      	for(let i in data){
		      		console.log(i);
		      		let agree = {
				        price: 0.01,
				        reply: '测试同意退款'
				      };
		      		if(data[i].refundStatus!=='apply'){
		      			continue;
		      		}
		      		await this.allBack(agree,data[i].id);
		      	}
//		        this.props.to(`${this.props.match.path}/detail/add`);
		    	}
	      }*/
	    ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({refreshTable: false});
      },
      config:this.props.config,
	    title:this.props.title
    };
    const tabsConfig={
    	search: [
        {
          type: "field",
          field: "id",
          title: "订单编号"
        },
        {
          type: "option",
          title: "出货状态",
          field: "shipmentStatus",
          options: [
            {title: "失败", value: -1},
            {title: "等待出货", value: 0},
            {title: "成功", value: 1}
          ]
        },
        {
          type: "option",
          title: "支付方式",
          field: "payType",
          options: [
            {title: "微信", value: "wechat"},
            {title: "支付宝", value: "alipay"},
            {title: "采宝", value: "caibao"},

          ]
        },
        {
          type: "date",
          field: "createdAt",
          title: "下单时间"
        },
        {
          type: "date",
          field: "payTime",
          title: "支付时间"
        },
        {
          type: "date",
          field: "updatedAt",
          title: "申请退款时间"
        },
        {
          type: "number",
          field: "price",
          title: "实付金额"
        },
        {
          type: "field",
          field: "refundReason",
          title: "申请原因"
        }
      ],
      columns: [
        {
          title: "订单编号",
          dataIndex: "id",
          key: "id"
        },
        {
          title: "支付方式",
          dataIndex: "payType",
          key: "payType",
          render: (text, record) => {
            switch (text) {
              case "wechat":
                return <Icon type="wechat" style={{color: "#8ddc57", fontSize: "26px"}}/>;
              case "alipay":
                return <Icon type="alipay-circle" style={{color: "#1aaceb", fontSize: "26px"}}/>;
              case "caibao":
                return <img src={caibao} alt="采宝" style={{color: "#1aaceb", fontSize: "26px", width: '25px', height: '25px'}}/>;
              default:
                break;
            }
          }
        },
        {
          title: "出货设备",
          dataIndex: "terminal.name",
          key: "terminal.name"
        },
        {
          title: "交易状态",
          dataIndex: "status",
          key: "status",
          render: (text, record) => {
          	let result = this.getPayType(text);
          	return <span className={result.className}>{result.str}</span>;
          }
        },
        {
          title: "出货状态",
          dataIndex: "shipmentStatus",
          key: "shipmentStatus",
          render: (text, record) => {
            let result = this.getStatus(record, text);
            return <div><span className={result.className}>{result.statusName}</span><br/>{result.str}</div>;
          }
        },
        {
          title: "退款状态",
          dataIndex: "refundStatus",
          key: "refundStatus",
          render: (text, record) => {
            switch (text) {
              case "none":
                return <span className="statusGreyOne">未退款</span>;
              case "apply":
                return <span className="statusBlueTree">申请退款</span>;
              case "pass":
                return <span className="statusGreenOne">同意退款</span>;
              case "refuse":
                return <span className="statusRedOne">拒绝</span>;
              default:
                break;
            }
          }
        },
        {
          title: "申请原因",
          dataIndex: "refundReason",
          key: "refundReason",
        },
        // {
        //   title: "图片",
        //   dataIndex: "design.url",
        //   key: "design.url",
        //   render: text => (
        //     <img
        //       src={text}
        //       alt="商品图片"
        //       title="点击放大"
        //       height="80"
        //       style={{background:"#af2e2d"}}
        //       onClick={() => {
        //         this.setState({ previewVisible: true, previewImage: text });
        //       }}
        //     />
        //   )
        // },
        {
          title: "下单时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "支付时间",
          dataIndex: "payTime",
          key: "payTime",
          render: (record) => {
            return record ? moment(record).format('YYYY-MM-DD HH:mm'):"----";
          }
        },
        {
          title: "申请退款时间",
          dataIndex: "updatedAt",
          key: "updatedAt",
          type: "date",
          sort: true
        },
        {
          title: "实付金额",
          dataIndex: "price",
          key: "price",
          align: "right",
          sort: true

        },
        // {
        //   title: "错误信息",
        //   dataIndex: "buyerNick",
        //   key: "buyerNick"
        // },
        {
          title: "交易操作",
          key: "handle",
          render: (text, record) => (
            <span>
              {record.refundStatus == "apply" ? (
                  <Button
                    className="buttonListFirst"
                    size="small"
                    style={{marginRight: '5px'}}
                    onClick={() => {
                      this.getOrderId(record.id);
                      this.setState({

                        visible: true
                      });
                    }}
                  >
                    处理订单
                  </Button>
                ) : (
                  record.status=="WAIT_REFUND" ?
                    <Button
                      className="buttonListFirst"
                      size="small"
                      style={{marginRight: '5px'}}
                      onClick={() => {
                        this.getOrderId(record.id);
                        this.setState({

                          visible: true
                        });
                      }}
                    >
                      处理订单
                    </Button>:
                  <Button
                    className="buttonListFirst"
                    size="small"
                    style={{marginRight: '5px'}}
                    onClick={() => {
                      this.getOrderId(record.id);
                      this.setState({
                        disabled: true,
                        visible: true
                      });
                    }}
                  >
                    详情
                  </Button>
                )}
            </span>
          )
        }
      ],
    }
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
            onClick={() => {
              this.setState({previewVisible: true, previewImage: text});
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
        dataIndex: 'slot.name',
        key: 'slot.name',
      }];
    const orderIdItems = this.state.orderByIdData.items;
    return (
      <section className="OrderManagement-page">
        <TableExpand
          {...config}
          isTabs={true}
          defaultKey="apply"
          onTabsClick={(key)=>{
          	this.setState({screening:key,refreshTable:true});
          }}
          TabsData={[{key:"apply",title:'未审核',data:tabsConfig},{key:"pass",title:'已退款',data:tabsConfig}
          ,{key:"refuse",title:'未退款',data:tabsConfig},{key:"error",title:'退款失败',data:tabsConfig}]}
        />
        {/*退款审核弹框*/}
        <Modal
          width="80%"
          visible={this.state.visible}
          title="退款审核"
          okText="确定"
          cancelText="取消"
          loading={this.state.loading}
          // style={{display:"flex"}}
          onOk={() => {
            this.check();
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
          <Row>
            <Form layout="vertical">
              {/*用户基本信息*/}
              <Col span={6}>
                <Row type="flex" justify="space-around" align="middle">
                  <Col span={12} style={{width: "80%", textAlign: "center"}}>
                    <img
                      alt="用户未关注公众号"
                      style={{width: "100%"}}
                      src={orderByIdData.buyerData && orderByIdData.buyerData.avatar}

                    />
                    <p style={{lineHeight: "36px",}}>
                      <strong>{orderByIdData.buyerData && orderByIdData.buyerData.nickname}</strong></p>
                  </Col>
                  {/*用户购买信息记录*/}
                  {/*<Col span={20}>*/}
                  {/*<Card  hoverable style={{width:"90%",background:"#f0f0f0",boxShadow:"1px 1px 1px 1px #e2e2e2"}}>*/}
                  {/*<p>购买次数:[接数据]</p>*/}
                  {/*<p>退款成功次数:[接数据]</p>*/}
                  {/*<p>已退款次数:[接数据]</p>*/}
                  {/*</Card>*/}
                  {/*</Col>*/}
                </Row>
              </Col>
              <Col span={18}>
                {/*用户历史信息*/}
                {/*<div>*/}
                {/*<p><strong>用户历史信息</strong></p>*/}
                {/*<p>累计购买:[接数据],共[接数据]笔订单</p>*/}
                {/*</div>*/}
                {/*<Divider />*/}

                <div>
                  <div className="project-title">本次退款详情</div>
                  {/*<p><strong>本次退款详情</strong></p>*/}
                  {/*商品信息*/}
                  <div>
                    <Table columns={columns2} dataSource={orderIdItems} rowKey="id"/>
                  </div>
                  {orderByIdData && orderByIdData.refundPics && orderByIdData.refundPics.length > 0 ?
                    <div>
                      <Col span={6}
                           style={{height: 100, width: 100, padding: 20, marginBottom: 20, overflow: "hidden"}}>

                        {orderByIdData.refundPics.map((res, index) => {
                          return (
                            <img
                              alt="图片说明"
                              title="点击放大"
                              style={{width: "100%"}}
                              key={index}
                              src={res}
                              onClick={() => {
                                this.setState({previewVisible: true, previewImage: res});
                              }}
                            />
                          )
                        })}


                      </Col>
                      <Divider/>
                    </div>
                    : ""
                  }

                  <Col span={12}>
                    {/*<p>退款金额:*/}
                    {/*{disabled?*/}
                    {/*<strong style={{color:"red"}}> ¥{orderByIdData.refundedFee}</strong>:*/}
                    {/*(*/}
                    {/*<InputNumber*/}
                    {/*defaultValue={orderByIdData.price}*/}
                    {/*formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                    {/*parser={value => value.replace(/\$\s?|(,*)/g, '')}*/}
                    {/*min={0}*/}
                    {/*max={orderByIdData.price}*/}
                    {/*disabled={disabled}*/}
                    {/*style={{color:"red"}}*/}
                    {/*//onChange={onChange}*/}
                    {/*/>*/}
                    {/*)*/}
                    {/*}*/}
                    {/*</p>*/}
                    <FormItem {...formItemLayout} label="退款金额：">
                      {
                        disabled ?
                          <strong style={{color: "red"}}> ¥{orderByIdData.refundedFee}</strong> :
                          ( getFieldDecorator("refundedFee", {
                              rules: [{
                                required: true, message: '必填项',
                              }],
                              initialValue: orderByIdData.price || 0
                            })(
                              <InputNumber
                                // defaultValue={orderByIdData.price}
                                // formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                // parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                min={0}
                                max={orderByIdData.price}
                                disabled={disabled}
                                style={{color: "red"}}
                                //onChange={v => {
                                //  this.setState({
                                //    money: v
                                //  })
                                //}}
                              />)
                          )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="申请时间：">
                      {getFieldDecorator("time", {
                        rules: [{
                          //initialValue:orderByIdData.refundReply || ""
                        }]
                      })(
                        <strong>{moment(orderByIdData.updatedAt).format("YYYY-MM-DD HH:mm")}</strong>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="出货设备：">
                      {getFieldDecorator("terminalName", {
                        rules: [{
                          //initialValue:orderByIdData.refundReply || ""
                        }]
                      })(
                        <strong>{orderByIdData.terminal && orderByIdData.terminal.name }</strong>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="申请原因：">
                      {getFieldDecorator("reason", {
                        rules: [{
                          //initialValue:orderByIdData.refundReply || ""
                        }]
                      })(
                        <strong>{orderByIdData.refundReason}</strong>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="退款理由：">
                      {getFieldDecorator("refundRemarks", {
                        rules: [{}],
                        initialValue: orderByIdData.refundRemarks || ""
                      })(
                        <TextArea rows={2}
                                  disabled={true}
                        />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="处理结果">
                      {getFieldDecorator("refundStatus", {
                        rules: [{
                          required: true, message: '必填项',
                        }],
                        initialValue: orderByIdData.refundStatus == "pass" ? "同意退款" : "拒绝退款"
                      })(
                        <Select
                          placeholder="请选择"
                          style={{width: "100%"}}
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
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="支付金额：">
                      {getFieldDecorator("payPrice", {
                        rules: [{}]
                      })(
                        <strong>¥{orderByIdData.price}</strong>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="支付时间：">
                      {getFieldDecorator("payTime", {
                        rules: [{
                          //initialValue:orderByIdData.refundReply || ""
                        }]
                      })(
                        <strong>{moment(orderByIdData.payTime).format("YYYY-MM-DD HH:mm")}</strong>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="出货状态：">
                      {getFieldDecorator("shipmentStatus", {
                        rules: [{
                          //initialValue:orderByIdData.refundReply || ""
                        }]
                      })(
                        <strong>
                          {orderByIdData.shipmentStatus == -1 ? "失败" : (orderByIdData.shipmentStatus == 0 ? "等待出货" : "成功")}
                        </strong>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="处理结果原因">
                      {getFieldDecorator("refundReply", {
                        rules: [{
                          required: true, message: '必填项',
                        }],
                        // initialValue:disabled?orderByIdData.refundReply:this.state.replyResult
                        initialValue: orderByIdData.refundReply || ''
                      })(
                        <TextArea rows={4}
                          // value={disabled?orderByIdData.refundReply:this.state.replyResult}
                          // value={this.state.replyResult}
                                  disabled={disabled}
                          //onChange={vals => {
                          //  let val = vals.target.value;
                          //  this.setState({ replyResult: val });
                          //}}
                          // onChange ={this.refundStatus}
                        />
                      )}
                    </FormItem>
                  </Col>

                </div>
              </Col>

            </Form>


          </Row>

        </Modal>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => {
            this.setState({previewVisible: false});
          }}
        >
          <img
            alt="商品图片(大)"
            style={{width: "100%"}}
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
const WrappeOrderRefund = Form.create()(OrderRefund);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeOrderRefund);
