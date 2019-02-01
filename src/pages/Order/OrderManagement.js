import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Col, Row, Icon, Modal, Form, Select, Button, InputNumber, Input, message, Popover} from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import OutPutExcel from "../../components/OutPutExcel";
import caibao from "../../assets/img/caibao.png";
import { getParameterByName } from '../../utils/utils';
// import styles from "./Index.scss";
const FormItem = Form.Item;
const Option = Select.Option;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14}
};
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
export class OrderManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refundReason: ['没有掉货', '没掉商品', '商品损坏'],
      visible: false,
      orderRecord: {},
      disable: false,
      outPut: new OutPutExcel(props, uuid.v1()),
      //statusOptions:{"neq":"WAIT_PAY"},
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
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

  getStatus(obj, status) {
    let str = '';
    let arr = {};
    let result = {};
    for (let x in obj.logs) {
      for (let y in obj.logs[x].failedReasons) {
        arr[obj.logs[x].failedReasons[y]] = 1;
      }
    }
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
 	outPutFn(){
  	const {outPut} = this.state;
  	let _headers = ['订单编号', '下单时间','代理商名称','代理商属性','支付时间', '实付金额', '支付方式','出货点位','收款渠道','交易状态','出货状态'];
    const _fields = {'id':true,'createdAt':true,'payTime':true,'price':true,'payType':true,'position':{'name':true},
    'status':true,'shipmentStatus':true,'positionId':true,'agentId':true,'agent':{'name':true,'direct':true},
    "paymentId":true,'payment':{'name':true},
    };
    const _include = [
    	{relation:"position",scope:{fields:{'name':true}}},
    	{relation:"agent",scope:{fields:{'name':true,'direct':true}}},
    	{relation:"payment",scope:{fields:{'name':true}}}
    ];
    let excelObj = {path:'/Orders',where:{"neq":"WAIT_PAY"},include:_include,fields:_fields};
    outPut.toExcelData(excelObj,res=>{
      let _data = [];
	    res = res.data;
	   	for(let i in res){
   		let result = this.getStatus(res[i],res[i].shipmentStatus);
      _data.push({
	      '订单编号':res[i].id,
	      '下单时间':moment(res[i].createdAt).format("YYYY-MM-DD HH:mm"),
	      '代理商名称':res[i].agent?res[i].agent.name:'',
	      '代理商属性':res[i].agent?res[i].agent.direct?'直属':'一般':'',
	      '支付时间':moment(res[i].payTime).format("YYYY-MM-DD HH:mm"),
	      '实付金额':res[i].price,
	      '支付方式':res[i].payType==='wechat'?'微信':res[i].payType==='alipay'?'支付宝':'采宝',
	      '出货点位':res[i].position?res[i].position.name:'',
	      '收款渠道':res[i].payment?res[i].payment.name:'默认',
	      '交易状态':this.getPayType(res[i].status).str,
	      '出货状态':result.statusName+'\n'+result.str
      });
     }
     outPut.toExcelFile(_headers,_data,'订单列表.xlsx');
    })
	}

	// outPutFn(){
  // 	const {outPut} = this.state;
  // 	let _headers = ['订单编号', '下单时间','支付时间', '实付金额', '支付方式','出货点位','收款渠道','交易状态','出货状态'];
  //   const _fields = {'id':true,'createdAt':true,'payTime':true,'price':true,'payType':true,'position':{'name':true},
  //   'status':true,'shipmentStatus':true,'positionId':true,'agentId':true,"paymentId":true,'payment':{'name':true},
  //   };
  //   const _include = [
  //   	{relation:"position",scope:{fields:{'name':true}}},
  //   	// {relation:"agent",scope:{fields:{'name':true,'direct':true}}},
  //   	{relation:"payment",scope:{fields:{'name':true}}}
  //   ];
  //   let excelObj = {path:'/Orders',where:{"neq":"WAIT_PAY"},include:_include,fields:_fields};
  //   outPut.toExcelData(excelObj,res=>{
  //     let _data = [];
	//     res = res.data;
	//    	for(let i in res){
  //  		let result = this.getStatus(res[i],res[i].shipmentStatus);
  //     _data.push({
	//       '订单编号':res[i].id,
	//       '下单时间':moment(res[i].createdAt).format("YYYY-MM-DD HH:mm"),
	//       // '代理商名称':res[i].agent?res[i].agent.name:'',
	//       // '代理商属性':res[i].agent?res[i].agent.direct?'直属':'一般':'',
	//       '支付时间':moment(res[i].payTime).format("YYYY-MM-DD HH:mm"),
	//       '实付金额':res[i].price,
	//       '支付方式':res[i].payType==='wechat'?'微信':res[i].payType==='alipay'?'支付宝':'采宝',
	//       '出货点位':res[i].position?res[i].position.name:'',
	//       '收款渠道':res[i].payment?res[i].payment.name:'默认',
	//       '交易状态':this.getPayType(res[i].status).str,
	//       '出货状态':result.statusName+'\n'+result.str
  //     });
  //    }
  //    outPut.toExcelFile(_headers,_data,'订单列表.xlsx');
  //   })
  // }

  check = (id) => {

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        this.props.rts(
          {
            method: "post",
            url: `/Orders/${id}/refund`,
            data: {reason: values.reason}
          },
          this.uuid,
          "getOrderId",
          () => {
            this.setState({visible: false, refreshTable: true, orderRecord: {}});
            message.success("申请成功");

          }
        );
        this.props.form.resetFields()
      }
    });
  };
	allBack = (values)=>{
		return new Promise((resolve, reject)=>{
			this.props.rts(
	          {
	            method: "post",
	            url: `/Orders/${values.id}/refund`,
	            data: {reason: values.reason}
	          },
	          this.uuid,
	          "getOrderId",
	          () => {
	            message.success("申请成功");
	            resolve();
						 }
	        );
		})
	}
  render() {

    const {getFieldDecorator} = this.props.form;
    const {refundReason, orderRecord} = this.state;
    const config = {
    	hasInitValue:true,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Orders",
        // total: "/Orders/count"
        include: ["terminal", "position", "payment", "agent"],
        // include: ["terminal", "position", "payment"],
        where: {
          status: {"neq": "WAIT_PAY"},
          agent: true
        }
      },
      buttons: [
        {
          title: "导出EXCEL",
          onClick: () => {
            this.outPutFn();
          }
        },
       /* {
		      title: "一键申请退款",
		      onClick:async (data) => {
		      	for(let i in data){
		      		console.log(i);
		      		if(data[i].refundStatus!=='none'){
		      			continue;
		      		}
		      		await this.allBack({id:data[i].id,reason:'没掉商品'});
		      	}
//		        this.props.to(`${this.props.match.path}/detail/add`);
		    	}
        },*/
      ],
      search: [
        {
          type: "field",
          field: "id",
          title: "订单编号"
        },
        {
          type: "relevance",
          field: "positionId",
          title: "出货点位",
          model: {
            api: "/Positions",
            field: "name"
          }
        },
        {
          type: "option",
          title: "退款状态",
          field: "refundStatus",
          options: [
            {title: "未退款", value: "none"},
            {title: "申请退款", value: "apply"},
            {title: "同意退款", value: "pass"},
            {title: "拒绝退款", value: "refuse"}
          ]
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
        // {
        //   type: "option",
        //   title: "代理商属性",
        //   field: "direct",
        //   options: [
        //     {title: "直属", value: true},
        //     {title: "一般", value: null}
        //   ]
        // },
        {
          type: "date",
          field: "createdAt",
          title: "下单时间"
        },
        {
          type: "date",
          field: "payTime",
          title: "支付时间",
          values:{startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD')}
        },
        {
          type: "number",
          field: "price",
          title: "实付金额"
        },
        {
          type: "relevance",
          field: "paymentId",
          title: "收款渠道",
          model: {
            api: "/Payments",
            field: "name"
          },
          addOptions:[
          	{name:'默认',value:null},
          ]
        },
        {
         type: "relevance",
         field: "agentId",
         title: "代理商名称",
         add:{agent:false},
         model: {
           api: "/Agents",
           field: "name"
         }
       },
       /* {
          type: "field",
          field: "paymentId",
          title: "测试收款渠道",
          change:[
          	{name:'默认',to:null}
          ]
        },*/
      ],
      columns: [
        {
          title: "订单编号",
          dataIndex: "id",
          key: "id"
        },
        {
          title: "下单时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "代理商名称",
          dataIndex: "agent.name",
          key: "agent.name",
        },
        {
          title: "代理商属性",
          dataIndex: "agent.direct",
          key: "agent.direct",
          render: (text, record) => {
            return (
              text ? <span style={{color: "#8ddc57"}}>直属</span> : <span style={{color: "#1aaceb"}}>一般</span>
            )
          }
        },
        {
          title: "实付金额",
          dataIndex: "price",
          key: "price",
          align: "right",
          sort: true
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
          title: "出货点位",
          dataIndex: "position.name",
          key: "position.name",
          render: (text, record) => {
            const content = (
              <div>
                <p>设备编号：{record.terminal && record.terminal.code}</p>
                <p>设备名称：{record.terminal && record.terminal.name}</p>
                {record.items && record.items.map((v, i) => {
                  return (
                    <p key={i}>出货货道：{v.slot && v.slot.serialPort ? v.slot.serialPort :"数据被删除"}</p>
                  )
                })}
              </div>
            );
            return (
              <Popover content={content} trigger="hover" placement="bottomLeft">
                <span style={{cursor:'pointer'}}>{record.position && record.position.name}</span>
              </Popover>)
          }
        },
        {
          title: "红外检测(盒)",
          dataIndex: "infraredCount",
          key: "infraredCount",
          // align: "right",
          render: (text, record) => {
            return (
              <div>
                {record.logs && record.logs.map((v, i) => {
                  return (
                    <p key={i}>{v.infraredCount || 0}</p>
                  )
                })}
              </div>
            )
          }
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
          title: "收款渠道",
          dataIndex: "payment",
          key: "payment",
          render: (text, record) => {
            return <span>{record.payment ? record.payment.name : '默认'}</span>;
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
          title: "支付时间",
          dataIndex: "payTime",
          key: "payTime",
          render: (record) => {
            return record ? moment(record).format('YYYY-MM-DD HH:mm'):"----";
          }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              {record.refundStatus == "apply" ?
                <Button
                  className="unUseButton"
                  size="small"
                  style={{marginRight: '5px', color: "#ffffff", background: "#f3b981", borderColor: "#f3b981"}}
                  disabled
                >
                  已申请
                </Button>
                :
                (record.refundStatus == "pass" ?
                    <Button
                      size="small"
                      className="unUseButton"
                      style={{marginRight: '5px', color: "#ffffff", background: "#3dcabb", borderColor: "#3dcabb"}}
                      disabled
                    >
                      已退款
                    </Button>
                    :
                    (record.status == "PAY" ?
                        <Button
                          className="buttonListFirst"
                          size="small"
                          style={{marginRight: '5px'}}
                          onClick={() => {
                            this.setState({

                              visible: true,
                              orderRecord: record
                            })
                          }}
                        >
                          申请退款
                        </Button>
                        :
                        (record.status == "WAIT_REFUND" ?
                            <Button
                              className="buttonListFirst"
                              size="small"
                              style={{marginRight: '5px'}}
                              onClick={() => {
                                this.setState({
                                  visible: true,
                                  orderRecord: record
                                })
                              }}
                            >
                              申请退款
                            </Button>
                            :
                            <Button
                              size="small"
                              className='unUseButton'
                              style={{marginRight: '5px'}}
                              disabled="disabled"
                            >
                              无操作
                            </Button>
                        )
                    )
                )
              }

            </span>


          )
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({refreshTable: false});
      },
      config:this.props.config,
	    title:this.props.title,
	    resetFresh:true
    };
    return (
      <section className="OrderManagement-page">
        <TableExpand
          {...config}
        />
        {/*退款弹窗*/}
        <Modal
          visible={this.state.visible}
          title="退款申请"
          okText="确定"
          cancelText="取消"
          loading={this.state.loading}
          // style={{display:"flex"}}
          onOk={() => {
            this.check(orderRecord.id);

          }}
          onCancel={() => {
            this.setState({
              visible: false,
              //disabled: false
            }, () => {
              this.props.form.resetFields()
            });
          }}

        >
          <Form layout="vertical">
            <FormItem {...formItemLayout} label="订单号：">
              {( getFieldDecorator("id", {
                  rules: [{
                    required: true, message: '必填项',
                  }],
                  initialValue: orderRecord.id || 0
                })(
                  <Input disabled={true}/>
                )
              )}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="申请退款：" >*/}
            {/*{( getFieldDecorator("price", {*/}
            {/*rules: [{*/}
            {/*required: true, message: '必填项',*/}
            {/*}],*/}
            {/*initialValue: orderRecord.price|| 0*/}
            {/*})(*/}
            {/*<InputNumber*/}
            {/*// defaultValue={orderByIdData.price}*/}
            {/*// formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
            {/*// parser={value => value.replace(/\$\s?|(,*)/g, '')}*/}
            {/*min={0}*/}
            {/*max={orderRecord.price}*/}
            {/*//disabled={disabled}*/}
            {/*style={{color:"red"}}*/}
            {/*/>*/}
            {/*)*/}
            {/*)}*/}
            {/*</FormItem>*/}
            <FormItem {...formItemLayout} label="退款原因：">
              {getFieldDecorator(`reason`, {
                rules: [{message: '请选择退款原因', required: true}],
                // initialValue: product && product.name || ''
              })(
                <Select
                  placeholder="请选择退款原因"
                >
                  {
                    refundReason && refundReason.map((v, i) => (
                      <Option value={v} key={i}>{v}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(OrderManagement));
