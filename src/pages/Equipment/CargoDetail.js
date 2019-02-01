import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Col, Row, Icon, Card, Table, Button, Tabs, Modal} from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import HeaderNav from "../../components/HeaderNav";
import {browserHistory} from 'react-router';
const TabPane = Tabs.TabPane

export class CargoDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      visible1: false,
      terminalsByIdData: [],
      replenishmentsByIdData: [],
      panelText: ''
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    const {match} = this.props
    const id = match.params.id;
    if (id !== 'add' && id !== ':id') {
      localStorage.CargoId = id;
      localStorage.removeItem('CargoPanel');
    }
    this.setState({panelText: localStorage.CargoPanel || "1"});
    this.getTerminalsById(localStorage.CargoId);
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const {getTerminalsById, getReplenishmentsById} = nextProps

    if (getTerminalsById && getTerminalsById[this.uuid]) {
      this.setState({
        terminalsByIdData: getTerminalsById[this.uuid],
      })
    }

    if (getReplenishmentsById && getReplenishmentsById[this.uuid]) {
      this.setState({
        replenishmentsByIdData: getReplenishmentsById[this.uuid],
      })
    }
  }

  getTerminalsById = id => {
    this.props.rts({
      method: 'get',
      url: `/Terminals/${id}`,
    }, this.uuid, 'getTerminalsById')
  }
  handleOk = () => {
    this.setState({
      visible: false,
      visible1: false
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      visible1: false
    })
  }
  getReplenishmentsById = id => {
    this.props.rts({
      method: 'get',
      url: `/Replenishments/${id}`,
      params: {
        filter: {
          include: ""
        }
      },
    }, this.uuid, 'getReplenishmentsById')
  }

  render() {
    const {terminalsByIdData, replenishmentsByIdData} = this.state
    const [positionData = {}] = [terminalsByIdData.position];
    const [placeData = {}] = [positionData.place];
    const gridStyle = {
      width: '50%',
      textAlign: 'center',
    }
    const data = [
      {
        key: '1',
        name: '设备名称',
        title: `${terminalsByIdData.name || ''}`,
      }, {
        key: '2',
        name: '设备编号',
        title: `${terminalsByIdData.code || ''}`,
      },
      {
        key: '3',
        name: '场地',
        title: `${placeData.name || ''}`,
      },
      {
        key: '4',
        name: '点位',
        title: `${positionData.name || ''}`,
      }
    ]
    const columns = [
      {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'title',
        dataIndex: 'title',
        key: 'title',
      }
    ]

    const columns1 = [
      {
        title: "货道编号",
        key: "title",
        dataIndex: "title",
//      render: (text, record, index) => index + 1
      },
      {
        title: "商品图片",
        dataIndex: "product.imageUrl",
        key: "product.imageUrl",
        render: (text) => <img style={{width: '50px', height: '50px'}} src={text}/>
      },
      // {
      //   title: "商品名称",
      //   dataIndex: "product.name",
      //   key: "product.name",
      // },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: text => {
          if(text === 'normal') {
            return <span style={{ color: '#3cbce5' }}>正常</span>
          } else if(text === 'maintenance'){
            return <span style={{ color: '#ff9561' }}>维护中</span>
          } else {
            return <span>—</span>
          }
        }
      },
      // {
      //   title: "商品价格",
      //   dataIndex: "buyerNick",
      //   key: "buyerNick"
      // },
      {
        title: "容量",
        dataIndex: "capacity",
        key: "capacity",
        align: "right",
      },
      {
        title: "库存",
        dataIndex: "stock",
        key: "stock",
        align: "right",
      },
      {
        title: "操作",
        key: "handle",
        render: (text, record, index) => (
          // console.log(record,"record")
          <div>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                localStorage.titleName = terminalsByIdData.name ? terminalsByIdData.name : terminalsByIdData.code ? terminalsByIdData.code : terminalsByIdData.serial;
                localStorage.titleIndex = record.title
                this.props.to(`/Equipment/CargoFlow?id=${record.id}`)
              }}
            >货道流水</Button>
          </div>
        )
      }
      // {
      //   title: "货道类型",
      //   dataIndex: "createdAt",
      //   key: "createdAt",
      // },
      // {
      //   title: "售卖状态",
      //   dataIndex: "b",
      //   key: "b",
      // },
      // {
      //   title: "操作",
      //   key: "handle",
      //   render: (text, record) => (
      //     <div>
      //       <Button
      //         type="primary"
      //         size="small"
      //         onClick={() => {
      //           this.setState({
      //             visible: true
      //           })
      //         }}
      //       >二维码</Button>
      //     </div>
      //   )
      // }
    ]
    const config4 = {
			removeHeader:true,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Replenishments",
        include: "account",
        where: {"terminalId": localStorage.CargoId}
      },
      // buttons: [
      //   {
      //     title: "批量导出"
      //   }
      // ],
      search: [
        {
          type: "field",
          field: "receiptNo",
          title: "单据编号"
        },
        {
          type: "date",
          field: "createdAt",
          title: "补货时间"
        }
      ],
      columns: [
        {
          title: "单据编号",
          dataIndex: "receiptNo",
          key: "receiptNo"
        },
        {
          title: "补货时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "fromNow",
        },
        {
          title: "补货员",
          dataIndex: "account.username",
          key: "account"
        },
        {
          title: "补货数",
          dataIndex: "totalQty",
          key: "totalQty",
          align: "right",
        },
        {
          title: "原库存",
          dataIndex: "beforeQty",
          key: "beforeQty",
          align: "right",
          render: (text, record) => {
            return (
              <span>{record.beforeQty ? record.beforeQty : 0}</span>
            )
          }
        },
        {
          title: "补货后库存",
          dataIndex: "afterQty",
          key: "afterQty",
          align: "right",
          render: (text, record) => {
            return (
              <span>{record.afterQty ? record.afterQty : 0}</span>
            )
          }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <div>
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  this.setState({
                    visible1: true
                  }, () => {
                    this.getReplenishmentsById(record.id)
                  })
                }}
              >详情</Button>
            </div>
          )
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({refreshTable: false});
      }
    };
    const columnsModal = [
      {
        title: '货道',
        dataIndex: 'slotName',
        key: 'slotName',
      },
      // {
      //   title: '商品名称',
      //   dataIndex: 'product.name',
      //   key: 'product',
      // },
      {
        title: '补货数',
        dataIndex: 'qty',
        key: 'qty',
        align: "right",
      },
      {
        title: '原库存',
        dataIndex: 'beforeQty',
        key: 'beforeQty',
        align: "right",
        render: (text, record) => {
          return (
            <span>{record.beforeQty ? record.beforeQty : 0}</span>
          )
        }
      },
      {
        title: '补货后库存',
        dataIndex: 'afterQty',
        key: 'afterQty',
        align: "right",
        render: (text, record) => {
          return (
            <span>{record.afterQty ? record.afterQty : 0}</span>
          )
        }
      },
    ];
    return (
      <section className="CargoDetail-page">
      	<HeaderNav
      		className="myHeader"
      		config={this.props.config}
	    		title={terminalsByIdData.name ? terminalsByIdData.name : terminalsByIdData.code ? terminalsByIdData.code : terminalsByIdData.serial}
      	/>
        <div className="CargoDetail-top" style={{backgroundColor:"#fff",margin:"0 26px 0 36px",padding:0}}>
          <Row className="CargoDetail-row" type="flex" align="middle">
            <Col span={8} className="ta-c">
              <img src="assets/img/machine.jpg" style={{width: "30%"}}/>
            </Col>
            <Col span={8}>
              <Table showHeader={false} columns={columns} dataSource={data} bordered={true} pagination={false}/>
            </Col>
            <Col span={8}>
              <div className="CargoDetail-btn"><div style={{background:"#0e77ca",padding:"6px",color:"#fff"}}>货道总数{terminalsByIdData.slot || 0}个</div></div>
              <div className="CargoDetail-btn"><div style={{background:"#0e77ca",padding:"6px",color:"#fff"}}>总容量{terminalsByIdData.totalCapacity || 0}个</div>
              </div>
              <div className="CargoDetail-btn"><div style={{background:"#0e77ca",padding:"6px",color:"#fff"}}>总缺货数{terminalsByIdData.totalOutStock || 0}个</div>
              </div>
              <div className="CargoDetail-btn"><div style={{background:"#0e77ca",padding:"6px",color:"#fff"}}>库存{terminalsByIdData.totalStock || 0}个</div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="CargoDetail-bottom" style={{margin:"10px 26px 10px 19px",paddingTop:"10px"}}>
	        <div className="publicTitle">货道与补货记录</div>
          <Tabs type="card" style={{padding:'0 17px'}} defaultActiveKey={this.state.panelText} onChange={(panelText) => {
            this.setState({panelText});
            localStorage.CargoPanel = panelText
          }}>
            <TabPane tab={`货道(货道数:${terminalsByIdData.slot || '0'})`} key="1">
              {
                terminalsByIdData &&
                <Table
                	className="publicTable"
                  columns={columns1}
                  dataSource={terminalsByIdData.slots}
                  rowKey="id"
                  locale={{
                    emptyText: '暂无数据'
                  }}
                  bordered
                  pagination={false}/>
              }
            </TabPane>
            {
              // <TabPane tab="商品库存情况" key="2"  style={{padding: '20px'}}>
              //   <TableExpand
              //     {...config2}
              //     path={`${this.props.match.path}`}
              //     replace={this.props.replace}
              //     refresh={this.state.refreshTable}
              //     onRefreshEnd={() => {
              //       this.setState({refreshTable: false});
              //     }}
              //   />
              // </TabPane>
              // <TabPane tab="货到流水" key="3"  style={{padding: '20px'}}>
              //   <TableExpand
              //     {...config3}
              //     path={`${this.props.match.path}`}
              //     replace={this.props.replace}
              //     refresh={this.state.refreshTable}
              //     onRefreshEnd={() => {
              //       this.setState({refreshTable: false});
              //     }}
              //   />
              // </TabPane>
            }
            <TabPane tab="补货记录" key="4">
              <TableExpand
              	boxStyle={{padding:'0px'}}
                {...config4}
                removeStyle
              />
            </TabPane>
          </Tabs>
        </div>
        <Modal
          title="购买二维码"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>二维码</p>
        </Modal>
        <Modal
          title={
            <div>
            <p>{terminalsByIdData.name || ''} 补货详情</p>
            <p style={{margin:0,color:"#cccccc"}}>
              <span style={{marginRight:"10px",}}>补货后库存:{replenishmentsByIdData.afterQty || 0}</span>
              <span style={{marginRight:"10px",}}>原库存:{replenishmentsByIdData.beforeQty || 0}</span>
              <span style={{marginRight:"10px",}}>补货数:{replenishmentsByIdData.totalQty || 0}</span>
              <span style={{marginRight:"10px",}}>补货时间:{moment(replenishmentsByIdData.updatedAt).fromNow()}</span>
              </p>
          </div>
          }
          visible={this.state.visible1}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={700}
          okText="确定"
          cancelText="取消"
        >
          <Table
            style={{height: "500px", overflowY: "scroll"}}
            columns={columnsModal}
            dataSource={replenishmentsByIdData.items}
            bordered={true}
            pagination={false}
            rowKey="id"
            locale={{
              emptyText: '暂无数据'
            }}
          />
        </Modal>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getTerminalsById: state => state.get("rts").get("getTerminalsById"),
  getReplenishmentsById: state => state.get("rts").get("getReplenishmentsById"),
});

export default connect(mapStateToProps, mapDispatchToProps)(CargoDetail);
