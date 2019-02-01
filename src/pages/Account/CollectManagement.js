import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Transfer, Modal, Popconfirm, message, Card, Table,Form,Input } from "antd";
import { Panel } from 'react-bootstrap';
import moment from "moment";
import uuid from "uuid";
// import TableExpand from "../../components/TempTable"
import AsyncTable from "../../components/AsyncTable"
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item

export class CollectManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentData: {},
      dataSourceRows: [],
      dataSourceKeys: [],
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {
    const { match } = this.props
    const id = match.params.id

    if (id) {
      this.getPayment(id)
      this.getPositions(id)
    }
  }
  componentWillReceiveProps(nextProps) {
    const { getPayment, getPositions } = nextProps

    if (getPayment && getPayment[this.uuid]) {
      this.setState({
        paymentData: getPayment[this.uuid]
      })
    }
  }

  getPayment = id => {
    id && 
    this.props.rts({
      url: `/Payments/${id}`,
      method: 'get',
      params: {
        filter: {
          where: {
            agent: true,
          },
        }
      }
    }, this.uuid, 'getPayment', (v) => {
      if(v) this.setState({ optionType: v.type })
    })
  }

  getPositions = id => {
    id && 
    this.props.rts({
      url: `/Positions`,
      method: 'get',
      params: {
        filter: {
          where: {
            paymentId: id,
            agent: true,
          },
          include: ["agent","place","terminal"]
        }
      }
    }, this.uuid, 'getPositions', (v) => {
      this.setState({
        dataSourceRows: v.data,
        selectedRowKeys: v.data.length ? v.data.map(v => v.id) : []
      })
    })
  }

  postPaymentBind = (id, params) => {
    id && 
    this.props.rts({
      method: 'post',
      url: `/Payments/${id}/bind`,
      data: {
        ids: params
      }
    }, this.uuid, 'postPaymentBind', () => {
        message.success('保存成功', 1, () => {
          this.props.goBack()
      })
    })
  }

  postPaymentRelieve = (id, params, callback) => {
    id && 
    this.props.rts({
      method: 'post',
      url: `/Payments/${id}/relieve`,
      data: {
        ids: params
      }
    }, this.uuid, 'postPaymentRelieve', () => {
       callback()
    })
  }

  onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  handleUnique = (data = [], name) => {
    let hash = {};
    return data.reduce((item, next) => {
      hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
      return item;
    }, []);
  }

  changeDevice = (data = [], keys = [] ,name) => {
    if(!this.isInArray(data, name)) {
      this.handleData(data, keys)
    } else {
      this.setState({ showVisible: true })
    }
    
  }

  handleSubmit = (data = []) => {
    const { match } = this.props
    const id = match.params.id
    if (id) this.postPaymentBind(id, data)
  }

  isInArray = (data = [], keys) => {
    return data.findIndex(item => item[keys]) > -1
  }

  handleDelete = (key, data) => {
    const { match } = this.props
    const id = match.params.id

    const newData = [...this.state.dataSourceRows]
    const newKeys = [...this.state.dataSourceKeys]
    
    if(data.paymentId) {
      this.postPaymentRelieve(id, [data.id], () => {
        this.setState({ 
          dataSourceRows: newData.filter(item => item.id !== key),
          dataSourceKeys: newKeys.filter(item => item !== key)
        })
      })
    } else {
      this.setState({ 
        dataSourceRows: newData.filter(item => item.id !== key),
        dataSourceKeys: newKeys.filter(item => item !== key)
      })
    }
  }

  handleData = (data, keys) => {
    const newData = [...this.state.dataSourceRows, ...data]
    const newKeys = [...this.state.dataSourceKeys, ...keys]

    this.setState({ 
      dataSourceRows: this.handleUnique(newData, 'id'),
      dataSourceKeys: Array.from(new Set(newKeys)),
      showVisible: false,
      visible: false,
    })

  }

  onSelection = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }


  render() {
    const { paymentData, selectedRowKeys, selectedRows, dataSourceRows, dataSourceKeys } = this.state
		const { getFieldDecorator } = this.props.form
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
        data: "/Positions",
        areaPath:"/tools/getAreaData",
        include:["agent","place","terminal","payment"],
        where: {
          agent: true,
        }
      },
      search: [
        {
          type: "relevance",
          field: "terminalId",
          title: "设备编号",
          model: {
            api: "/Terminals",
            field: "code",
          }
        },
        {
          type: "field",
          field: "name",
          title: "点位名称",
        },
        {
          type: "relevance",
          field: "placeId",
          title: "场地名称",
          model: {
            api: "/Places",
            field: "name",
            
          }
        },
        {
          type: "relevance",
          field: "agentName",
          title: "代理商名称",
          fieldName:'agentId',
          add:{
            agent: false
          },
          model: {
            fieldName:'id',
            api: "/Agents",
            field: "name",
          }
        },
        {
          type: "areaRelevance",
          field: "areaName",
          title: "场地地址",
          fieldName:'placeId',
          model: {
            fieldName:'id',
            api: "/Places",
            field: ["province","city","district"],
          }
        },
        {
          type: "optionRelevance",
          title: "代理商属性",
          field: "direct",
          fieldName: "agentId",
          add:{agent:false},
          options: [
            { title: "直营", value: true },
            { title: "一般", value: false }
          ],
          model: {
            api: "/Agents",
            field: "direct",
            typeProps:["data"],
          }
        },
      ],
      columns: [
        {
          title: "设备编号",
          dataIndex: "code",
          key: "code",
          render: (text, record) => {
            if(record && record.terminal) {
              return <span>{ record.terminal.code }</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "场地地址",
          dataIndex: "place.province",
          key: "place.province",
          render: (text, record) => {
            if(record && record.place) {
              return <span>{ `${record.place.province ? record.place.province: '' }${record.place.city ? record.place.city: ''}${record.place.district ? record.place.district:'' }`}</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "场地名称",
          dataIndex: "place.name",
          key: "place.name",
          align:'right',
          render: (text, record) => {
            if(record && record.place) {
              return <span>{ record.place.name }</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "点位名称",
          dataIndex: "name",
          key: "name",
          align:'right',
        },
        {
          title: "代理商名称",
          dataIndex: "agent.name",
          key: "agent.name",
          render: (text, record) => {
            if(record && record.agent) {
              return <span>{ record.agent.name }</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "代理商属性",
          dataIndex: "agent.direct",
          key: "agent.direct",
          align:'right',
          width:150,
          render: (text, record) => {
            if(record && record.agent) {
              return record.agent.direct ? <span>直营</span> : <span>一般</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "现绑定账号",
          dataIndex: "payment.name",
          key: "payment.name",
          align:'right',
          width:150,
          render: (text, record) => {
            if(record && record.payment) {
              return <span>{ record.payment.name }</span>
            }
            return <span>无</span>
          }
        }
      ],
      path: this.props.match.url,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      removeHeader:true
    }

    const columns = [
      {
          title: "设备编号",
          dataIndex: "code",
          key: "code",
          render: (text, record) => {
            if(record && record.terminal) {
              return <span>{ record.terminal.code }</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "场地地址",
          dataIndex: "place.province",
          key: "place.province",
          render: (text, record) => {
            if(record && record.place) {
              return <span>{ `${record.place.province}${record.place.city}${record.place.district}`}</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "场地名称",
          dataIndex: "place.name",
          key: "place.name",
          align:'right',
          render: (text, record) => {
            if(record && record.place) {
              return <span>{ record.place.name }</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "点位名称",
          dataIndex: "name",
          key: "name",
          align:'right',
        },
        {
          title: "代理商名称",
          dataIndex: "agent.name",
          key: "agent.name",
          render: (text, record) => {
            if(record && record.agent) {
              return <span>{ record.agent.name }</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "代理商属性",
          dataIndex: "agent.direct",
          key: "agent.direct",
          align:'right',
          width:150,
          render: (text, record) => {
            if(record && record.agent) {
              return record.agent.direct ? <span>直营</span> : <span>一般</span>
            }
            return <span>--</span>
          }
        },
        {
          title: '操作',
          dataIndex: 'handle',
          render: (text, record) => {
            return (
              dataSourceRows.length > 0
              ? (
                <Popconfirm
                  title={ record.paymentId ? `确定解绑？` : `确定删除?`}
                  onConfirm={() => this.handleDelete(record.id, record)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="danger" size="small">{record.paymentId ? `解绑`: `删除`}</Button>
                </Popconfirm>
              ) : null
            )
          }
        }
      ];

    const child = (
      <Panel>
        <div className="project-title">收款账号信息</div>
          <Row gutter={24} style={{ padding: '10px'}}>
          	<Col span={24}>
          		<FormItem label={`收款账号名称`}>
	              {getFieldDecorator(`name`, {
	                initialValue: paymentData && paymentData.name || ''
	              })(
	                <Input disabled={true} style={{width:400}}/>
	              )}
	            </FormItem>
            </Col>
            <Col span={24}>
          		<FormItem label={`收款账号`}>
	              {getFieldDecorator(`user`, {
	                initialValue: paymentData && paymentData.caiBaoConfig && paymentData.caiBaoConfig.account || ''
	              })(
	                <Input disabled={true} style={{width:400,marginLeft:'27px'}}/>
	              )}
	            </FormItem>
            </Col>
          </Row>
        <div className="project-title">策略内容</div>
        <Button onClick={() => {this.setState({ visible: true })}} style={{margin:'10px 12px 30px 12px'}}>增加</Button>
          <Row gutter={24}>
            <Col sm={24}>
              {
                <Table
                	className="publicTable"
                  rowKey="id"
                  columns={columns}
                  onRow={(record) => ({
                    onChange: () => {
                      this.selectRow(record);
                    },
                  })}
                  dataSource={dataSourceRows ? dataSourceRows : []}
                  locale={{
                    filterTitle: '筛选',
                    filterConfirm: '确定',
                    filterReset: '重置',
                    emptyText: '暂无数据'
                  }}
                  bordered
                />
              }
            </Col>
          </Row>
          {/*<div className="ta-c mt-20">
            <Button style={{ marginRight: 8 }} onClick={() => {
              this.props.goBack()
            }}>
              返回
            </Button>
            <Button type="primary" onClick={() => { this.handleSubmit(dataSourceKeys) }}>保存</Button>
          </div>*/}
        <Modal
          width="80%"
          height="80%"
          visible={this.state.visible}
          title="选择设备"
          okText="确定"
          cancelText="取消"
          onOk={() => {
            this.changeDevice(selectedRows, selectedRowKeys, 'paymentId')
          }}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
        >
          <AsyncTable
            {...config}
            removeHeader
            getArea
            rowSelection={rowSelection}
          />
        </Modal>
        <Modal
          width="20%"
          height="40%"
          visible={this.state.showVisible && this.isInArray(selectedRows, 'paymentId')}
          title="警惕"
          okText="仍要绑定"
          cancelText="取消"
          onOk={() => { this.handleData(selectedRows, selectedRowKeys) }}
          onCancel={() => {
            this.setState({
              showVisible: false,
            });
          }}
        >
          <h5>您现在绑定的设备已经有绑定的支付账号重新绑定将会覆盖，请谨慎选择。</h5>
        </Modal>
      </Panel>
    )
    return (
      <section className="EquipmentInfoDetail-page">
	      <DetailTemplate
	      	config = {this.props.config}
	      	title = {paymentData && paymentData.name || this.props.title}
	      	child={child}
	      	onCancle={this.props.goBack}
	      	onOk={() => { this.handleSubmit(dataSourceKeys) }}
	      />
        
	  </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getPayment: state => state.get("rts").get("getPayment"),
  getPositions: state => state.get("rts").get("getPositions"),
});
const CollectManagementForm = Form.create()(CollectManagement)
export default connect(mapStateToProps, mapDispatchToProps)(CollectManagementForm);
