import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button,message,InputNumber } from "antd";
import moment from "moment";
import uuid from "uuid";
import {Panel} from "react-bootstrap";
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
//点位
export class EquipmentInfoDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pointDetail: {},
      placeData: [],
      priceRulesData: [],
      replenishmentData: []
    };
    this.uuid = uuid.v1();
  }
  //获取点位数据
	getPointDetail = (id) =>{
		if(id==='0'){
			return;
		}
    this.props.rts({
      method: 'get',
      url: `/Positions/${id}`
    }, this.uuid, 'getPoint',res=>{
    	this.setState({pointDetail:res});
    });
 	}
	//场地位置List
	getPlace = (val) =>{
		this.props.rts({
      method: 'get',
      url: `/Places`
   }, this.uuid, 'getPlaces',res=>{
    	this.setState({placeData:res.data});
    });
	}
	//价格策略List
	getPrice = () =>{
		this.props.rts({
      method: 'get',
      url: `/PriceRules`
   }, this.uuid, 'getPriceRules',res=>{
    	this.setState({priceRulesData:res.data});
    });
	}
	//补货员数据
	getReplenishment = () => {
    this.props.rts({
      method: 'get',
      url: `/accounts/replenishment`
    }, this.uuid, 'getReplenishment',res=>{
    	this.setState({replenishmentData:res});
    })
  }
	handleSubmit =(e)=>{
		e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}

        for(let i of Object.keys(values)){
          if (values[i] == null) continue
          if (i === 'createdAt') continue

          params[i] = values[i]
        }
        this.postTerminals(params);
      }
    })
	}
	postTerminals = params => {
    const { match } = this.props
    const { id } = match.params
    const rtsData = id==='0'?{method:'post',url:'/Positions',data:params}:{method:'put',url:`/Positions/${id}`,data:params};
		this.props.rts(rtsData, this.uuid, 'postTerminals', res => {
		const msgTitle = id==='0'?"新建成功！":"更新成功！";
		message.success(msgTitle);
  	this.props.goBack();
    })
  }
  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const { id } = match.params
   	this.getPointDetail(id);
   	this.getPlace();
   	this.getPrice();
   	this.getReplenishment();
  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
    const  pointDetail  = this.state.pointDetail;
    const  placeData  = this.state.placeData;
    const  priceRulesData  = this.state.priceRulesData;
    const  replenishmentData  = this.state.replenishmentData;
    pointDetail.enterTime = this.state.pointDetail.enterTime || new Date();
    const { getFieldDecorator } = this.props.form;
    const child = (
    	<Panel>
        <Form onSubmit={this.handleSubmit}>
          <div style={{backgroundColor: '#fff', padding: '20px'}}>
            <Row gutter={24}>
              <Row gutter={24}>
                <Col sm={12}>
                  <FormItem label={`点位名称`}>
                    {getFieldDecorator(`name`, {
                      rules: [{ required: true, message: '请填写点位名称' }],
                      initialValue: pointDetail && pointDetail.name || ''
                    })(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem label={`具体位置`}>
                    {getFieldDecorator(`address`, {
                      rules: [{ required: true, message: '请填写具体位置' }],
                      initialValue: pointDetail && pointDetail.address || ''
                    })(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col sm={12}>
                  <FormItem label={`所在场地`}>
                    {getFieldDecorator(`placeId`, {
                      rules: [{ required: true, message: '请选择场地' }],
                      initialValue: pointDetail && pointDetail.placeId || ''
                    })(
                      <Select>
                        {
                          placeData && placeData.map((v, i) => (
                            <Option value={v.id} key={i}>{v.name}</Option>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem label={`进场时间`}>
                    {getFieldDecorator(`enterTime`, {
                      rules: [{ required: true, message: '请选择机器购入时间' }],
                      initialValue: pointDetail && moment(pointDetail.enterTime, 'YYYY/MM/DD')
                    })(
                      <DatePicker style={{width:"100%"}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col sm={12}>
                  <FormItem label={`价格策略`}>
                    {getFieldDecorator(`priceRuleId`, {
                      rules: [{ required: true, message: '请选择价格策略' }],
                      initialValue: pointDetail && pointDetail.priceRuleId || ''
                    })(
                      <Select>
                        {
                          priceRulesData && priceRulesData.map((v, i) => (
                            <Option value={v.id} key={i}>{v.name}</Option>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col sm={12}>


                  <FormItem label={` 补 货 员 `}>
                    {getFieldDecorator(`opAccountId`, {
                      rules: [{ required: true, message: '请选择补货员' }],
                      initialValue: pointDetail && pointDetail.opAccountId || ''
                    })(
                      <Select>
                        {
                          replenishmentData && replenishmentData.map((v, i) => (
                            <Option value={v.id} key={i}>{v.fullname}</Option>
                          ))
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col sm={12}>
                  <FormItem label={`点位租金`}>
                    {getFieldDecorator(`rent`, {
                      rules: [{ required: true, message: '请填写点位租金' }],
                      initialValue: pointDetail && pointDetail.rent || ''
                    })(
                      <InputNumber style={{width:"100%"}} formatter={value=>`${value}`.replace(/[^\d^\.?]+/g,'')}/>
                    )}
                  </FormItem>
                </Col>
                <Col sm={12}>
                  <FormItem label={`点位人流`}>
                    {getFieldDecorator(`flow`, {
                      rules: [{ required: true, message: '请填写点位人流' }],
                      initialValue: pointDetail && pointDetail.flow || ''
                    })(
                      <InputNumber style={{width:"100%"}} formatter={value=>`${value}`.replace(/[^\d^\.?]+/g,'')}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col sm={12}>
                  <FormItem label={"点位备注"}>
                    {getFieldDecorator(`remarks`, {
                      rules: [{ required: true, message: '请填写点位备注' }],
                      initialValue: pointDetail && pointDetail.remarks || ''
                    })(
                      <Input/>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Row>
          </div>
        </Form>
      </Panel>
    	
    )
    
    return (
    <section className="pointManagementDetail-page">
      <DetailTemplate
      	config = {this.props.config}
      	title = {pointDetail.name || this.props.title}
      	child={child}
      	onCancle={this.props.goBack}
      	onOk={this.handleSubmit}
      />
      
    </section>

    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const EquipmentInfoDetailForm = Form.create()(EquipmentInfoDetail)

const mapStateToProps = createStructuredSelector({
});

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentInfoDetailForm);
