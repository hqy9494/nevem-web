import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { ButtonGroup, ButtonToolbar} from "react-bootstrap";
import { Button, Col, Row, Icon, Modal, Input, Card, Form, DatePicker, Radio, Select, Cascader, Table} from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
// import styles from "./Index.scss";

export class WarehousePurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }
  componentDidMount() {
    this.getAccount()
  }

  componentWillReceiveProps(nextProps) {
    const { getPurchase, getAgentOrderItem, getAccount } = nextProps
    if (getPurchase && getPurchase[this.uuid]) {
      this.setState({
        purchaseData: getPurchase[this.uuid].data,
        purchaseTotal: getPurchase[this.uuid].total
      })
    }
    if (getAgentOrderItem && getAgentOrderItem[this.uuid]) {
      this.setState({
        AgentOrderItemData: getAgentOrderItem[this.uuid]
      })
    }
    if (getAccount && getAccount[this.uuid]) {
      this.setState({
        meData: getAccount[this.uuid]
      })
    }
    
  }
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

  getStatus = (status) => {
    const data = {
      "WAIT_PAY": "未付款",
      "PAY": "已付款(待审核)",
      "WAIT_SHIPPING": "待发货",
      "SHIPPING": "已发货(待签收)",
      "RECEIVED": "已签收",
      "REFUND":"已退款"
    }
    return status in data ? data[status] : ''
  }
  postAgentOrderReceive = id => {
    this.props.rts({
      method: 'post',
      url: `/AgentOrders/${id}/receive`
    }, this.uuid, 'postAgentOrderReceive', () => {
      this.setState({
        refreshTable: true
      })
    })
  }
  getAccount = () => {
    this.props.rts({
      method: 'get',
      url: `/accounts/me`
    }, this.uuid, 'getAccount')
  }
  getAgentOrderItem = id => {
    this.props.rts({
      method: 'get',
      url: `/AgentOrders/${id}`
    }, this.uuid, 'getAgentOrderItem', () => {
      this.setState({
        refreshTable: true
      })
    })
  }

  getAddress = (province, city, district, address) => province + city + district + address

  render() {
    const { getFieldDecorator } = this.props.form
    const { AgentOrderItemData, meData } = this.state
    const config1 = {
      data: AgentOrderItemData && AgentOrderItemData.items.map((v,i) => {
        return {
          ...v,
          key: i
        }
      }),
      columns: [
        {
          title: "批次编号",
          dataIndex: "batchId",
          key: "batchId",
        },
        {
          title: "数量",
          dataIndex: "count",
          key: "count",
        },
        {
          title: "单价",
          dataIndex: "price",
          key: "price",
        },
        {
          title: "总价",
          dataIndex: "totalPrice",
          render: (text, record) => <span>￥ {(Math.floor(record.price*record.count * 100) / 100 )}</span>
        }
      ],
      element : [
        {
          Rows: [
            {
              cols: 2,
              title: '购买仓库:',
              key: "2"
            },
            {
              cols: 6,
              title: AgentOrderItemData && AgentOrderItemData.depot ? AgentOrderItemData.depot.name : '',
              key: "2"
            },
            {
              cols: 2,
              title: '仓库地址:',
              key: "2"
            },
            {
              cols: 6,
              title: AgentOrderItemData && AgentOrderItemData.depot 
                    ? this.getAddress(AgentOrderItemData.depot.province, AgentOrderItemData.depot.city, AgentOrderItemData.depot.district, AgentOrderItemData.depot.address)
                    : '',
              key: "2"
            },
            {
              cols: 2,
              title: '订单状态',
              key: "2"
            },
            {
              cols: 6,
              title: AgentOrderItemData && this.getStatus(AgentOrderItemData.status),
              key: "2"
            }
          ]
        },
        {
          Rows: [
            {
              cols: 2,
              title: '单号:',
              key: "2"
            },
            {
              cols: 6,
              title: AgentOrderItemData && AgentOrderItemData.id,
              key: "2"
            },
            {
              cols: 2,
              title: '物流:',
              key: "2"
            },
            {
              cols: 6,
              title: AgentOrderItemData && AgentOrderItemData.deliveryCompany,
              key: "2"
            },
            {
              cols: 2,
              title: '物流单号:',
              key: "2"
            },
            {
              cols: 6,
              title: AgentOrderItemData && AgentOrderItemData.deliveryId,
              key: "2"
            }
          ]
        }
      ]
    };
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/AgentOrders",
        include: 'depot',
        where: {
          agent: true,
        }
      },
      search: [
        {
          type: "field",
          field: "id",
          title: "单据编号"
        },
        {
          type: "number",
          field: "total",
          title: "申请批次数"
        },
        {
          type: "number",
          field: "price",
          title: "单价"
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
          type: "option",
          title: "订单状态",
          field: "status",
          options: [
            { title: "未付款", value: "WAIT_PAY" },
            { title: "已付款(待审核)", value: "PAY" },
            { title: "待发货", value: "WAIT_SHIPPING" },
            { title: "已发货(待签收)", value: "SHIPPING" },
            { title: "已完成", value: "RECEIVED" },
            { title: "已退款", value: "REFUND" }
          ]
        }
      ],
      buttons: [
        {
          title: "新建",
          onClick: (data) => {
            if(data.length > 0) {
              this.props.to(`${this.props.match.path}/${data[0].agentId}`)
            }else {
              meData && meData.agentId && this.props.to(`${this.props.match.path}/${meData.agentId}`)
            }
          }
        }
      ],
      columns: [
        {
          title: "单据编号",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "购买仓库",
          dataIndex: "depot.name",
          key: "depot",
        },
        {
          title: "申请批次数",
          dataIndex: "total",
          key: "total",
          align:'right',
          sort:true
        },
        {
          title: "单价",
          dataIndex: "price",
          key: "price",
          align:'right',
          sort: true
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
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.setState({visible: true})
                  this.getAgentOrderItem(record.id)
                }}
              >
                详情
              </Button>
              <Button
                style={{display: record.status == 'SHIPPING' ? 'inlineBlock' : 'none'}}
                size="small"
                className="buttonListSecond"
                onClick={() => {
                  this.postAgentOrderReceive(record.id)
                }}
              >确认收货</Button>
            </div>
          )
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      config:this.props.config,
	    title:this.props.title
    };
    return <section className="WarehousePurchase-page">
      <TableExpand
        {...config}
      />
      <Modal
        width="70%"
        height="80%"
        visible={this.state.visible}
        title="单据详情"
        footer={null}
        onCancel={() => {
          this.setState({ visible: false });
        }}
      >
        <div>
          {config1.element.map((b, i) => {
            return (
              <Row
                type="flex"
                justify="start"
                key={i}
                style={{margin: '10px 0px'}}
              >
                {b.Rows.map((r, c) => {
                  return (
                    <Col
                      span={r.cols}
                      key={`col-${r.key}-${c}`}
                    >
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
            columns={config1.columns}
            dataSource={config1.data}
            bordered
          />
        </div>
        <div>
          <Row 
            gutter={24}
            type="flex"
            justify="start"
            style={{margin: '10px 0px'}}
          >
            <Col sm={6}>
              <span>订单金额： {AgentOrderItemData && this.getCount(AgentOrderItemData.items, 'count', 'price')}</span>
            </Col>
            <Col sm={6}>
              <span>订单数量： {AgentOrderItemData && this.getCount(AgentOrderItemData.items, 'count')}</span>
            </Col>
          </Row>
        </div>
      </Modal>
    </section>
  }
}


const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const getAgentOrderItem = state => state.get("rts").get("getAgentOrderItem");
const getAccount = state => state.get("rts").get("getAccount");
const postAgentOrderReceive = state => state.get("rts").get("postAgentOrderReceive");

const mapStateToProps = createStructuredSelector({
  UUid,
  getAgentOrderItem,
  getAccount,
  postAgentOrderReceive
});

const WarehousePurchaseForm = Form.create()(WarehousePurchase);
export default connect(mapStateToProps, mapDispatchToProps)(WarehousePurchaseForm);
