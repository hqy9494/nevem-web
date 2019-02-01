import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Table, Button, Tabs, Modal, Form, Select, Input, message } from "antd";
import {Panel} from "react-bootstrap";
import classNames from "classnames";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import { getParameterByName } from '../../utils/utils';
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Option = Select.Option

export class PurchaseReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visible1: false,
      visible2: false,
      dataSource: {},
      orderId:null,
      orderStatus: 'PAY'
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    /*if(Object.keys(this.props.params).length===0) localStorage.removeItem('tabsPanel');
    let str = localStorage.tabsPanel || '';
    console.log();
    if(str.indexOf(',WAIT_SHIPPING,SHIPPING')>=0){
    	let arr = localStorage.tabsPanel.split(',');
    	this.setState({orderStatus:arr});    	
    }else{
    	this.setState({orderStatus:str || 'PAY'});
    }*/
    const params = getParameterByName('q')? JSON.parse(decodeURIComponent(getParameterByName('q'))) : {};
    this.setState({orderStatus: params.tabsKey || "PAY"});
    
  }

  componentDidMount() {
    this.getDepot()
  }

  showDeliverId = (id) => {
    this.setState({
      visible2: true,
      orderId: id,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { getDepot, getAgentOrderItem, getAgentOrderPass } = nextProps
    if (getDepot && getDepot[this.uuid]) {
      this.setState({
        outDepotData: getDepot[this.uuid].data,
        outDepotTotal: getDepot[this.uuid].total
      })
    }
    if (getAgentOrderItem && getAgentOrderItem[this.uuid]) {
      this.setState({
        AgentOrderItemData: getAgentOrderItem[this.uuid]
      })
    }
    if (getAgentOrderPass && getAgentOrderPass[this.uuid]) {
      this.setState({
        AgentOrderPassData: getAgentOrderPass[this.uuid]
      })
    }
  }

  handleOk = () => {
    const id = this.state.orderId && this.state.orderId
    if(id){
      this.postAgentOrderShipment(id, {
        deliveryId: this.props.form.getFieldValue('deliveryId') ? this.props.form.getFieldValue('deliveryId') : 123 ,
        deliveryCompany: this.props.form.getFieldValue('deliveryCompany') ? this.props.form.getFieldValue('deliveryCompany') : 123
      })
    }
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      visible1: false,
      visible2: false,
    })
  }

  onSelChange = (val) => { this.setState({ resultVal: val }) }

  onDepotChange = (val) => { this.setState({ depotId : val}) }

  tabsChange = (key) => {
   /* if() {
      this.setState({
        orderStatus : [key,'WAIT_SHIPPING','SHIPPING']
      }); 
    } else {
      this.setState({
        orderStatus : key
      })
    }*/
    localStorage.tabsPanel = key === 'RECEIVED'?key+',WAIT_SHIPPING,SHIPPING':key;
    this.props.replace(this.props.match.path,`?q={"skip":0}`);
  }

  onDeliveryChange = (val) => { this.setState({ deliveryCompany : val}) }

  getCount = (arr,...sum) => {
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

  postAgentOrderShipment = (id, params) => {
    this.props.rts({
      method: 'post',
      url: `/AgentOrders/${id}/audit/shipment`,
      data: params
    }, this.uuid, 'postAgentOrderShipment',() => {
      this.setState({
        visible2 : false,
        refreshTable: true
      })
    })
  }

  postAgentOrderPass = (id, params) => {
    this.props.rts({
      method: 'post',
      url: `/AgentOrders/${id}/audit/pass`,
      data: params
    }, this.uuid, 'postAgentOrderPass',() => {
      this.setState({
        visible : false,
        refreshTable: true
      })
    })
  }

  postAgentOrderRefuse = (id, params) => {
    this.props.rts({
      method: 'post',
      url: `/AgentOrders/${id}/audit/refuse`,
      data: params
    }, this.uuid, 'postAgentOrderRefuse',() => {
      this.setState({
        visible : false,
        refreshTable: true
      })
    })
  }

  postAgentOrderReceive = (id, params) => {
    this.props.rts({
      method: 'post',
      url: `/AgentOrders/${id}/receive`,
    }, this.uuid, 'postAgentOrderReceive',() => {
      message.success('确认收货成功!', 2000, ()=> {
        this.setState({
          refreshTable: true
        })
      })
    })
  }

  getDepot = () => {
    this.props.rts({
      method: 'get',
      url: '/Depots'
    }, this.uuid, 'getDepot')
  }

  getStatus = (status) => {
    const data = {
      "WAIT_PAY": "未付款",
      "PAY" : "已付款(待审核)",
      "WAIT_SHIPPING": "待发货",
      "SHIPPING": "已发货(待签收)",
      "RECEIVED": "已完成",
      "REFUND":"已退款"
    }
    return status in data ? data[status] : ''
  }

  getAgentOrderItem = id => {
    this.props.rts({
      method: 'get',
      url: `/AgentOrders/${id}`
    }, this.uuid, 'getAgentOrderItem', () => {
      this.setState({
        agentOrderId: id,
      })
    })
  }

  getAgentOrderPass = id => {
    this.props.rts({
      method: 'get',
      url: `/AgentOrders/${id}`,
      params: {
        filter: {
          where: {
            "status": "WAIT_SHIPPING"
          }
        }
      }
    }, this.uuid, 'getAgentOrderPass', () => {
      this.setState({
        agentOrderId: id,
        refreshTable: true
      })
    })
  }

  getAddress = (province, city, district, address) => province + city + district + address

  render() {
    const { getFieldDecorator } = this.props.form
    const { AgentOrderItemData, outDepotData, resultVal, agentOrderId, depotId, AgentOrderPassData, orderStatus, dataSource } = this.state
    const DepotData = [
    {
      name: '韵达',
      key: '1'
    },{
      name: '顺丰',
      key: '2'
    },{
      name: '京东',
      key: '3'
    },{
      name: '圆通',
      key: '4'
    }]
    const dataSourceDepot = {
      data: AgentOrderItemData && AgentOrderItemData.items.map((v, i) => {
        return {
          ...v,
          key: i
        }
      }),
      columns: [
      {
        title: '批次编号',
        dataIndex: 'batchId',
        key: 'batchId',
      },{
        title: '总数',
        dataIndex: 'count',
        key: 'count',
        align:'right'
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        align:'right'
      },
      {
        title: '总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        align:'right',
        render: (text, record) => {
          return <span>￥ {record.price * record.count}</span>
        }
      }],
      element: [
        {
          Rows: [
            {
              cols: 3,
              title: '购买仓库:',
              key: "2"
            },
            {
              cols: 5,
              title: AgentOrderItemData && AgentOrderItemData.depot ? AgentOrderItemData.depot.name : '',
              key: "2"
            },
            {
              cols: 3,
              title: '仓库地址:',
              key: "2"
            },
            {
              cols: 5,
              title: AgentOrderItemData && AgentOrderItemData.depot 
                    ? this.getAddress(AgentOrderItemData.depot.province, AgentOrderItemData.depot.city, AgentOrderItemData.depot.district, AgentOrderItemData.depot.address)
                    : '',
              key: "2"
            },
            {
              cols: 3,
              title: '订单状态:',
              key: "2"
            },
            {
              cols: 5,
              title: AgentOrderItemData && this.getStatus(AgentOrderItemData.status),
              key: "2"
            }
          ]
        },
        {
          Rows: [
            {
              cols: 3,
              title: '单号:',
              key: "2"
            },
            {
              cols: 5,
              title: AgentOrderItemData && AgentOrderItemData.id,
              key: "2"
            },
            {
              cols: 3,
              title: '仓库收货人电话:',
              key: "2"
            },
            {
              cols: 5,
              title: AgentOrderItemData && AgentOrderItemData.depot.phone,
              key: "2"
            }
          ]
        },
        {
          Rows: orderStatus !== 'PAY' ? [
            {
              cols: 3,
              title: '物流:',
              key: "2"
            },
            {
              cols: 5,
              title: AgentOrderItemData && AgentOrderItemData.deliveryCompany,
              key: "2"
            },
            {
              cols: 3,
              title: '物流单号:',
              key: "2"
            },
            {
              cols: 5,
              title: AgentOrderItemData && AgentOrderItemData.deliveryId,
              key: "2"
            }
          ] : []
        }
      ]
    }
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/AgentOrders",
        include: ['depot','agent'],
        where: {
          agent: true,
          status: {
            inq:	orderStatus==="RECEIVED" ? [orderStatus,"WAIT_SHIPPING","SHIPPING"] : [orderStatus]
          }
        }
      },
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      config:this.props.config,
	    title:this.props.title
      
    };
    
    
    const tabsColumns =[
	    {
	      title: "单据编号",
	      dataIndex: "id",
	      key: "id"
	    },
	    {
	      title: "代理商名称",
	      dataIndex: "agent.name",
	      key: "agent.name"
	    },
	    {
	      title: "代理商属性",
	      dataIndex: "direct",
	      key: "direct",
	      render: text => {
	        if (text) {
	           return "直属代理";
	        } else {
	           return "一般代理";
	        }
	      }
	    },
	    {
	      title: "购买仓库",
	      dataIndex: "depot.name",
	      key: "depot"
	    },
	    {
	      title: "申请批次数",
	      dataIndex: "total",
	      key: "total",
	      align:'right',
	    },
	    {
	      title: "合计金额",
	      dataIndex: "price",
	      key: "price",
	      align:'right'
	    },
	    {
	      title: "状态",
	      dataIndex: "status",
	      key: "status",
	      render: text => {
	        if (text == 'WAIT_PAY') {
	          return <span className="statusRedOne">未付款 </span>
	        } else if(text == 'PAY') {
	          return <span className="statusBlueTree">已付款&nbsp;&nbsp;（待审核）</span>
	        } else if(text == 'WAIT_SHIPPING') {
	          return <span className="statusBlueFour">待发货 </span>
	        } else if(text == 'SHIPPING') {
	          return <span className="statusGreenOne">已发货&nbsp;&nbsp;（待签收）</span>
	        } else if(text == 'RECEIVED') {
	          return <span className="statusGreyOne">已完成</span>
	        } else if(text == 'REFUND') {
	          return <span className="statusGreyOne">已退款</span>
	        } else {
	          return <span></span>
	        }
	      }
	    },
	    {
	      title: "操作",
	      key: "handle",
	      render: (text, record) => (
	        <div>
	          <Button 
	            className="buttonListFirst" 
	            size="small"
	            style={{marginRight:'10px'}}
	            onClick={() => {
	              this.setState({
	                visible: record.status === 'PAY' ? true : false,
	                visible1: record.status !== 'PAY' ? true : false 
	              })
	              this.getAgentOrderItem(record.id)
	            }}
	          >详情</Button>
	          { record.status === 'WAIT_SHIPPING' ? (
	              <Button 
	                className="buttonListSecond"
	                size="small"
	                style={{marginRight:'10px'}}
	                onClick={() => {
	                  this.showDeliverId(record.id)
	                }}
	              >物流</Button>
	            ) : ''
	          }
	        </div>
	      )
	    }
	  ]
    let searchOther = [
	    {
	    	type: "field",
	    	field: "id",
	    	title: "单据编号"
	    },
	    {
	      type: "relevance",
	      field: "agentId",
	      title: "代理商名称",
	      model: {
	        api: "/Agents",
	        field: "name"
	      }
	    },
	    {
	      type: "option",
	      title: "代理商属性",
	      field: "direct",
	      options: [
	        { title: "直属代理", value: true },
	        { title: "一般代理", value: false }
	      ]
	    },
	    {
	      type: "relevance",
	      field: "depotId",
	      title: "购买仓库",
	      model: {
	        api: "/Depots",
	        field: "name"
	      }
	    },
	    {
	    	type: "number",
	    	field: "total",
	    	title: "申请批次数"
	    },
	    {
	    	type: "number",
	    	field: "price",
	    	title: "合计金额"
	    }
    ];
    const searchRECEIVED = [
    	...searchOther,
	    {
	      type: "option",
	      title: "状态",
	      field: "status",
	      options: [
	        { title: "待发货", value: "WAIT_SHIPPING" },
	        { title: "已发货(待签收)", value: "SHIPPING" },
	        { title: "已完成", value: "RECEIVED" },
	      ]
	    },
	  ];
    
    return (
      <section className="PurchaseReview-page">
      	<TableExpand
          {...config}
          isTabs={true}
          defaultKey="PAY"
          onTabsClick={(key)=>{
      			this.setState({orderStatus:key,refreshTable:true});
          }}
          TabsData={[{key:"PAY",title:'未处理',data:{columns:tabsColumns,search:searchOther}},{key:"RECEIVED",title:'已完成',data:{columns:tabsColumns,search:searchRECEIVED}}
          ,{key:"REFUND",title:'已退款',data:{columns:tabsColumns,search:searchOther}}]}
				/>
        <Modal
          width="70%"
          height="80%"
          visible={this.state.visible}
          title="单据详情"
          okText="确定"
          cancelText="取消"
          onOk={() => {
            if(resultVal) {
              resultVal == 1 && agentOrderId && depotId && this.postAgentOrderPass(agentOrderId , {'depotId': depotId})
              resultVal == 2 && agentOrderId && this.props.form.getFieldValue('refuse') && this.postAgentOrderRefuse(agentOrderId , {'reason': this.props.form.getFieldValue('refuse')})
            }
            this.setState({ visible: false });
          }}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <div>
            {dataSourceDepot.element.map((b, i) => {
              return (
                <Row
                  type="flex"
                  justify="start"
                  key={i}
                >
                  {b.Rows.map((r, c) => {
                    return (
                      <Col span={r.cols} key={`col-${r.key}-${c}`}>
                        <span>{r.title}</span>
                      </Col>
                    )
                  })}
                </Row>
              )
            })}
          </div>
          <div style={{overflowY:"auto",maxHeight:"400px"}}>
            <Table
              dataSource={dataSourceDepot.data}
              columns={dataSourceDepot.columns}
            />
          </div>      
          <div>
            <Row gutter={24} style={{ margin: '10px -12px' }}>
              <Col sm={3}>订单金额：</Col>
              <Col sm={6}>{dataSourceDepot.data && this.getCount(dataSourceDepot.data, 'count', 'price')}</Col>
              <Col sm={3}>订单数量：</Col>
              <Col sm={6}>{dataSourceDepot.data && this.getCount(dataSourceDepot.data, 'count')}</Col>
            </Row>
            <Row gutter={24}>
              <Col sm={3}>处理结果：</Col>
              <Col sm={6}>
                <FormItem>
                  {getFieldDecorator(`select`, {
                    rules: [{
                      message: '必选项',
                    }],
                    initialValue : ''
                  })(
                    <Select
                      onChange={this.onSelChange}
                      placeholder="请选择"
                      style={{width:'100%'}}
                    >
                      <Option value="1">同意</Option>
                      <Option value="2">拒绝</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: resultVal && resultVal == 1 ? 'block' : 'none' }}>
              <Col sm={3}>选择发货仓库：</Col>
              <Col sm={6}>
                <FormItem>
                  {getFieldDecorator(`depotId`, {
                    rules: [{
                      message: '必选项',
                    }],
                    initialValue : ''
                  })(
                    <Select
                      onChange={this.onDepotChange}
                      placeholder="请选择"
                      style={{width:'100%'}}
                    >
                      {
                        outDepotData && outDepotData.map((v, i) => {
                          return <Option key={i} value={v.id}>{v.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} style={{ display: resultVal && resultVal == 2 ? 'block' : 'none' }}>
              <Col sm={3}>退款原因：</Col>
              <Col sm={6}>
                <FormItem>
                  {getFieldDecorator(`refuse`, {
                    rules: [{
                      message: '必选项',
                    }],
                    initialValue : ''
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Modal>
        <Modal
          width="70%"
          height="80%"
          visible={this.state.visible1}
          title="单据详情"
          okText="确定"
          cancelText="取消"
          onOk={() => {}}
          onCancel={() => {
            this.setState({ visible1: false });
          }}
        >
          <div>
            {dataSourceDepot.element.map((b, i) => {
              return (
                <Row
                  type="flex"
                  justify="start"
                  key={i}
                >
                  {b.Rows.map((r, c) => {
                    return (
                      <Col span={r.cols} key={`col-${r.key}-${c}`}>
                        <span>{r.title}</span>
                      </Col>
                    )
                  })}
                </Row>
              )
            })}
          </div>
          <div style={{overflowY:"auto",maxHeight:"400px"}}>
            <Table
              dataSource={dataSourceDepot.data}
              columns={dataSourceDepot.columns}
            />
          </div>
          <div>
            <Row gutter={24} style={{margin: '5px'}}>
              <Col sm={3}>订单金额：</Col>
              <Col sm={6}>{AgentOrderItemData && this.getCount(AgentOrderItemData.items, 'count', 'price')}</Col>
              <Col sm={3}>订单数量：</Col>
              <Col sm={6}>{AgentOrderItemData && this.getCount(AgentOrderItemData.items, 'count')}</Col>
            </Row>
            <Row gutter={24} style={{margin: '5px'}}>
              <Col sm={3}>物流：</Col>
              <Col sm={6}>顺丰</Col>
            </Row>
            <Row gutter={24} style={{margin: '5px'}}>
              <Col sm={3}>物流单号：</Col>
              <Col sm={6}>{this.props.form.getFieldValue('deliveryId')}</Col>
            </Row>
          </div>
        </Modal>

        <Modal
          title="物流信息"
          visible={this.state.visible2}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={700}
          okText="确定"
          cancelText="取消"
        >
          <div>
            <Row gutter={24}>
              <Col sm={3}>物流</Col>
              <Col sm={12}>
                <FormItem>
                  {getFieldDecorator(`deliveryCompany`, {
                    rules: [{
                      message: '必选项',
                    }],
                    initialValue : ''
                  })(
                    <Select
                      onChange={this.onDeliveryChange}
                      placeholder="请选择"
                      style={{width:'100%'}}
                    >
                      {
                        outDepotData && outDepotData.map((v, i) => {
                          return <Option key={i} value={v.name}>{v.name}</Option>
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={3}>物流单号:</Col>
              <Col sm={12}>
                <FormItem>
                  {getFieldDecorator(`deliveryId`, {
                    rules: [{
                      message: '必选项',
                    }],
                    initialValue : ''
                  })(
                    <Input type="number"/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Modal>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const PurchaseReviewForm = Form.create()(PurchaseReview)

const UUid = state => state.get("rts").get("uuid");
const getAgentOrderItem = state => state.get("rts").get("getAgentOrderItem");
const getDepot = state => state.get("rts").get("getDepot");
const postAgentOrderShipment = state => state.get("rts").get("postAgentOrderShipment");
const postAgentOrderPass = state => state.get("rts").get("postAgentOrderPass");
const postAgentOrderRefuse = state => state.get("rts").get("postAgentOrderRefuse");
const getAgentOrderPass = state => state.get("rts").get("getAgentOrderPass");

const postAgentOrderReceive = state => state.get("rts").get("postAgentOrderReceive");

const mapStateToProps = createStructuredSelector({
  UUid,
  getDepot,
  getAgentOrderItem,
  postAgentOrderShipment,
  postAgentOrderRefuse,
  getAgentOrderPass,
  postAgentOrderReceive
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseReviewForm);
