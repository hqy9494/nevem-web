import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button, Table, Modal, InputNumber, Popconfirm, message } from "antd";
import moment from "moment";
import uuid from "uuid";
import QRCode from 'qrcode.react';
import TableExpand from "../../components/TableExpand";
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option


export class WarehousePurchaseDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
    this.time = null;
  }

  componentWillMount() {}

  componentDidMount() {
    const id = this.props.match.params.id
    if(id) this.getAgent(id)
    this.getDepot()
    this.getBatches()
  }

  componentWillUnmount() {
    clearTimeout(this.time)
  }

  componentWillReceiveProps(nextProps) {
    const { getDepot, getBatches, getPayStatus, getAgent } = nextProps
    const { batchesData = [] } = this.state;
    let newBatchesData = [...batchesData];
    if (getDepot && getDepot[this.uuid]) {
      this.setState({
        depotData: getDepot[this.uuid].data,
        depotTotal: getDepot[this.uuid].total
      })
    }
    if (getAgent && getAgent[this.uuid]) {
      this.setState({
        agentData: getAgent[this.uuid],
      })
    }
    if (getBatches && getBatches[this.uuid]) {
      newBatchesData = getBatches[this.uuid].data.length > 0 && newBatchesData.length == 0 ? getBatches[this.uuid].data.map((v, i) => {
        return {
          ...v,
          num: 0
        }
      }) : getBatches[this.uuid].data.length > 0 && newBatchesData.length > 0 ? newBatchesData.map((v, i) => {
        return {
          ...v,
          num: v.num ? v.num : 0
        }
      }) : getBatches[this.uuid].data;
      this.setState({
        batchesData: newBatchesData,
        batchesTotal: getBatches[this.uuid].total
      })
    }
    if (getPayStatus && getPayStatus[this.uuid]) {
      this.setState({
        payStatus: getPayStatus[this.uuid],
      })
    }
  }

  onDepotChange = (val) => { this.setState({ depotId : val});}
  

  handleSubmit = (type = '') => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        let itemList = []
        for(let i of Object.keys(values)){
          if (!values[i]) continue
          if(i === 'depotId') params[i] = values[i]
        }
        this.state.batchesData && this.state.batchesData.forEach((v,i) => {
          itemList.push({
            'batchId': v.id,
            'count': Number(v.num)
          })
        })
        params['items'] = itemList.length > 0 && itemList
        if(-1 === itemList.findIndex(v => isNaN(v.count))) {
          if(type !== '') {
            params['payType'] = type
            this.postAgentOrder(params)
          } else {
            this.postAgentOrder(params)
          }
        } else {
          message.error("批次数量错误",1)
        }
      }
    })
  }

  getDepot = () => {
    this.props.rts({
      method: 'get',
      url: '/Depots'
    }, this.uuid, 'getDepot')
  }

  getPayStatus = (id) => {
    this.props.rts({
      method: 'get',
      url: `/AgentOrders/${id}/payStatus`
    }, this.uuid, 'getPayStatus')
  }

  getAgent = (id) => {
    this.props.rts({
      method: 'get',
      url: `/Agents/${id}`
    }, this.uuid, 'getAgent')
  }

  onInputChange = (e, i) => {
    let newData = [...this.state.batchesData];
    newData = newData.map(v => {
      if (v.key === i) {
        return {
          ...v,
          num: Number(e)
        }
      }else{
        return v
      }
    })
    this.setState({ batchesData: newData});
  }
  postAgentOrder = (params) => {
    return this.props.rts({
      method: 'post',
      url: '/AgentOrders',
      data: params
    }, this.uuid, 'postAgentOrder',(val) => {
      if(val) {
        if(!val.direct && params.payType !== 'balance') {
          this.setState({
            visible: true,
            url : val.payData.code_url
          },() =>{
            this.getAgentOrderStatus(val.id)
          })
        }else if(val.direct || params.payType === 'balance'){
          this.props.to('/Stock/WarehousePurchase')
        }
      }
    })
  }

  handleDelete = (key) => {
    const newData = [...this.state.batchesData]
    this.setState({ batchesData: newData.filter(item => item.key !== key) })
  }

  handleMessage = () => {
    message.error('余额不足', 1, () => {
      this.setState({
        failVisible: false
      })
    })
  }

  getAgentOrderStatus = (id) => {
    this.props.rts({
      method: 'get',
      url: `/AgentOrders/${id}/payStatus`,
    }, this.uuid, 'getAgentOrderStatus',(val) => {
      clearTimeout(this.time)
      if(val.status === 'PAY') {
        this.setState({
          payVisible: true
        },()=>{
          this.props.to('/Stock/WarehousePurchase')
        })
      }else{
        this.time = setTimeout(() => {
          this.getAgentOrderStatus(id)
        },1000)
      }
    })
  }

  getBatches = () => {
    this.props.rts({
      method: 'get',
      url: '/Batches',
      params: {filter:{where:{active:true}}}
    }, this.uuid, 'getBatches')
  }

  render() {
    const { selectedRowKeys, depotData, batchesData, depotId, agentData } = this.state;
    batchesData && batchesData.forEach((item,index) => { item['key'] = index;})
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    let config = {
      data: batchesData && batchesData.map(v => {
        return {
          ...v,
          num: v.num 
        }
      }),
      columns: [
        {
          title: "批次名称",
          dataIndex: 'name',
          key: 'name',
          render: (text, record, index) => <span>{record.name}</span>
        },
        {
          title: "单价",
          dataIndex: "price",
          key: "price",
          render: (text, record, index) => <span>￥{record.price}</span>
        },
        {
          title: "单品总数",
          key: "num",
          dataIndex: "num",
          render: (text, record, index) => <InputNumber min={0} style={{width: '100%'}} defaultValue={text} onChange={(e) => this.onInputChange(e, index)}/>
        },
        {
          title: "总价",
          key: "totalPrice",
          dataIndex: "totalPrice",
          render: (text, record, index) => <span> { record.price * record.num }</span>
        },
        {
          title: '操作',
          dataIndex: 'handle',
          render: (text, record) => {
            return (
              batchesData.length > 1
                ? (
                  <Popconfirm 
                    title="确定删除?" 
                    onConfirm={() => this.handleDelete(record.key)}
                    okText="确定"
                    cancelText="取消"
                    icon="delete"
                  >
                    <Button type="danger" size="small">删除</Button>
                  </Popconfirm>
                ) : null
            )
          }
        },
      ]
    };
    
    const { getFieldDecorator, getFieldsValue } = this.props.form
    const child = (
      <section className="WarehousePurchaseDetail-page">
        <Form onSubmit={this.handleSubmit}>
          <div className="project-title">新增仓库进货</div>
          <div style={{backgroundColor: '#fff', padding: '20px'}}>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`仓库进货:`}>
                  {getFieldDecorator(`depotId`, {
                    rules: [{
                      message: '必选项',
                      required: true
                    }],
                    initialValue : ''
                  })(
                    <Select
                      onChange={this.onDepotChange}
                      placeholder="请选择"
                      style={{width:'100%'}}
                    >
                      {
                        depotData && depotData.map((v, i) => {
                          return <Option value={v.id} key={i}>{v.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Card title="商品明细" className="mt-20" style={{display: depotId ? 'block' : 'none'}}>
              <Row gutter={24}>
                <Col sm={24}>
                  <Table
                    bordered
                    dataSource={config.data}
                    columns={config.columns}
                  />
                </Col>
              </Row>
            </Card>
            <Row gutter={24}
              justify="end"
              type="flex"
              style={{ margin: '10px 0px', display: depotId ? 'flex' : 'none'}}
            >
              <Col sm={4}>
                <strong>总价：{batchesData && (batchesData.map(x=>x.price * x.num).reduce((l,r)=> l+r)).toFixed(2)} 元</strong>
              </Col>
            </Row>
            <Row gutter={24}
              justify="start"
              type="flex"
              style={{ margin: '10px 0px', display: depotId ? 'flex' : 'none'}}
            >
              <Col sm={4}>
                <strong>账号余额：{agentData && agentData.balance.toFixed(2)} 元</strong>
              </Col>
            </Row>
            <div className="ta-c mt-20" style={{display: depotId ? 'block' : 'none'}}>
              <Button type="danger" style={{ marginRight: 8 }} onClick={() => {
                this.props.goBack()
              }}>
                取消
              </Button>
              <Button type="primary" style={{ marginRight: 8 }} htmlType="submit">支付</Button>
              <Button style={{ marginRight: 8 }} onClick={() => {this.setState({ failVisible: true })} }>余额支付</Button>
            </div>
          </div>
        </Form>
        <Modal
          width="25%"
          height="80%"
          visible={this.state.visible}
          title="二维码支付"
          okText="确定"
          cancelText="取消"
          style={{display:"block"}}
          onOk={() => {
            // console.log(123)
          }}
          onCancel={() => {
            this.setState({ visible: false });
            clearTimeout(this.time)
          }}
        >
          <div style={{ textAlign: 'center'}} >
            <h4 style={{ width: '300px', margin: 'auto' }}>请使用微信或者支付宝支付完成后，仓库会在一个工作日内审核发货</h4>
            <QRCode
              style={{ marginTop: '20px'}}
              size={150} 
              value={this.state.url && this.state.url}
            />
          </div>
        </Modal>
        <Modal
          width="25%"
          visible={this.state.payVisible}
          title=""
          footer={null}
          onCancel={() => {
            this.setState({ payVisible: false });
          }}
        >
          <div>支付成功，订单审核后会立即发货，如有库存问题导致发货不成功，订单额将会立即退回</div>
        </Modal>
        <Modal
          width="25%"
          visible={this.state.failVisible}
          title=""
          onCancel={()=> { this.setState({ failVisible: false })}}
          footer={null}
        >
          <div>您的账号余额为<span>{agentData && agentData.balance.toFixed(2)}</span>元，须支付的金额为{batchesData && (batchesData.map(x=>x.price * x.num).reduce((l,r)=> l+r)).toFixed(2)}元。是否确定用余额支付？</div>
          <div className="ta-c mt-20">
            <Button type="danger" style={{ marginRight: 8 }} onClick={() => {
              this.setState({
                failVisible: false
              })
            }}>
              取消
            </Button>
            <Button onClick={() => {
                if(agentData || batchesData){
                   if(Number(agentData.balance.toFixed(2)) >= Number((batchesData.map(x=>x.price * x.num).reduce((l,r)=> l+r)).toFixed(2))) {
                    this.handleSubmit('balance')
                   } else if(Number(agentData.balance.toFixed(2)) < Number((batchesData.map(x=>x.price * x.num).reduce((l,r)=> l+r)).toFixed(2))) {
                    this.handleMessage()
                   }
                  }
                }
              }
            >
            余额支付</Button>
          </div>
        </Modal>
      </section>
    )
    return (
      <section className="EquipmentInfoDetail-page">
	      <DetailTemplate
	      	config = {this.props.config}
	      	title = {this.props.title}
	      	child={child}
	      	onCancle={this.props.goBack}
	      	onOk={this.handleSubmit}
	      	removeAllButton
	      />
        
	  </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const getDepot = state => state.get("rts").get("getDepot");
const getBatches = state => state.get("rts").get("getBatches");
const postAgentOrder = state => state.get("rts").get("postAgentOrder");
const getPayStatus = state => state.get("rts").get("getPayStatus");
const getAgent = state => state.get("rts").get("getAgent");
const getAgentOrderStatus = state => state.get("rts").get("getAgentOrderStatus");


const WarehousePurchaseDetailForm = Form.create()(WarehousePurchaseDetail)

const mapStateToProps = createStructuredSelector({
  UUid,
  getDepot,
  getBatches,
  postAgentOrder,
  getPayStatus,
  getAgent,
  getAgentOrderStatus
});

export default connect(mapStateToProps, mapDispatchToProps)(WarehousePurchaseDetailForm);
