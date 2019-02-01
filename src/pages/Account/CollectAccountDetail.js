import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Panel } from "react-bootstrap";
import { Col, Row, Icon, Card, Form, message, Input, InputNumber, DatePicker, Radio, Select, Button, Cascader, Upload, Modal } from "antd";
import moment from "moment";
import uuid from "uuid";
import configUrl from "../../config/dev"
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 },
};

export class CollectAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      previewVisible: false,
      imageFixWidthUrl: [],
      imageUrl: [],
      prizeType: null,
      showType: false,
      optionType: null,
      defaultList: [],
      disable: false,
      paymentData: {},
      paymentList: [],
    };
    this.uuid = uuid.v1();
    this.fetchNum = 0
  }

  componentWillMount() {}

  componentDidMount() {
    const { match } = this.props
    const id = match.params.id

    this.getOptions()
    this.getPayment()

    if (id && id !== 'add') {
      this.getPaymentId(id)
      this.setState({
        disable: true
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    const { getPaymentId } = nextProps

    if (getPaymentId && getPaymentId[this.uuid]) {
      const data = getPaymentId[this.uuid]
    
      if (this.fetchNum === 0) {
        this.setState({
          paymentData: data,
          privateKey: data.aliPayConfig ? [{
            uid: -1,
            name: data.aliPayConfig && data.aliPayConfig.privateKey,
            status: 'done',
            url: data.aliPayConfig && data.aliPayConfig.privateKey,
            thumbUrl: data.aliPayConfig && data.aliPayConfig.privateKey
          }] : [],
          publicKey: data.aliPayConfig ? [{
            uid: -1,
            name: data.aliPayConfig && data.aliPayConfig.publicKey,
            status: 'done',
            url: data.aliPayConfig && data.aliPayConfig.publicKey,
            thumbUrl: data.aliPayConfig && data.aliPayConfig.publicKey
          }] : [],
          apiClientCert: data.wxPayConfig ? [{
            uid: -1,
            name: data.wxPayConfig && data.wxPayConfig.apiClientCert,
            status: 'done',
            url: data.wxPayConfig && data.wxPayConfig.apiClientCert,
            thumbUrl: data.wxPayConfig && data.wxPayConfig.apiClientCert
          }] : [],
        })
      }

      this.fetchNum = 1
    }
  }

  getPaymentId = id => {
    id && 
    this.props.rts({
      url: `/Payments/${id}`,
      method: 'get',
    }, this.uuid, 'getPaymentId', (v) => {
      if(v) this.setState({ optionType: v.type })
    })
  }

  getPayment = () => {
    this.props.rts({
      url: `/Payments`,
      method: 'get',
      params: {
        filter: {
          order: 'createdAt DESC'
        }
      }
    }, this.uuid, 'getPayment',(v) => {
      this.setState({
        paymentList: v.data
      })
    })
  }

  getOptions = () => {
    const optionList = [
      { name: "官方账号", value: "NATIVE"},
      { name: "采宝账号", value: "CAIBAO"},
    ]
    this.setState({ prizeType: optionList })
  }

  postPayments = params => {
    const { match } = this.props
    const { id } = match.params

    this.props.rts({

      url: id === 'add' ? '/Payments' : `/Payments/${id}`,
      method: id === 'add' ? 'post' : 'put',
      data: params
    }, this.uuid, 'postPayments', () => {
      message.success('保存成功', 1, () => {
        this.props.goBack()
      })
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handleToUnique = (handleData = [], handleName) => {
    return handleData.map(v => v.name).includes(handleName) || false
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleChange = (name, { fileList }) => this.setState({ [name]: fileList })

  handleFocus = (rule, value, callback) => {
    const { paymentList } = this.state
    
    if(this.handleToUnique(paymentList, value)) {
      callback('账号已存在请重新输入')
    }
    callback()
  }


  onSelectChange = (val) => this.setState({ optionType: val })

  handleSubmit = (e) => {
    e.preventDefault();
    const { optionType } = this.state
    const newParams = ['wxPayConfig','aliPayConfig','caiBaoConfig']
    const fileParams = ['privateKey','publicKey','apiClientCert']

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)) {
          if (values[i] == null) continue

          if (newParams.includes(i)) {
            params = Object.assign( params, { [i]: { appId : values [i]} })
            continue
          }
          if(fileParams.includes(i)) {

            params[i!== 'apiClientCert' ? 'aliPayConfig':'wxPayConfig'][i] = 
            values[i]['file'] ? 
            values[i]['file']['response'] && values[i]['file']['response']['result'] && values[i]['file']['response']['result']['fileName'] : 
            values[i][0]['url']
            continue
          }
            
          if(i!== 'name' && i!== 'type') {
            params[optionType === 'CAIBAO' ? 'caiBaoConfig' : 'wxPayConfig'][i] = values[i]
            continue
          }
          params[i] = values[i]
        }
        this.postPayments(params)
      }
    })
  }
  render() {
    
    const uploadButton = (<Button><Icon type="upload" />上传</Button>)
    const { getFieldDecorator } = this.props.form

    const { prizeType, optionType, paymentData, disable, payType } = this.state

    const child = (
      <Panel>
        <Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleSubmit}>
		        <div className="project-title">编辑账号</div>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`收款账号名称`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`name`, {
                    rules: [
                      {message: '请输入收款账号名称', required: true},
                      {validator: this.handleFocus}
                    ],
                    initialValue: paymentData && paymentData.name || ''
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`收款账号类型`}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`type`, {
                    rules: [{ required: true, message: '请选择收款账号类型' }],
                    initialValue: paymentData && paymentData.type || ''
                  })(
                    <Select placeholder="请选择" onChange={this.onSelectChange} locale={zh_CN} disabled={disable}>
                      {
                        prizeType && 
                        prizeType.length ? 
                        prizeType.map((v, i) => {
                          return (
                            <Option value={v.value} key={i}>{v.name}</Option>
                          )
                        }) : 
                        null
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            {
              optionType === 'NATIVE' ?
              <div>
                <div className="project-title">微信</div>
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`微信公众号APPID`}
                      {...formItemLayout}
                    >
                      {getFieldDecorator(`wxPayConfig`, {
                        rules: [{message: '请输入微信公众号APPID', required: true}],
                        initialValue: paymentData && paymentData.wxPayConfig && paymentData.wxPayConfig.appId || ''
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`微信公众号密钥`}
                      {...formItemLayout}
                    >
                      {getFieldDecorator(`appSecret`, {
                        rules: [{ message: '请输入微信公众号密钥', required: true}],
                        initialValue: paymentData && paymentData.wxPayConfig && paymentData.wxPayConfig.appSecret || ''
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`微信支付KEY`}
                      {...formItemLayout}
                    >
                      {getFieldDecorator(`partnerKey`, {
                        rules: [{message: '请输入微信支付KEY', required: true}],
                        initialValue: paymentData && paymentData.wxPayConfig && paymentData.wxPayConfig.partnerKey || ''
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`微信支付商户号`}
                      {...formItemLayout}
                    >
                      {getFieldDecorator(`mchId`, {
                        rules: [{message: '请输入微信支付商户号', required: true}],
                        initialValue: paymentData && paymentData.wxPayConfig && paymentData.wxPayConfig.mchId || ''
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`微信支付证书`} extra="只能上传文件" {...formItemLayout}>
                      {getFieldDecorator(`apiClientCert`, {
                        rules: [{message: '请上传文件', required: true}],
                        initialValue: this.state.apiClientCert || []
                      })(
                          <Upload 
                            name="file" 
                            action={`${configUrl.apiUrl}${configUrl.apiBasePath}/Payments/upload/cert`} 
                            listType="text"
                            headers={{
                              Authorization: localStorage.token
                            }}
                            onPreview={this.handlePreview}
                            onChange={(fileList) => {
                              this.handleChange('apiClientCert', fileList)
                            }}
                            fileList={this.state.apiClientCert || []}
                          >
                              {uploadButton}
                          </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                
                { /*支付宝*/ }
                <div className="project-title">支付宝</div>
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`支付宝APPID`}
                      {...formItemLayout}
                    >
                      {getFieldDecorator(`aliPayConfig`, {
                        rules: [{message: '请输入支付宝APPID', required: true}],
                        initialValue: paymentData && paymentData.aliPayConfig && paymentData.aliPayConfig.appId || ''
                      })(
                        <Input/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`支付宝应用私钥`} extra="只能上传文件" {...formItemLayout}>
                      {getFieldDecorator(`privateKey`, {
                        rules: [{message: '请上传文件', required: true}],
                        initialValue: this.state.privateKey || this.state.previewImage || []
                      })(
                          <Upload 
                            name="file" 
                            action={`${configUrl.apiUrl}${configUrl.apiBasePath}/Payments/upload/cert`} 
                            listType="text"
                            headers={{
                              Authorization: localStorage.token
                            }}
                            onPreview={this.handlePreview}
                            onChange={(fileList) => {
                              this.handleChange('privateKey', fileList)
                            }}
                            fileList={this.state.privateKey || []}
                          >
                            {uploadButton}
                          </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`支付宝应用公钥`} extra="只能上传文件" {...formItemLayout}>
                      {getFieldDecorator(`publicKey`, {
                        rules: [{message: '请上传文件', required: true}],
                        initialValue: this.state.publicKey || this.state.previewImage || []
                      })(
                          <Upload 
                            name="file" 
                            action={`${configUrl.apiUrl}${configUrl.apiBasePath}/Payments/upload/cert`} 
                            listType="text"
                            headers={{
                              Authorization: localStorage.token
                            }}
                            onPreview={this.handlePreview}
                            onChange={(fileList) => {
                              this.handleChange('publicKey', fileList)
                            }}
                            fileList={this.state.publicKey || []}
                          >
                            {uploadButton}
                          </Upload>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div> : null
            }
            {
              optionType === 'CAIBAO' ?
              <div>
                <div className="project-title">采宝账号</div>
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`测试用的APP`}
                      {...formItemLayout}
                    >
                      {getFieldDecorator(`caiBaoConfig`, {
                        rules: [{message: '请输入测试用的APP', required: true}],
                        initialValue: paymentData && paymentData.caiBaoConfig && paymentData.caiBaoConfig.appId || ''
                        
                      })(
                        <Input placeholder="请输入测试用的APP" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`收银员ID`}
                      {...formItemLayout}
                    >
                      {getFieldDecorator(`account`, {
                        rules: [{message: '请输入收银员ID', required: true}],
                        initialValue: paymentData && paymentData.caiBaoConfig && paymentData.caiBaoConfig.account || ''
                      })(
                        <Input placeholder="请输入收银员ID" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                
                <Row gutter={24}>
                  <Col sm={12}>
                    <FormItem label={`测试APP对应的加密KEY`}
                      {...formItemLayout}
                    >
                      {getFieldDecorator(`key`, {
                        rules: [{ message: '请输入测试APP对应的加密KEY', required: true}],
                        initialValue: paymentData && paymentData.caiBaoConfig && paymentData.caiBaoConfig.key || ''
                      })(
                        <Input placeholder="请输入测试APP对应的加密KEY"/>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </div> :
              null
            }
            {
              /*optionType ?
              <div className="ta-c mt-20">
                <Button style={{ marginRight: 8 }} onClick={() => {
                  this.props.goBack()
                }}>
                  返回
                </Button>
                <Button type="primary" htmlType="submit">保存</Button>
              </div> :
              null
            */}
        </Form>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </Panel>
    )
    
    
    return (
      <section className="EquipmentInfoDetail-page">
	      <DetailTemplate
	      	config = {this.props.config}
	      	title = {paymentData && paymentData.name || this.props.title}
	      	child={child}
	      	removeOkButton={optionType?false:true}
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

const UUid = state => state.get("rts").get("uuid")
const postPayments = state => state.get("rts").get("postPayments")
const getPaymentId = state => state.get("rts").get("getPaymentId")
const getPayment = state => state.get("rts").get("getPayment")

const CollectAccountForm = Form.create()(CollectAccount)

const mapStateToProps = createStructuredSelector({
  UUid,
  postPayments,
  getPaymentId,
  getPayment
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectAccountForm);
