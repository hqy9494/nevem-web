import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Form, Input, Card, Button, Select, Table } from "antd";
import moment from "moment";
import uuid from "uuid";
import DetailTemplate from "../../components/DetailTemplate"
const Option = Select.Option
const FormItem = Form.Item

export class CargoTemplateDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: [11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 51, 52, 53, 54],
      productsData: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id
    this.getProducts()

    if (id !== 'add') {
      this.getSlotTemplates(id)
    }
  }
  componentWillReceiveProps(nextProps) {
    const { getProducts, getSlotTemplates } = nextProps

    if (getProducts && getProducts[this.uuid]) {
      this.setState({
        productsData: getProducts[this.uuid].data,
      })
    }

    if (getSlotTemplates && getSlotTemplates[this.uuid]) {
      this.setState({
        slotTemplatesData: getSlotTemplates[this.uuid],
      })
    }
  }
  getSlotTemplates = id => {
    this.props.rts({
      method: 'get',
      url: `/SlotTemplates/${id}`
    }, this.uuid, 'getSlotTemplates')
  }
  getProducts = () => {
    this.props.rts({
      method: 'get',
      url: '/Products'
    }, this.uuid, 'getProducts')
  }
  postSlotTemplates = params => {
    this.props.rts({
      method: 'post',
      url: '/SlotTemplates',
      data: params
    }, this.uuid, 'postSlotTemplates', () => {
      this.props.goBack()
    })
  }
  handleSubmit = (e) => {
    const { match } = this.props
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          name: '',
          active: true,
          items: []
        }

        for(let i of Object.keys(values)){
          if (values[i] == null) continue
          if (i === 'name') {
            params['name'] = values[i]
          }else{
            params['items'].push({
              place: i,
              productId: values[i]
            })
          }
        }

        this.postSlotTemplates(params)
        // console.log(params)
      }
    })
  }
  handleTable = (num) => {
    const res = []

    for (var i = 0; i < num.length; i++) {
      res.push({
        id: i,
        place: num[i],
        barcode: ''
      })
    }

    return res
  }
  handleTableById = data => {
    const res = []

    data.forEach((v, i) => {
      res.push({
        id: v.id,
        productId: v.productId,
        place: v.place,
        barcode: v.barcode
      })
    })

    return res
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { num, productsData, slotTemplatesData } = this.state
    const { match } = this.props
    const id = match.params.id
    let data = []
    if (id === 'add') {
      data = this.handleTable(num)
    }else{
      if (slotTemplatesData) data = this.handleTableById(slotTemplatesData.items)
    }
    const columns = [
      {
        title: '名称',
        dataIndex: 'place',
        key: 'place',
      },
      {
        title: '商品',
        key: 'id',
        render: (text) => (
          <FormItem>
            {getFieldDecorator(`${text.place}`, {
              rules: [{required: true, message: '请选择商品'}],
              initialValue: text && text.productId || ''
            })(
              <Select>
                {
                  productsData && productsData.map((v, i) => (
                    <Option value={v.id} key={i}>{v.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        ),
      },
    ];
    const child = (
	    <Form>
	      <Row gutter={24} className="EquipmentInfoDetail-page">
	        <Col span={8}>
	          <FormItem label={`名称`}>
	            {getFieldDecorator(`name`, {
	              rules: [{ type: 'string', required: true, message: '请填写设备名称' }],
	              initialValue: slotTemplatesData && slotTemplatesData.name || ''
	            })(
	              <Input/>
	            )}
	          </FormItem>
	        </Col>
	      </Row>
	      <Table
	      	style={{marginTop:'7px'}}
	      	className="publicTable"
	        columns={columns}
	        dataSource={data}
	        pagination={false}
	        rowKey="id"
	        bordered
	        locale={{emptyText:'暂无数据'}}
	      />
	    </Form>
    )

    return (
      <section className="CargoTemplateDetail-page">
	      <DetailTemplate
	      	config = {this.props.config}
	      	title = {slotTemplatesData && slotTemplatesData.name || this.props.title}
	      	child={child}
	      	onCancle={this.props.goBack}
	      	onOk={this.handleSubmit}
	      	isBottom
	      />
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const CargoTemplateDetailForm = Form.create()(CargoTemplateDetail)

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getProducts: state => state.get("rts").get("getProducts"),
  getSlotTemplates: state => state.get("rts").get("getSlotTemplates"),
});

export default connect(mapStateToProps, mapDispatchToProps)(CargoTemplateDetailForm);
