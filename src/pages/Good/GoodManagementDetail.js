import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button, Cascader, Upload, Modal } from "antd";
import moment from "moment";
import uuid from "uuid";
import config from "../../config"
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

export class GoodManagementDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      catData: [],
      previewImage: '',
      previewVisible: false,
      imageFixWidthUrl: [],
      imageUrl: []
    };
    this.uuid = uuid.v1();
    this.fetchNum = 0
  }

  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id

    this.getCat()

    if (id && id !== 'add') this.getProduct(id)
  }
  componentWillReceiveProps(nextProps) {
    const { getCat, getProduct } = nextProps

    if (getCat && getCat[this.uuid]) {
      this.setState({
        catData: getCat[this.uuid].data,
        catTotal: getCat[this.uuid].total,
      })
    }

    if (getProduct && getProduct[this.uuid]) {
      const data = getProduct[this.uuid]
      if (this.fetchNum === 0) {
        this.setState({
          product: data,
          imageFixWidthUrl: data.imageFixWidthUrl ? [{
            uid: -1,
            name: '1.png',
            status: 'done',
            url: data.imageFixWidthUrl,
            thumbUrl: data.imageFixWidthUrl
          }] : [],
          imageUrl: data.imageUrl ? [{
            uid: -1,
            name: '1.png',
            status: 'done',
            url: data.imageUrl,
            thumbUrl: data.imageFixWidthUrl
          }] : [],
        })
      }

      this.fetchNum = 1
    }
  }
  getProduct = id => {
    this.props.rts({
      method: 'get',
      url: `/Products/${id}`
    }, this.uuid, 'getProduct')
  }
  getCat = () => {
    this.props.rts({
      method: 'get',
      url: '/Categories'
    }, this.uuid, 'getCat')
  }
  getOptions = (catData = []) => {
    let data = []
    
    catData.forEach(v => {
      if (v) data.push({
        value: v.id,
        label: v.name
      })
    })  

    return data
  }
  postProducts = params => {
    const { match } = this.props
    const { id } = match.params

    this.props.rts({
      url: id === 'add' ? '/Products' : `/Products/${id}`,
      method: id === 'add' ? 'post' : 'put',
      data: params
    }, this.uuid, 'postProducts', () => {
      this.props.goBack()
    })
  }
  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }
  handleChange = (name, { fileList }) => this.setState({ [name]: fileList })
  handleSubmit = (e) => {
    const { match } = this.props
    const { id } = match.params
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)){
          if (values[i] == null) continue

          if (i === 'categoryId') {
            params[i] = values[i][values[i].length - 1]
            continue
          }

          if (i === 'imageFixWidthUrl' || i === 'imageUrl') {
            if (values[i]['file']) {
              params[i] = values[i]['file'] && values[i]['file']['response'] && values[i]['file']['response'].url
            }else{
              params[i] = values[i][0]['url']
            }
            continue
          }
          params[i] = values[i]
        }
        this.postProducts(params)
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { catData, product } = this.state
    let options = this.getOptions(catData)
    // console.log(this.state.imageFixWidthUrl)
    const uploadButton = (
      <div>
        <Icon type="upload" /> 添加
      </div> 
    )
    const child = (
    	<Form>
          <Card title="基本配置">
            <Row gutter={24}>
              <Col sm={8}>
                <FormItem label={`商品分类`}>
                  {getFieldDecorator(`categoryId`, {
                    rules: [{ type: 'array', required: true, message: '请选择商品分类' }],
                    initialValue: product && product.categoryId ? [product.categoryId] : []
                  })(
                    <Cascader options={options} placeholder="请选择"/>
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label={`商品名称`}>
                  {getFieldDecorator(`name`, {
                    rules: [{ message: '请输入商品名称', required: true}],
                    initialValue: product && product.name || ''
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label={`商品条码`}>
                  {getFieldDecorator(`barcode`, {
                    rules: [{message: '请输入商品条码', required: true}],
                    initialValue: product && product.barcode || ''
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={8}>
                <FormItem label={`生产厂商`}>
                  {getFieldDecorator(`manufacturer`, {
                    rules: [{message: '请输入生产厂商', required: true}],
                    initialValue: product && product.manufacturer || ''
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="策略配置" className="mt-20">
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`屏幕展示图（图一、固定宽)`} extra="仅支持png，大小小于2M；按实物宽高1cm=100像素生成图片">
                  {getFieldDecorator(`imageFixWidthUrl`, {
                    rules: [{message: '请上传图片', required: true}],
                    initialValue: this.state.imageFixWidthUrl || []
                  })(
                    <Upload 
                      name="file" 
                      action={`${config.apiUrl}${config.apiBasePath}/upload/image`} 
                      listType="picture-card"
                      headers={{
                        Authorization: localStorage.token
                      }}
                      onPreview={this.handlePreview}
                      onChange={(fileList) => {
                        this.handleChange('imageFixWidthUrl', fileList)
                      }}
                      accept="image/*"
                      fileList={this.state.imageFixWidthUrl || []}
                    >
                      {this.state.imageFixWidthUrl.length === 1 ? null : uploadButton}
                    </Upload>
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label={`后台展示图（图二、正方形)`} extra="仅支持png，大小小于2M；按实物宽高1cm=34像素居中1000*1000像素空图层生成图片">
                  {getFieldDecorator(`imageUrl`, {
                    rules: [{message: '请上传图片', required: true}],
                    initialValue: this.state.imageUrl || []
                  })(
                    <Upload 
                      name="file" 
                      action={`${config.apiUrl}${config.apiBasePath}/upload/image`} 
                      listType="picture-card"
                      headers={{
                        Authorization: localStorage.token
                      }}
                      onPreview={this.handlePreview}
                      onChange={(fileList) => {
                        this.handleChange('imageUrl', fileList)
                      }}
                      accept="image/*"
                      fileList={this.state.imageUrl || []}
                    >
                      {this.state.imageUrl.length === 1 ? null : uploadButton}
                    </Upload>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
    )
    return (
      <section className="GoodManagementDetail-page EquipmentInfoDetail-page">
        <DetailTemplate
	      	config = {this.props.config}
	      	title = {product && product.name || this.props.title}
	      	child={child}
	      	onCancle={this.props.goBack}
	      	onOk={this.handleSubmit}
	      />
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const getCat = state => state.get("rts").get("getCat")
const getProduct = state => state.get("rts").get("getProduct")

const EquipmentInfoDetailForm = Form.create()(GoodManagementDetail)

const mapStateToProps = createStructuredSelector({
  UUid,
  getCat,
  getProduct
});

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentInfoDetailForm);
