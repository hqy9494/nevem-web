import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button, Table, Modal, Popconfirm } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand";
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option


export class PurchasePurchaseDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      dataSourceRows: [],
      priceList: [],
    };
    this.uuid = uuid.v1();
  }

  selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });
  }

  onSelectedRowKeysChange = (selectedRowKeys, selectedRows) =>{
    this.setState({ 
      selectedRowKeys,
      selectedRows,
    });
  }
  
  componentWillMount() {  
  }

  componentDidMount() {
    this.getDepot()
    this.getProduct()
  }

  onOptionChange = (val) => { this.setState({ depotId: val }) }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dataSourceRows } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        let productList = []
        for(let i of Object.keys(values)){
          if (!values[i]) continue
          params[i] = values[i]
          if(i === 'bizTime') params[i] = values[i]['_d']
        }
        dataSourceRows && dataSourceRows.length > 0 && dataSourceRows.forEach((v) => {
          productList.push({
            'productId' : v['id'],
            'qty' : this.props.form.getFieldValue('qty'),
            'totalPrice': this.props.form.getFieldValue('qty') * this.props.form.getFieldValue('price')
          })
        })
        params['items'] = productList.length > 0 ? productList : []
        this.postPurchase(params)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const { getProduct, getDepot } = nextProps
    if (getProduct && getProduct[this.uuid]) {
      this.setState({
        productData: getProduct[this.uuid].data,
        productTotal: getProduct[this.uuid].total
      })
    }
    if (getDepot && getDepot[this.uuid]) {
      
      this.setState({
        depotData: getDepot[this.uuid].data,
        depotTotal: getDepot[this.uuid].total
      })
    }
  }

  getProduct = () => {
    this.props.rts({
      method: 'get',
      url: '/Products',
      include: 'category'
    }, this.uuid, 'getProduct')
  }

  postPurchase = (params = {}) => {
    this.props.rts({
      method: 'post',
      url: '/Purchases/in',
      data: params
    }, this.uuid, 'postPurchase', () => {
      this.setState({
        refreshTable: true
      })
      this.props.goBack()
    })
  }
  onChange = (val) => {
    // console.log(val,"val")
  }

  getCount = (arr, ...sum) => {
    let k = 0, result = 0;
    while( k < arr.length) {
      if(!sum) return;
      if(sum.length < 2) {
        result += arr[k][sum[0]]
      } else if(sum.length == 2) {
        result += (Math.floor(arr[k][sum[0]] * arr[k][sum[1]] * 100) / 100)
      }
      k++
    }
    return result
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSourceRows].map((v, i) => { return { ...v, key: i } });

    this.setState({ dataSourceRows: dataSource.filter(item => item.key !== key) });
  }
  getDepot = () => {
    this.props.rts({
      method: 'get',
      url: '/Depots'
    }, this.uuid, 'getDepot', () => {
      this.setState({
        refreshTable: true
      })
    })
  }

  render() {
    const { selectedRowKeys, depotData, selectedRows, dataSourceRows } = this.state;
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.onSelectedRowKeysChange,
      selections: true,
      onSelection: this.onSelection,
    };
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Products",
        include: 'category'
      },
      search: [
        {
          type: "field",
          field: "barcode",
          title: "条形码"
        },
        {
          type: "field",
          field: "name",
          title: "商品名称"
        }
      ],
      columns: [
        {
          title: "图片",
          dataIndex: "imageUrl",
          key: "imageUrl",
          render: (val) => {
            return <img src={val} style={{width: '50px', height: '50px'}}/>
          }
        },
        {
          title: "条形码",
          dataIndex: "barcode",
          key: "barcode",
        },
        {
          title: "商品名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "分类名称",
          dataIndex: "category.name",
          key: "category",
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };
    const columns = [{
      title: '商品',
      dataIndex: 'name',
      key: 'name'
      },{
        title: '箱/件数',
        dataIndex: 'parts',
        render: (text, record, index) => {
          return (
          <FormItem>
            {getFieldDecorator(`qty`, {
              rules: [{
                message: '必选项',
              }],
              initialValue : 1,
            })(
              <Input type="number"
              defaultValue={1} 
              onChange={this.onPartChange}
              />
            )}
          </FormItem>
          )
        }
      },{
        title: '单价',
        dataIndex: 'price',
        render: (text, record, index) => {
          return (
          <FormItem>
            {getFieldDecorator(`price`, {
              rules: [{
                message: '必选项',
              }],
              initialValue : 1,
            })(
              <Input type="number"
              defaultValue={1} 
              onChange={this.onPriceChange}
              />
            )}
          </FormItem>
          )
        }
      },{
        title: '合计',
        dataIndex: 'total',
        render: (text, record) => {
          return (
          <FormItem>
            {getFieldDecorator(`totalPrice`, {
              rules: [{
                message: '必选项',
              }],
            })(
              <span> { this.props.form.getFieldValue('price') * this.props.form.getFieldValue('qty') }</span>
            )}
            
          </FormItem>
          )
        }
      }];
      // {
      //   title: '操作',
      //   dataIndex: 'handle',
      //   render: (text, record) => { 
      //     return (
      //       this.state.dataSourceRows.length > 0
      //       ? (
      //         <Button
      //           icon="delete" 
      //           type="danger" 
      //           onClick={(e)=> this.handleDelete(record.key)}>
      //         删除</Button>
      //       ) : null
      //     ) 
      //   },
      // }
    const { getFieldDecorator } = this.props.form
    return (
      <section className="PurchasePurchaseDetail-page">
        <div className="project-title">新增采购进货</div>
        <Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`仓库:`}>
                  {getFieldDecorator(`depotId`, {
                    rules: [{
                      message: '必选项!',
                      required: true
                    }],
                  })(
                    <Select
                      placeholder="请选择"
                      onChange={this.onOptionChange}
                      style={{width:'100%'}}
                    >
                      {
                        depotData && depotData.map((v, i) => {
                          return  <Option value={v.id} key={i}>{v.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          <Card title="商品明细" className="mt-20">
            <Row gutter={24}>
              <Col sm={24}>
                <Table 
                  columns={columns}
                  dataSource={ dataSourceRows.length > 0 ? dataSourceRows.map((v, i) => {
                    return {
                      ...v,
                      key: i,
                    }
                  }) : []} 
                />
              </Col>
            </Row>
            <Row gutter={24} style={{margin: 10}}>
              <Col sm={12}>
                总数：<span>{this.props.form.getFieldValue('qty') !== '' && this.props.form.getFieldValue('qty') * dataSourceRows.length}</span>
              </Col>
              <Col sm={12}>
                合计：<span>{this.props.form.getFieldValue('qty') * this.props.form.getFieldValue('price') * dataSourceRows.length}</span>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={4}>
                <Input/>
              </Col>
              <Col sm={2}>
                <Button 
                  type="primary"
                  onClick={()=>{
                    this.setState({
                      visible: true
                    })
                  }} 
                >手动添加
                </Button>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`进货时间`}>
                  {getFieldDecorator(`bizTime`, {
                    rules: [{
                      message: '请选择进货时间！', type: 'object', required: true
                    }],
                  })(
                    <DatePicker />
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem label={`备注`}>
                  {getFieldDecorator(`remarks`, {
                    rules: [{
                      message: '',
                    }],
                    initialValue: ''
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <div className="ta-c mt-20">
            <Button style={{ marginRight: 8 }} onClick={() => {
              this.props.goBack()
            }}>
              返回
            </Button>
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
        <Modal
          width="80%"
          height="80%"
          visible={this.state.visible}
          title="单据详情"
          okText="确定"
          cancelText="取消"
          style={{display:"block"}}
          onOk={() => {
            this.setState({ 
              visible: false,
              dataSourceRows: selectedRows,
              refreshTable: true,
            });
          }}
          onCancel={() => {
            this.setState({ 
              visible: false,
            });
          }}
        >
          <TableExpand
            {...config}
            path={`${this.props.match.path}`}
            replace={this.props.replace}
            refresh={this.state.refreshTable}
            pages={true}
            onRefreshEnd={() => {
              this.setState({refreshTable: false});
            }}
            rowSelection={rowSelection}
            onRow={(record) => ({
              onClick: () => {
                this.selectRow(record);
              },
            })}
          />
        </Modal>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const getDepot = state => state.get("rts").get("getDepot");
const postPurchase = state => state.get("rts").get("postPurchase");
const getProduct = state => state.get("rts").get("getProduct");

const PurchasePurchaseDetailForm = Form.create()(PurchasePurchaseDetail)

const mapStateToProps = createStructuredSelector({
  UUid,
  getDepot,
  postPurchase,
  getProduct
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchasePurchaseDetailForm);
