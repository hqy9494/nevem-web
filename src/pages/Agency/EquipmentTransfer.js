import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,Button,Transfer,Switch,Spin,message,Card,Form, Input } from "antd";
import moment from "moment";
import uuid from "uuid";
import AsyncTable from "../../components/AsyncTable";
import DetailTemplate from "../../components/DetailTemplate";
import checkInput from "../../components/CheckInput";
import "./EquipmentTransfer.scss";
const FormItem = Form.Item;
export class EquipmentTransfer extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		targetKeys: [],
	    selectedKeys: [],
	    TITLE_NUMBER:0,
	    mockData:[],
	    loading:true,
	    chooseData:[],
	    outSending:false,
	    outNum:60,
	    inNum:60,
	    inSending:false,
	    userPhone:"",
	    userName:"",
	    outPhone:"",
	    outName:"",
  	};
    this.uuid = uuid.v1();
  }
  componentWillMount() {
  	const { user } = this.props;
  	if(user.agentId){
  		this.getAgentsInfo(user.agentId,(result)=>this.setState({userPhone:result.paymentPhone,userName:result.name}));
  	}
  	this.getTransferData();
  }
  //选中
	handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
	    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
	}
	//转出
	handleChange = (nextTargetKeys, direction, moveKeys) => {
			const { mockData } = this.state;
			let chooseData = [];
			nextTargetKeys.map((item)=>{
				let arr =	mockData.filter( c => item===c.key );
				chooseData = chooseData.concat(arr);
			})
	    this.setState({ targetKeys: nextTargetKeys,chooseData });
	  }
	//模糊搜索
	filterOption = (inputValue, option) => {
		let str = (option.name || "") + (option.code || "");
		str = str.toUpperCase();
		inputValue = inputValue.toUpperCase();
    return str.indexOf(inputValue) > -1;
  }
	//查询代理商信息
	getAgentsInfo = (id,callback) => {
		this.props.rts(
  	  {
  	    method: "get",
  	    url: `/Agents`,
  	    params:{filter:{"where":{"id":id}}}
  	  },
  	  this.uuid,
  	  "getAgentsInfo",
  	  (res) => {
  	  	res.data.length?callback(res.data[0]):callback({});
  	  }
  	);
	}
	//获取点位列表
  getTransferData = () => {
		this.props.rts(
  	  {
  	    method: "get",
  	    url: `/Positions`,
  	    params:{filter:{"include":["place","terminal"],"where":{"active":true}}}
  	  },
  	  this.uuid,
  	  "getTransferData",
  	  (res) => {
  	  	const  data  = res.data || res;
  	  	let result = [];
  	  	for(let i in data){
  	  		result.push({
  	  			key:data[i].id,
  	  			name:data[i].name,
  	  			code: data[i].terminal?((data[i].terminal.name || "") + "（"+ (data[i].terminal.code || "") + "）" ) : "未绑定设备"})
  	  	}
  	  	this.setState({mockData:result,loading:false});
  	  	
  	  }
  	);
  };
  //上一步
  Last = () => {
  	let { targetKeys,TITLE_NUMBER } = this.state;
  	TITLE_NUMBER--;
  	this.setState({TITLE_NUMBER});
  }
  //提交转出接口
  postTransfers = (data) =>{
  	return 	new Promise((resolve, reject)=>{
	  	this.props.rts(
			  {
			    method: "post",
			    url: `/PositionTransfers`,
			    data
			  },
			  this.uuid,
			  "postTransfers",
			  (res) => {
			  	message.success("转移成功！");
			  	resolve(res);
		  	}
			);
  	})
  }
  //下一步
  Next = async () => {
  	let { targetKeys,TITLE_NUMBER } = this.state;
  	if(TITLE_NUMBER===0 && !targetKeys.length){
  		return message.error("至少绑定一个设备")
  	}else if(TITLE_NUMBER===1){
  		let IS_ERROR = false;
  		const { targetKeys,userPhone } = this.state;
  		let phone = "";
  		let postData={};
  		this.props.form.validateFieldsAndScroll((err, values) => {
  			if(!values.inPhone || !values.outCode || !values.inCode){
  				IS_ERROR = true;
  				return message.error("手机号或者验证码不能为空！")
  			}
  			if(!userPhone){
  				IS_ERROR = true;
  				return message.error("该账户未绑定手机号！")
  			}
  			if(!checkInput({value:userPhone,type:'mobile-phone',msg:'转出方手机号格式不正确！'})){
  				IS_ERROR = true;
					return;
				}
  			if(!checkInput({value:values.inPhone,type:'mobile-phone',msg:'接收方手机号格式不正确！'})){
  				IS_ERROR = true;
					return;
				}
  			phone = values.inPhone;
  			postData = {"outMobile": userPhone, "inMobile": values.inPhone, "outCode": values.outCode, "inCode": values.inCode, "item": targetKeys}
  		})
  		if(phone){
  			let isAgents = await this.isAgents(phone);  			
  			if(!isAgents){
  				IS_ERROR = true;
  					return;
  			}
  		}
  		if(IS_ERROR)return;
  		let postResult = await this.postTransfers(postData);
  		this.getAgentsInfo(postResult.inAgentId,(result)=>this.setState({outPhone:result.paymentPhone,outName:result.name}));
  	}
  	TITLE_NUMBER++;
  	this.setState({TITLE_NUMBER});
  }
  //转出方手机号验证
  outSendVCode = (val) =>{
  	if(!checkInput({value:val,type:'mobile-phone',msg:'转出方手机号格式不正确！'})){
			return;
		}
  	this.postVCode({val,name:["outNum","outSending"]})
  }
  //验证是否存在代理商
  isAgents = (val,isCode) => {
  	return new Promise((resolve, reject)=>{
	  	this.props.rts(
			  {
			    method: "get",
			    url: `/Agents`,
			    params:{"filter":{"where":{"paymentPhone":val}}}
			  },
			  this.uuid,
			  "AgentsPhone",
			  (res) => {
			  	if(res.data && res.data.length){
			  		if(isCode){
			  			this.postVCode({val,name:["inNum","inSending"]})		  	  		
			  		}else{
			  			resolve(true);
			  		}
			  	}else{
			  		resolve(false);
			  		message.error("该手机号不存在代理商！");
			  	}
		  	}
			);
  	})
  }
  //接收方验证手机号
  inSendVCode = (val) =>{
  	this.props.form.validateFieldsAndScroll((err, values) => {
  		if(!err){
  			let val = values.inPhone || "";
  			if(!checkInput({value:val,type:'mobile-phone',msg:'接收方手机号格式不正确！'})){
					return;
				}
  			this.isAgents(val,true);
  		}
  	})
  }
  //短信接口
  postVCode = (obj) => {
  	this.setState({[obj.name[1]]:true});
  	this.props.rts(
  	  {
  	    method: "get",
  	    url: `/Verifications/send`,
  	    params:{mobile:obj.val}
  	  },
  	  this.uuid,
  	  "getTransferData",
  	  (res) => {
  	  	message.success("短信发送成功！请注意查收！");
	  		this.timeSending(obj.name)
  	  }
  	);
  }
  //接受短信后按钮变化
  timeSending = (name = []) => {
  	let num = this.state[name[0]];
  	let timer = setInterval(()=>{
  		if(--num===0){
  			this.setState({[name[0]]:60,[name[1]]:false});
  			clearInterval(timer);
  		}
  		this.setState({[name[0]]:num})  		
  	},1000)
  }
  render() {
  	const { getFieldDecorator } = this.props.form;
  	const titleList = [
  		{name:"1.选择设备",className:"left"},
  		{name:"2.输入账号验证码",className:"center"},
  		{name:"3.转移成功",className:"right"}
  	]
  	const { outPhone,outName,userName,userPhone,inSending,inNum,outNum,outSending,targetKeys, selectedKeys,TITLE_NUMBER,mockData,loading,chooseData } = this.state;
    const child = (
    	<div className="EquipmentTransferBox">
    		<Form>
	    		<div>
		    		<Row>
		    			{titleList && titleList.map((item,i)=>
					      <Col className="gutter-row" span={8} key={i}>
					        <div className={"gutter-box "+(TITLE_NUMBER>=i?item.className+"active":item.className) }>{item.name}</div>
					      </Col>
		    			)}
				    </Row>
				    {TITLE_NUMBER===0?<div>
				    	<Transfer
					    	listStyle={{height:400}}
					    	locale={ {itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空', searchPlaceholder: '请输入搜索内容'} }
					    	showSearch
					    	filterOption={this.filterOption}
			          dataSource={mockData}
			          titles={['所有设备', '绑定设备']}
			          targetKeys={targetKeys}
			          onChange={this.handleChange}
			          render={item =>
						    	<span title={item.name+"("+item.code+")"}>
						    		<span>{item.name}</span>
						    		<span style={{color:"#ff6000"}}>（{item.code}）</span>
						    	</span>
					    	}
			        />
			        <div style={{marginTop:"20px",textAlign:"right"}}><Button type="primary" onClick={this.Next}>下一步</Button></div>	
				    </div>
				    :
				    TITLE_NUMBER===1?
				    <div>
					   	<Card
						    title="转移设备列表"
						  >
					   		{chooseData.map((item,i)=>
						   		<p key={i}>
						   			<span title={item.name+"("+item.code+")"}>
							    		<span>{item.name}</span>
							    		<span style={{color:"#ff6000"}}>（{item.code}）</span>
							    	</span>
						   		</p>
					   		)}
						  </Card>
						  <Card
						    title="转出方"
						  >
					   		<p style={{marginBottom:"20px"}}>
					   			<span style={{fontWeight:"bolder"}}>转出方手机号码：</span>
					   			{userPhone || "未绑定手机号"}
					   			{outSending?
					   				<Button type="primary" size="small" style={{marginLeft:"30px"}} disabled={true}>{outNum}秒后重发</Button>:
					   				<Button type="primary" size="small" style={{marginLeft:"30px"}} onClick={()=>this.outSendVCode(userPhone)}>发送验证码</Button>
					   			}
					   		</p>
					   		<div>
					   			<FormItem
							      label="转出方验证码"
							    >
							      {getFieldDecorator('outCode')(
					            <Input style={{width:300}} placeholder="请输入转出方验证码" />
					          )}
							    </FormItem>
					   		</div>
						  </Card>
						  <Card
						    title="接收方"
						  >
						  	<div>
					   			<FormItem
							      label="接收方手机号码"
							    >
					   				{getFieldDecorator("inPhone")(
			                <div>
						            <Input style={{width:300}} placeholder="请输入接收方手机号码" />
						            {inSending?
								   				<Button type="primary" size="small" style={{marginLeft:"30px"}} disabled={true}>{inNum}秒后重发</Button>:
								   				<Button type="primary" size="small" style={{marginLeft:"30px"}} onClick={this.inSendVCode}>发送验证码</Button>
								   			}
					            </div>
	              		)}
					   			</FormItem>
					   		</div>
					   		<div>
					   			<FormItem
							      label="接收方验证码"
							    >
							      {getFieldDecorator('inCode')(
					            <Input style={{width:300,marginLeft:'15px'}} placeholder="请输入接收方验证码" />
					          )}
							    </FormItem>
					   		</div>
						  </Card>
					    <div style={{marginTop:"20px",textAlign:"right"}}>
						    <Button type="primary" onClick={this.Last} style={{marginRight:"20px"}}>上一步</Button>
						    <Button type="primary" onClick={this.Next}>下一步</Button>
					    </div>
				    </div>
				    :
				    <div className="successBox">
				   		<div>
				   			<div className="header">
				   				<span>
				   				</span>
					   			<p>
					   				转移成功！！
					   			</p>
				   			</div>
				   			<p style={{marginLeft:"86px"}}>
				   				转出方：{userName+"（"+userPhone+"）"}
				   			</p>
				   			<p style={{marginLeft:"86px"}}>
				   				接收方：{outName+"（"+outPhone+"）"}
				   			</p>
				   		</div>
				    	<div style={{marginTop:"20px",textAlign:"right"}}><Button type="primary" onClick={this.Last}>上一步</Button></div>	
				    </div>
				    }
				    
	    		</div>
    		</Form>
    	</div>	
    )
    return (
      <section className="EquipmentTransfer-page">
      	<Spin tip="数据加载中..." delay={100} spinning={loading}>
	      	<DetailTemplate
	      		title={this.props.title}
	      		config={this.props.config}
	      		child={child}
	      		removeAllButton
	      	/>
      	</Spin>
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
const WrappedEquipmentTransfer = Form.create()(EquipmentTransfer);
export default connect(mapStateToProps, mapDispatchToProps)(WrappedEquipmentTransfer);
