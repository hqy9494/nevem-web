import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,  Divider, Popconfirm,Button,Modal,Form,Input,message,InputNumber,Select,Card } from "antd";
import {Panel} from "react-bootstrap";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand";
import { getParameterByName } from '../../utils/utils';
// import styles from "./Index.scss";
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const FormItem = Form.Item;
export class AgencyChange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {refreshTable:false,agentList:[],agentAllList:[]};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  	this.getBatchList();
  	console.log(this.props,'this.props');
  	this.user = getParameterByName('user')? JSON.parse(decodeURI(getParameterByName('user'))): null;
  	if(typeof this.user !== 'object' || Object.keys(this.user).length==0){
  		return this.props.replace('/');
  	}
  }

  componentWillReceiveProps(nextProps) {}
	getBatchList = ()=>{
		this.props.rts(
         {
           method: "get",
           url: `/Agents`,
         },
         this.uuid,
         'agentList',res=>{
         	this.setState({agentList:res.data,agentAllList:res.data});
         });
	}
	handleSelectChange = (val) =>{
		this.props.form.setFieldsValue({'searchOptions':val},()=>{
	    	this.searchClick();
	    });
	}
	searchClick = () =>{
		this.props.form.validateFields((err, values) => {
			const { agentAllList,agentList } = this.state;
			values.searchInput = values.searchInput ?values.searchInput:'';
			let arr = [];
			const jd = values.searchOptions?true:false;
			for(let i in agentAllList){
				if(agentAllList[i].name.indexOf(values.searchInput)>=0 && (values.searchOptions===undefined || values.searchOptions===-1 || agentAllList[i].direct===jd)){
					arr.push(agentAllList[i]);
				}	
			}
			this.setState({agentList:arr});
		})
	}
	resetSearch = () => {
		this.props.form.setFieldsValue({'searchOptions':-1,'searchInput':''},()=>{
	    	this.searchClick();
	    });
	}
	changeAgency = (values) =>{
		message.success('切换成功,返回首页！');
		this.props.replace('/');
		if(!values){
			return	localStorage.removeItem('xAgentData');
		}
		localStorage.xAgentData = JSON.stringify({id:values.id,name:values.name});
	}
	
  render() {
  	const {getFieldDecorator} = this.props.form;
    return (
      <section className="OperatorList-page AgencyChangeBox">
      	<Form>
		    <Panel>
		      	<div style={{height:70}}>
		      		<div style={{height:35,lineHeight:'35px'}}>
		      			账户名称：{this.user.fullname}
		      		</div>
		      		<div style={{height:35,lineHeight:'35px'}}>
		      			账户角色：{this.user.role.description}
		      		</div>
		      	</div>
		      	<Row gutter={24} className="AsyncSearchClass" style={{borderBottom:0}}>
		      		<Col span={8}>
		      			{getFieldDecorator('searchInput')(<Input placeholder={`请输入代理商名称`} addonAfter={<Icon style={{cursor:'pointer'}} type="search" onClick={this.searchClick}/>} onPressEnter={this.searchClick}/>)}
		      		</Col>
		      		<Col span={8}>
		      			{getFieldDecorator('searchOptions')(
		      				<Select style={{width:'100%'}} placeholder={`请选择代理商类型`} onChange={(value)=>this.handleSelectChange(value)}>
								<Option value={1} key={'Option1'}>直属代理</Option>
								<Option value={0} key={'Option2'}>一般代理</Option>
								<Option value={-1} key={'Option2'}>搜索所有代理商</Option>
							</Select>
		      			)}
		      			
		      		</Col>
		      		<Col span={8} style={{textAlign:'right',paddingBottom:'10px',paddingTop:'4px'}}>
			        	{/*<Button type="primary" style={{marginRight:'10px'}} onClick={this.searchClick}>搜索</Button>*/}
			        	<Button onClick={this.resetSearch}>重置</Button>
		        	</Col>
		      	</Row>	
		      	<Row gutter={20}>
		      		<Col md={6} style={{marginBottom:20}} xxl={4}>
				        <Panel>
						      <p style={{fontWeight:700}}>{this.user.fullname?this.user.fullname:'管理员'}</p>
				          <p>账户角色 : <span>{this.user.role.description}</span><a style={{float:'right',display:'inline-block'}} onClick={()=>this.changeAgency(false)}>切&nbsp;换</a></p>
					    	</Panel>
					    </Col>
			      	{this.state.agentList.map((item,i)=>{
			      		return (
			      			<Col md={6} xxl={4} key={i} style={{marginBottom:20}}>
						        <Panel>
							      <p style={{fontWeight:700}} title={item.name}>{item.name.length>20?item.name.substr(0,15)+'...':item.name}</p>
						          <p>主体 : <span>{item.direct?'直属代理':'一般代理'}</span><a style={{float:'right',display:'inline-block'}} onClick={()=>this.changeAgency(item)}>切&nbsp;换</a></p>
							    </Panel>
						    </Col>
			      		)
			      	})}
		      	</Row>
	      	</Panel>
      	</Form>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});
const WrappeAgencyChange = Form.create()(AgencyChange);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeAgencyChange);
