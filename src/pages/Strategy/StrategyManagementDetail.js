import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Form, Input, Alert, Tree, Tabs, List, Button, InputNumber } from "antd";
import moment from "moment";
import uuid from "uuid";
import DetailTemplate from "../../components/DetailTemplate";
const FormItem = Form.Item
const Search = Input.Search
const TreeNode = Tree.TreeNode
const TabPane = Tabs.TabPane

export class StrategyManagementDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      catData: [],
      catTotal: 0,
      productData: [],
      productData1: [],
      productTotal: 0,
      setArr: [],
      priceRulesData: {},
      categoryId: 'Hy_y75YXX',
      isAdd: false,
      tabIndex: '1'
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    const { match } = this.props
    if (match.params.id === 'add') {
      this.setState({
        isAdd: true
      })
    }
  }
  componentDidMount() {
    const { match } = this.props

    this.getCat()

    if (match.params.id === 'add') {
      this.getProduct('getProduct')
    }else{
      this.getPriceRules(this.state.tabIndex === '1')
    }
  }
  componentWillReceiveProps(nextProps) {
    const { getCat, getProduct, getTabProducts, getPriceRules } = nextProps

    if (getCat && getCat[this.uuid]) {
      this.setState({
        catData: getCat[this.uuid].data,
        catTotal: getCat[this.uuid].total,
      })
    }

    if (getPriceRules && getPriceRules[this.uuid]) {
      this.setState({
        priceRulesData: getPriceRules[this.uuid],
        productData1: getPriceRules[this.uuid].items
      })
    }

    if (getProduct && getProduct[this.uuid]) {
      this.setState({
        productData: getProduct[this.uuid].data,
        productTotal: getProduct[this.uuid].total,
      })
    }

    if (getTabProducts && getTabProducts[this.uuid] && this.state.tabIndex !== '1') {
      this.setState({
        productData: getTabProducts[this.uuid].data,
        productTotal: getTabProducts[this.uuid].total,
      })
    }
  }
  getPriceRules = (bol, value) => {
    const { match } = this.props
    this.props.rts({
      method: 'get',
      url: `/PriceRules/${match.params.id}`
    }, this.uuid, 'getPriceRules', data => {
      const setArr = []

      data.items.forEach(v => {
        setArr.push(v.productId)
      })

      let where = {
        id: {
          [bol ? 'inq' : 'nin']: setArr
        }
      }

      if (value) {
        where = Object.assign({}, where, {
          or: [
            {
              name: value,
            },
            {
              id: value
            }
          ]
        })
      }

      this.getProduct('getTabProducts', {
        filter: {
          where
        }
      })
    })
  }
  getCat = () => {
    this.props.rts({
      method: 'get',
      url: '/Categories'
    }, this.uuid, 'getCat')
  }
  getProduct = (name, params) => {
    this.props.rts({
      method: 'get',
      url: '/Products',
      params
    }, this.uuid, name)
  }
  postPriceRules = params => {
    const { match } = this.props
    this.props.rts({
      method: 'post',
      url: match.params.id === 'add' ? `/PriceRules` : `/PriceRules/${match.params.id}`,
      data: params
    }, this.uuid, 'postPriceRules', () => {
      this.props.goBack()
    })
  }
  getOptions = (catData = []) => {
    let data = []

    catData.forEach(v => {
      if (v) data.push({
        key: v.id,
        title: v.name
      })
    })

    return data
  }
  onSelect = (selectedKeys, e) => {
    // console.log(selectedKeys, e)
  }
  handleSearch = value => {
    this.getPriceRules(this.state.tabIndex === '1', value)
  }
  handleSubmit = (e) => {
    const { match } = this.props
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {
          name: '',
          items: []
        }
        for(let i of Object.keys(values)){
          if (values[i] == null) continue
          if (i === 'name') {
            params['name'] = values[i]
          }else{
            if (!values[i]) continue
            params.items.push({
              productId: i,
              price: values[i]
            })
          }
        }
        // console.log(params, 'params', values)
        this.postPriceRules(params)
      }
    })
  }
  handleTabChange = activeKey => {
    this.setState({
      tabIndex: activeKey
    }, () => {
      this.getPriceRules(activeKey === '1')
    })
  }
  render() {
    const { catData, productData, priceRulesData, productData1 } = this.state
    const { match } = this.props
    const { id } = match.params
    const { getFieldDecorator } = this.props.form
    // console.log(productData, 'productData', this.state.tabIndex)
    let options = this.getOptions(catData) || []
    const child = (
    	<Form className="StrategyManagementDetail-page" onSubmit={this.handleSubmit}>
        <div className="project-title">价格策略列表</div>
        <Row gutter={24} className="EquipmentInfoDetail-page" style={{padding:'5px 20px'}}>
          <Col span={8}>
            <FormItem label={`价格策略名称`}>
              {getFieldDecorator(`name`, {
                rules: [{ type: 'string', required: true, message: '请填写价格策略名称' }],
                initialValue: priceRulesData && priceRulesData.name || ''
              })(
                <Input/>
              )}
            </FormItem>
          </Col>
          <Col span={8}><Alert message="价格为0的商品默认为无库存处理" type="warning" showIcon /></Col>
        </Row>
        <Row className="project-title">
          <Col span={12}>商品分类</Col>
          <Col span={6} offset={6}>
            <Search
              placeholder="商品名称或条码"
              onSearch={this.handleSearch}
              enterButton
            />
          </Col>
        </Row>
        <Row style={{backgroundColor: '#fff', padding: '20px'}}>
          <Col span={3}>
            <Tree
              defaultExpandAll
              showLine
              defaultSelectedKeys={[this.state.categoryId]}
              onSelect={this.onSelect}
            >
              {
                options && options.map((v, i) => (
                  <TreeNode title={v.title} key={v.key} />
                ))
              }
            </Tree>
          </Col>
          <Col span={21}>
            <Tabs defaultActiveKey="1" onChange={this.handleTabChange} activeKey={`${this.state.tabIndex}`}>
              <TabPane tab="已设置价格商品" key="1" style={{height: '500px', overflow: 'scroll'}}>
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={id === 'add' ? productData : productData1}
                  locale={{emptyText: '暂无数据'}}
                  renderItem={item => (
                    <List.Item>
                      <div className="StrategyManagementDetail-item">
                        <div className="StrategyManagementDetail-item-title">{id === 'add' ? item.name : item.product.name}</div>
                        <Row className="StrategyManagementDetail-item-content" type="flex" align="middle">
                          <Col span={6}>
                            <img src={id === 'add' ? item.imageUrl : item.product.imageUrl}/>
                          </Col>
                          <Col span={18} className="EquipmentInfoDetail-page">
                            <FormItem label={`价格`}>
                              {getFieldDecorator(`${id === 'add' ? item.id : item.productId}`, {
                                // rules: [{ type: 'number', required: true, message: '请填写价格' }],
                                initialValue: item.price === 0 ? 30 : item.price
                              })(
                                <InputNumber min={0.01}/>
                              )}
                            </FormItem>
                          </Col>
                        </Row>
                        <div className="StrategyManagementDetail-item-bottom">{id === 'add' ? item.id : item.productId}</div>
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>
              {
                id !== 'add' &&
                <TabPane tab="未设置价格商品" key="2" style={{height: '500px', overflow: 'scroll'}}>
                  <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={productData}
                    locale={{emptyText: '暂无数据'}}
                    renderItem={item => (
                      <List.Item>
                        <div className="StrategyManagementDetail-item">
                          <div className="StrategyManagementDetail-item-title">{item.name}</div>
                          <Row className="StrategyManagementDetail-item-content" type="flex" align="middle">
                            <Col span={6}>
                              <img src={item.imageUrl}/>
                            </Col>
                            <Col span={18} className="EquipmentInfoDetail-page">
                              <FormItem label={`价格`}>
                                {getFieldDecorator(`${item.id}`, {
                                  // rules: [{ type: 'number', required: true, message: '请填写价格' }],
                                  initialValue: ''
                                })(
                                  <InputNumber min={0.01}/>
                                )}
                              </FormItem>
                            </Col>
                          </Row>
                          <div className="StrategyManagementDetail-item-bottom">{item.id}</div>
                        </div>
                      </List.Item>
                    )}
                  />
                </TabPane>
              }
            </Tabs>
          </Col>
        </Row>
      </Form>
    )
    return (
    	<DetailTemplate
	      	config = {this.props.config}
	      	title = {priceRulesData && priceRulesData.name || '新建'}
	      	child={child}
	      	onCancle={this.props.goBack}
	      	onOk={this.handleSubmit}
	    />
      
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const StrategyManagementDetailForm = Form.create()(StrategyManagementDetail)

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getCat: state => state.get("rts").get("getCat"),
  getProduct: state => state.get("rts").get("getProduct"),
  getPriceRules: state => state.get("rts").get("getPriceRules"),
  getTabProducts: state => state.get("rts").get("getTabProducts")
});

export default connect(mapStateToProps, mapDispatchToProps)(StrategyManagementDetailForm);
