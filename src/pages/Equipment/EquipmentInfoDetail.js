import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

export class EquipmentInfoDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      terminalsByIdData: {},
      placeData: [],
      priceRulesData: [],
      replenishmentData: [],
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const { id } = match.params

    this.getPlace()
    this.getPriceRules()
    this.getReplenishment()
    if (id !== 'add') this.getTerminalsById(id)
  }
  componentWillReceiveProps(nextProps) {
    const { getTerminalsById, getPlace, getPriceRules, getReplenishment } = nextProps

    if (getTerminalsById && getTerminalsById[this.uuid]) {
      this.setState({
        terminalsByIdData: getTerminalsById[this.uuid],
      })
    }

    if (getPlace && getPlace[this.uuid]) {
      this.setState({
        placeData: getPlace[this.uuid].data,
      })
    }

    if (getPriceRules && getPriceRules[this.uuid]) {
      this.setState({
        priceRulesData: getPriceRules[this.uuid].data,
      })
    }

    if (getReplenishment && getReplenishment[this.uuid]) {
      this.setState({
        replenishmentData: getReplenishment[this.uuid],
      })
    }
  }
  getTerminalsById = id => {
    this.props.rts({
      method: 'get',
      url: `/Terminals/${id}`
    }, this.uuid, 'getTerminalsById')
  }
  getPlace = () => {
    this.props.rts({
      method: 'get',
      url: `/Places`
    }, this.uuid, 'getPlace')
  }
  getPriceRules = () => {
    this.props.rts({
      method: 'get',
      url: `/PriceRules`
    }, this.uuid, 'getPriceRules')
  }
  getReplenishment = () => {
    this.props.rts({
      method: 'get',
      url: `/accounts/replenishment`
    }, this.uuid, 'getReplenishment')
  }
  postTerminals = params => {
    const { match } = this.props
    const { id } = match.params

    this.props.rts({
      method: 'put',
      url: `/Terminals/${id}`,
      data: params
    }, this.uuid, 'postTerminals', () => {
      this.props.goBack()
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}

        for(let i of Object.keys(values)){
          if (values[i] == null) continue
          if (i === 'createdAt') continue

          params[i] = values[i]
        }
        this.postTerminals(params)
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { terminalsByIdData, placeData, priceRulesData, replenishmentData } = this.state
		const child = (
			<Form>
	      <div>
	      	<Card title="基本配置">
	          <Row gutter={24}>
		          <Col sm={8}>
		            <FormItem label={`设备名称`}>
		              {getFieldDecorator(`name`, {
		                rules: [{ required: true, message: '请填写设备名称' }],
		                initialValue: terminalsByIdData && terminalsByIdData.name || ''
		              })(
		                <Input/>
		              )}
		            </FormItem>
		          </Col>
		          <Col sm={8}>
		            <FormItem label={`机器地址`}>
		              {getFieldDecorator(`address`, {
		                rules: [{ required: true, message: '请填写机器地址' }],
		                initialValue: terminalsByIdData && terminalsByIdData.address || ''
		              })(
		                <Input/>
		              )}
		            </FormItem>
		          </Col>
		          <Col sm={8}>
		            <FormItem label={`机器购入时间`}>
		              {getFieldDecorator(`createdAt`, {
		                rules: [{ required: true, message: '请选择机器购入时间' }],
		                initialValue: terminalsByIdData && moment(terminalsByIdData.createdAt, 'YYYY/MM/DD')
		              })(
		                <DatePicker disabled/>
		              )}
		            </FormItem>
		          </Col>
		        </Row>
		        <Row gutter={24} style={{paddingTop:'15px'}}>
		          <Col sm={8}>
		            <FormItem label={`设备编号`}>
		              {getFieldDecorator(`code`, {
		                rules: [{ required: true, message: '请填写设备编号' }],
		                initialValue: terminalsByIdData && terminalsByIdData.code || ''
		              })(
		                <Input/>
		              )}
		            </FormItem>
		          </Col>
		        </Row>
		      </Card>  
	    </div>  
	    </Form>
		)
    return (
      <section className="EquipmentInfoDetail-page">
	      <DetailTemplate
	      	config = {this.props.config}
	      	title = {terminalsByIdData && terminalsByIdData.name || this.props.title}
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
  UUid: state => state.get("rts").get("uuid"),
  getTerminalsById: state => state.get("rts").get("getTerminalsById"),
  getPlace: state => state.get("rts").get("getPlace"),
  getPriceRules: state => state.get("rts").get("getPriceRules"),
  getReplenishment: state => state.get("rts").get("getReplenishment"),
});

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentInfoDetailForm);
