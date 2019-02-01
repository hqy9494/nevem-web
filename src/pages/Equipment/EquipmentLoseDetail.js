import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Col, Row, Icon, Card, Table, Button, Progress} from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import HeaderNav from "../../components/HeaderNav";

// import styles from "./Index.scss";

export class EquipmentLoseDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      terminalsByIdData: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }

  componentDidMount() {
    const {match} = this.props
    const {id} = match.params

    this.getTerminalsById(id)
  }

  componentWillReceiveProps(nextProps) {
    const {getTerminalsById} = nextProps

    if (getTerminalsById && getTerminalsById[this.uuid]) {
      this.setState({
        terminalsByIdData: getTerminalsById[this.uuid],
      })
    }
  }

  getTerminalsById = id => {
    this.props.rts({
      method: 'get',
      url: `/Terminals/${id}`
    }, this.uuid, 'getTerminalsById')
  }

  render() {
    const {terminalsByIdData} = this.state
    const place = terminalsByIdData.place
    const data = [
      {
        key: '1',
        name: '设备名称',
        title: `${terminalsByIdData.name || ''}`,
      },
      {
        key: '2',
        name: '设备编号',
        title: `${terminalsByIdData.code || ''}`,
      },
      {
        key: '3',
        name: '序列号',
        title: `${terminalsByIdData.serial || ''}`,
      },
      {
        key: '4',
        name: '厂家',
        title: `${terminalsByIdData.factoryName || ''}`,
      },
      {
        key: '5',
        name: '型号',
        title: `${terminalsByIdData.model || ''}`,
      },
      {
        key: '6',
        name: '场地',
        title: `${place && place.province || ''}${place && place.city || ''}${place && place.district || ''}${place && place.name || ''}`,
      },
      {
        key: '7',
        name: '地址',
        title: `${terminalsByIdData.address || ''}`,
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
    // const data1 = [
    //   {
    //     key: '1',
    //     name: '04',
    //     title: '缺货量',
    //     show: '中正天街1号机'
    //   },
    //   {
    //     key: '2',
    //     name: '04',
    //     title: '缺货量',
    //     show: '中正天街1号机'
    //   },
    //   {
    //     key: '3',
    //     name: '04',
    //     title: '缺货量',
    //     show: '中正天街1号机'
    //   },
    // ]
    // const columns1 = [
    //   {
    //     title: 'name',
    //     dataIndex: 'name',
    //     key: 'name',
    //   },
    //   {
    //     title: 'title',
    //     dataIndex: 'title',
    //     key: 'title',
    //   },
    //   {
    //     title: 'show',
    //     dataIndex: 'show',
    //     key: 'show',
    //     render: () => (
    //       <Progress percent={30} />
    //     )
    //   }
    // ]
    const columns1 = [
      {
        title: "商品图片",
        dataIndex: "product.imageUrl",
        key: "product.imageUrl",
        render: (text) => <img src={text} style={{height: '50px', width: '50px'}}/>
      },
      {
        title: "商品名称",
        dataIndex: "product.name",
        key: "product"
      },
      {
        title: "货道",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "容量",
        dataIndex: "capacity",
        key: "capacity",
      },
      {
        title: "库存",
        dataIndex: "stock",
        key: "stock",
      },
      {
        title: "缺货率",
        key: "c",
        render: text => `${100 - text.stock / text.capacity * 100}%`
      },
      {
        title: "缺货数量",
        key: "d",
        render: text => (text.capacity - text.stock)
      }
    ]
    // const config = {
    //   api: {
    //     rts: this.props.rts,
    //     uuid: this.uuid,
    //     data: "/Orders",
    //     total: "/Orders/count"
    //   },
    //   // buttons: [
    //   //   {
    //   //     title: "批量导出"
    //   //   }
    //   // ],
    //   search: [
    //     {
    //       type: "field",
    //       field: "id",
    //       title: "订单编号"
    //     },
    //     {
    //       type: "option",
    //       title: "订单状态",
    //       field: "orderStatus",
    //       options: [
    //         { title: "未付款", value: "WAIT_PAY" },
    //         { title: "已付款(待发货)", value: "WAIT_SHIPPING" },
    //         { title: "已发货", value: "SHIPPING" },
    //         { title: "已签收", value: "RECEIVED" },
    //         { title: "已完成", value: "SUCCESS" },
    //         { title: "已关闭", value: "CLOSED" },
    //         { title: "退款中", value: "STATE_REFUNDING" }
    //       ]
    //     },
    //     {
    //       type: "date",
    //       field: "createdAt",
    //       title: "交易时间"
    //     }
    //   ],
    //   columns: [
    //     {
    //       title: "商品图片",
    //       dataIndex: "id",
    //       key: "id"
    //     },
    //     {
    //       title: "商品名称",
    //       dataIndex: "productName",
    //       key: "productName"
    //     },
    //     {
    //       title: "货道",
    //       dataIndex: "productPrice",
    //       key: "productPrice",
    //     },
    //     {
    //       title: "容量",
    //       dataIndex: "a",
    //       key: "a",
    //     },
    //     {
    //       title: "库存",
    //       dataIndex: "b",
    //       key: "b",
    //     },
    //     {
    //       title: "缺货率",
    //       dataIndex: "c",
    //       key: "c",
    //     },
    //     {
    //       title: "缺货数量",
    //       dataIndex: "d",
    //       key: "d",
    //     }
    //   ],
    //   path: this.props.match.path,
    //   replace: this.props.replace,
    //   refresh: this.state.refreshTable,
    //   onRefreshEnd: () => {
    //     this.setState({ refreshTable: false });
    //   }
    // };
    return (
      <section className="EquipmentLoseDetail-page">
        <HeaderNav
      		className="myHeader"
      		config={this.props.config}
	    		title={terminalsByIdData.name ? terminalsByIdData.name : terminalsByIdData.code ? terminalsByIdData.code : terminalsByIdData.serial}
      	/>
        <div className="CargoDetail-top EquipmentLoseDetail-top" style={{background:"#fff",paddingTop:"10px"}}>
          <Row className="CargoDetail-row" gutter={8}>
            <Col span={24} className="ta-c h-100per">
              <Row>
                <Col xs={{span: 4, offset: 3}}><img src="assets/img/machine.jpg" style={{width: "100%"}}/></Col>
                <Col xs={{span: 14, offset: 3}}>
                  <Table showHeader={false} columns={columns} dataSource={data} bordered={true} pagination={false}
                         size="small"/>
                  <Row className="mt-20" gutter={8}>
                    <Col span={8}>
                      <div className="EquipmentLoseDetail-top-item">缺货率：{terminalsByIdData.outStockPercent || ''}%</div>
                    </Col>
                    <Col span={8}>
                      <div className="EquipmentLoseDetail-top-item">缺货数量：{terminalsByIdData.totalOutStock || ''}</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            {
              // <Col span={12} className="h-100per">
              //   <Card title="缺货商品占比" className="h-100per">
              //     <Table
              //       showHeader={false}
              //       columns={columns1}
              //       dataSource={data1}
              //       pagination={false}
              //       size="small"
              //     />
              //   </Card>
              // </Col>
            }
          </Row>
        </div>
        <div style={{background: '#fff', padding: '20px'}}>
	        <div className="project-title mt-20">商品列表</div>
          <Table columns={columns1} dataSource={terminalsByIdData.slots} rowKey="id" locale={{emptyText:'暂无数据'}} className="publicTable"/>
        </div>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getTerminalsById: state => state.get("rts").get("getTerminalsById")
});

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentLoseDetail);
