import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col,Row,Icon,Form,Input,Select,Button,Spin,Modal,message } from "antd";
import DetailTemplate from "../../components/DetailTemplate"
import { Panel } from "react-bootstrap";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import { getParameterByName } from '../../utils/utils';
import './ApplyRefund.scss';
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
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
export class ApplyRefund extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				loading:false,
				applyData:{},
				visible:false
		};
		this.uuid = uuid.v1();
	}

	componentWillMount() {}

	componentDidMount() {}
	handleSubmit = (e) => {
		const { applyData } = this.state;
		const { order = {} } = applyData;
		this.props.form.validateFieldsAndScroll((err, values) => {
			if(values.orderId && values.reason){
				this.setState({loading:true},()=>{
					this.props.rts(
						{
							method: "post",
							url: `/Orders/${values.orderId}/outTrade/refund`,
							data: {reply: values.reason,price:Number(values.price),type:order.payType}
						},
						this.uuid,
						"getOrderId",
						() => {
							const { rts } = this.props;
								rts(
									{
										method: 'get',
										url: `/Orders/${values.orderId}/outTrade`,
										params: {type:order.payType},
										error:(err)=>{
											this.setState({loading:false});
										}
									},
									this.uuid,
									'searchData',
									(res = {}) => {
										if(Object.keys(res).length>0){
											res.order = res.order === null? {} : res.order;
											res.outOrder = res.outOrder === null? {} : res.outOrder;
											this.setState({loading:false,applyData:res,visible: false});
											message.success("退款成功！");
										}else{
											this.setState({loading:false,visible: false});
											message.success("退款成功！");
										}
									}
								)
						}
					);
				});
			}else{
				message.error("请选择退款原因！")
			}
		})
	}
	/*搜索 */
	searchClick = (e) =>{
		e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
				this.setState({loading:true,applyData:{}},()=>{
					const { rts } = this.props;
					rts(
						{
							method: 'get',
							url: `/Orders/${values.id}/outTrade`,
							params: {type:values.payType},
							error:(err)=>{
								this.setState({loading:false});
							}
						},
						this.uuid,
						'searchData',
						(res = {}) => {
							if(Object.keys(res).length>0){
								res.order = res.order === null? {} : res.order;
								res.outOrder = res.outOrder === null? {} : res.outOrder;
								this.setState({loading:false,applyData:res});
							}else{
								this.setState({loading:false});
							}
						}
					)
				});
			}
		})
	}
	//获取支付方式
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
	//获取出货状态并且返回失败原因
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
	//显示弹窗
	showModel = () => {
		const { applyData } = this.state;
		this.props.form.setFieldsValue({orderId:applyData.outOrder.id,price:applyData.outOrder.price});
		this.setState({visible:true});
	}
	//重置
	resetSearch = () => {
		this.setState({applyData:{}});
		this.props.form.resetFields();
	}
	render() {
		/*定义变量区域*/ 
		const refundReason = ['没有掉货', '没掉商品', '商品损坏'];
		const { loading,applyData,visible } = this.state;
		const { order = {},outOrder = {} } = applyData;
		const getShipmentStatus = order.shipmentStatus?this.getStatus(order,order.shipmentStatus):{};
		const getPayStatus = order.status?this.getPayType(order.status):{};
		const getOutPayStatus = outOrder.status?this.getPayType(outOrder.status):{};
		const { getFieldDecorator } = this.props.form;
		const SelectOptions = [
			{name:"采宝",className:"caibao",value:"caibao"},
			{name:"微信",className:"wechat",value:"wechat"},
			{name:"支付宝",className:"alipay",value:"alipay"},
		]
		const payWay = {caibao:"采宝",wechat:"微信",alipay:"支付宝"}
		const payStatusColor = {pay:"#333",unpay:"#eee",refund:"#ff0000"};//交易状态
		const toStatusColor = {success:"#3dcabb",lose:"#FDB75B"};//出货状态
		/*定义变量区域*/
		const child = (
			<section className="ApplyRefund">
        <Form>
          <Row gutter={24} className="topSearch">
            <Col sm={8}>
              <FormItem label={`第三方订单号`}>
                {getFieldDecorator(`id`, {
                  rules: [{message: '第三方订单号（非心愿先生订单号）', required: true}],
                })(
                  <Input placeholder="第三方订单号（非心愿先生订单号）"/>
                )}
              </FormItem>
            </Col>
						<Col sm={8}>
              <FormItem label={`支持类型`}>
                {getFieldDecorator(`payType`, {
                  rules: [{message: '请选择支持类型', required: true}],
                })(
                  <Select
										style={{width:"100%"}}
										placeholder="请选择支持类型"
										getPopupContainer={triggerNode => triggerNode.parentNode}
									>
										{SelectOptions && SelectOptions.map((item,i)=>
											<Option value={item.value} key={i} className="ApplyRefundOptions"><span className={item.className}></span>{item.name}</Option>
										)}
									</Select>
                )}
              </FormItem>
            </Col>
						<Col sm={8} style={{textAlign:"right"}}>
							<Button type="primary" style={{marginRight:'10px'}} onClick={this.searchClick}>搜索</Button>
		        	<Button onClick={this.resetSearch}>重置</Button>
						</Col>
          </Row>
        	<div>
						{Object.keys(applyData).length<1?
						<div className="imgbox">
							<img src="../../assets/img/searchNoData.png"/>
						</div>:
						<div className="ApplyContainer">
							<div className="ApplyContent">
								<div className="leftContent">
									<div className="project-title">
										系统消息				
									</div>	
									<div className="ApplyDataBox">
										<div><span className="title">订单号：</span><span className="text">{order.id || "无"}</span></div>
										<div><span className="title">支付金额：</span><span className="text">{order.price || "无"}</span></div>
										<div><span className="title">下单时间：</span><span className="text">{order.createdAt?moment(order.createdAt).format("YYYY-MM-DD HH:mm"):"无"}</span></div>
										<div><span className="title">支付时间：</span><span className="text">{order.payTime?moment(order.payTime).format("YYYY-MM-DD HH:mm"):"无"}</span></div>
										<div><span className="title">红外检测（盒）：</span><span className="text">
											{order.logs ? order.logs.map((v, i) => v.infraredCount || 0):"无"}
										</span></div>
										<div><span className="title">出货设备：</span><span className="text">{(order.terminal && order.terminal.name) || "无"}</span></div>
										<div><span className="title">代理商名称：</span><span className="text">{order.agent && order.agent.name || "无"}</span></div>
										<div><span className="title">交易状态：</span><span className={"text "+getPayStatus.className}>{getPayStatus.str || "无"}</span></div>
										<div><span className="title">出货状态：</span><span className={"text "+getShipmentStatus.className || ""}>
											{(getShipmentStatus.statusName || "无")+" "+(getShipmentStatus.str || "")}
										</span></div>
										<div><span className="title">支付方式：</span>
											{
												order.payType?
												<span className="text">
												<span className={order.payType}></span>{payWay[order.payType]}
											</span>:
											<span className="text">
												无
											</span>
											}
										</div>
									</div>				
								</div>
								<div className="rightContent">
									<div className="project-title">
									<span className={order.payType}></span>{payWay[order.payType]}平台信息
									</div>
									<div className="ApplyDataBox">
										<div><span className="title">平台订单号：</span><span className="text">{outOrder.id || "无"}</span></div>
										<div><span className="title">交易金额：</span><span className="text">{outOrder.price || "无"}</span></div>
										<div><span className="title">交易时间：</span><span className="text">{outOrder.payTime?moment(outOrder.payTime).format("YYYY-MM-DD HH:mm"):"无"}</span></div>
										<div><span className="title">交易状态：</span>
											<span className={"text "+getOutPayStatus.className}>{getOutPayStatus.str || "无"}</span>
										</div>
									</div>	
								</div>
							</div>	
							{/*applyData.status==="PAY" && <div className="bottomContent" >
								<div className="project-title">
										退款申请
								</div>	
								<div className="ApplyDataBox">
										<FormItem label={`订单号`}>
									{getFieldDecorator(`id`, {
										rules: [{message: '请输入订单号', required: true}],
									})(
										<Input placeholder="请输入订单号"/>
									)}
								</FormItem>
									</div>
									</div>*/}
						</div>
						}
					</div>
					<Modal
						visible={visible}
						className="ApplyRefundModal"
						title="退款申请"
						okText="确定"
						cancelText="取消"
						loading={loading}
						onOk={this.handleSubmit}
						onCancel={() => {
							this.setState({
								visible: false,
							});
						}}

					>
						<FormItem  label="第三方订单号：">
							{( getFieldDecorator("orderId", {
									rules: [{
										required: visible, message: '必填项',
									}],
								})(
									<Input disabled={true}/>
								)
							)}
						</FormItem>
						<FormItem  label="退款金额">
							{( getFieldDecorator("price", {
									rules: [{
										required: visible, message: '必填项',
									}],
								})(
									<Input disabled={true}/>
								)
							)}
						</FormItem>
						<FormItem  label="退款原因：">
							{getFieldDecorator(`reason`, {
								rules: [{message: '请选择退款原因', required: visible}],
							})(
								<Select
									placeholder="请选择退款原因"
									style={{width:"100%"}}
								>
									{
										refundReason && refundReason.map((v, i) => (
											<Option value={v} key={i}>{v}</Option>
										))
									}
								</Select>
							)}
						</FormItem>
					</Modal>
				</Form>
      </section>
		)
		return(
			<Spin spinning={loading} size="large" delay={200} tip="加载中....">
				<DetailTemplate
					config = {this.props.config}
					title = {this.props.title}
					child={child}
					removeAllButton={outOrder.status!=="PAY"}
					definedButton={
						<Button onClick={this.showModel} type="primary">
							申请退款
						</Button>
					}
				/>
			</Spin>
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
const WrappeApplyRefund = Form.create()(ApplyRefund);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeApplyRefund);
