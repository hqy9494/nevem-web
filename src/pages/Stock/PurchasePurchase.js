import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Modal, Button,Table } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand";

export class PurchasePurchase extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type: 'in',
      purchaseId: '',
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  
  componentDidMount() {
    // this.getPurchase()
  }
  componentWillReceiveProps(nextProps) {
    const { getPurchase, getPurchaseDetails } = nextProps
    if (getPurchase && getPurchase[this.uuid]) {
      this.setState({
        purchaseData: getPurchase[this.uuid].data,
        purchaseTotal: getPurchase[this.uuid].total
      })
    }
    if (getPurchaseDetails && getPurchaseDetails[this.uuid]) {
      this.setState({
        purchaseDetailsData: getPurchaseDetails[this.uuid]
      })
    }
  }
  
  setTree = (depotData = []) => {
    let data = []
    depotData.forEach(v => {
      if (v) data.push({
        id: v.id,
        name: v.name,
        province: v.province,
        city: v.city,
        district: v.district,
        address: v.address,
        phone: v.phone,
        remarks: v.remarks,
        chargeId: v.chargeId
      })
    })  
    return data
  }
  setAccount = (accountData = []) => {
    let data = []
    accountData.forEach(v => {
      if (v) data.push({
        id: v.id,
        username: v.username
      })
    })  
    return data
  }
  getPurchase = () => {
    this.props.rts({
      method: 'get',
      url: '/Purchases',
    }, this.uuid, 'getPurchase')
  }
  getPurchaseDetails = (id) => {
    this.props.rts({
      method: 'get',
      url: `/Purchases/${id}`,
      params: {
        filter: {
          include: 'opAccount'
        }
      }
    }, this.uuid, 'getPurchaseDetails', () => {
      this.setState({
        refreshTable: true
      })
    })
  }
  getProduct = () => {
    this.props.rts({
      method: 'get',
      url: '/Products',
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
    })
  }
  handleEdit = (id,e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)){
          if (!values[i]) continue
          params[i] = values[i]
        }
        this.putPurchase(id,params)
      }
    })
    this.setState({
      visible: false
    })
  }
  getTurnTime = (time) => { 
    let date = new Date(time);
    return date;
  }

  handleNewCreate = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)){
          if (!values[i]) continue
          params[i] = values[i]
        }
        this.postPurchase(params)
      }
    })
    this.setState({
      newVisible: false,
    })
  }
  handleSelectChange = (value) => {
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  }

  render() {
    const { purchaseDetailsData } = this.state;
    const config1 = {
      data: purchaseDetailsData && purchaseDetailsData.items.map((v,i) => {
        return {
          ...v,
          key: i
        }
      }),
      columns: [
        {
          title: "商品条码",
          dataIndex: "barcode",
          key: "barcode",
        },
        {
          title: "商品名称",
          dataIndex: "product.name",
          key: "product",
        },
        {
          title: "整件单件",
          dataIndex: "qty",
          key: "qty",
        },
        {
          title: "零售单价",
          dataIndex: "price",
          key: "price",
        },
        {
          title: "金额",
          dataIndex: "totalPrice",
          key: "totalPrice",
        }
      ],
      element : [
        {
          Rows: [
            {
              cols: 2,
              title: '地址:',
              key: "2"
            },
            {
              cols: 6,
              title: purchaseDetailsData && `${purchaseDetailsData.depot.province}${purchaseDetailsData.depot.city}${purchaseDetailsData.depot.district}${purchaseDetailsData.depot.address}`,
              key: "2"
            },
            {
              cols: 2,
              title: '电话:',
              key: "2"
            },
            {
              cols: 6,
              title: purchaseDetailsData && purchaseDetailsData.depot.phone,
              key: "2"
            },
            {
              cols: 2,
              title: '业务日期',
              key: "2"
            },
            {
              cols: 6,
              title: purchaseDetailsData && moment(purchaseDetailsData.bizTime).format("YYYY-MM-DD HH:mm"),
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
              title: purchaseDetailsData && purchaseDetailsData.receiptNo,
              key: "2"
            },
            {
              cols: 2,
              title: '类别:',
              key: "2"
            },
            {
              cols: 6,
              title: purchaseDetailsData && purchaseDetailsData.type == 'in' ? '采购入库' : '采购出库',
              key: "2"
            },
            {
              cols: 2,
              title: '仓库:',
              key: "2"
            },
            {
              cols: 6,
              title: purchaseDetailsData && purchaseDetailsData.depot.name,
              key: "2"
            }
          ]
        },
        {
          Rows: [
            {
              cols: 2,
              title: '制单人:',
              key: "2"
            },
            {
              cols: 6,
              title: purchaseDetailsData && purchaseDetailsData.opAccount.username,
              key: "2"
            },
            {
              cols: 2,
              title: '备注:',
              key: "2"
            },
            {
              cols: 6,
              title: purchaseDetailsData && purchaseDetailsData.remarks,
              key: "2"
            },
            {
              cols: 2,
              title: '',
              key: "2"
            },
            {
              cols: 6,
              title: '',
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
        data: "/Purchases",
        include: ["depot","opAccount"],
        where: {
          type: this.state.type
        }
      },
      search: [
        {
          type: "field",
          field: "receiptNo",
          title: "单据编号"
        },
        {
          type: "option",
          title: "订单状态",
          field: "status",
          options: [
            { title: "有效", value: "valid" },
            { title: "无效", value: -1 }
          ]
        },
        {
          type: "date",
          field: "updatedAt",
          title: "交易时间"
        },
        {
          type: "date",
          field: "bizTime",
          title: "进货时间"
        }
      ],

      columns: [
        {
          title: "单据编号",
          dataIndex: "receiptNo",
          key: "receiptNo",
        },
        {
          title: "仓库",
          dataIndex: "depot.name",
          key: "depotId",
        },
        {
          title: "总价",
          dataIndex: "totalPrice",
          key: "totalPrice",

        },
        {
          title: "总数量",
          dataIndex: "totalProductQty",
          key: "totalProductQty",
        },
        {
          title: "品种数量",
          dataIndex: "totalSpecQty",
          key: "totalSpecQty",
        },
        {
          title: "进货时间",
          dataIndex: "bizTime",
          key: "bizTime",
          type: "date",
          sort: true
        },
        {
          title: "操作员",
          dataIndex: "opAccount.username",
          key: "opAccountId",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          render: (text) => {
            return text === 'valid' ? 
              <span style={{backgroundColor: '#337AB7',color: '#fff',padding: '5px'}}>有效</span> : 
              <span style={{backgroundColor: '#337877',color: '#fff',padding: '5px'}}>无效</span>
          }
        },
        {
          title: "创建时间",
          dataIndex: "updatedAt",
          key: "updatedAt",
          type: "date",
          sort: true
        },
        {
          title: "操作",
          key: "handle",
          render: (record) => (
            <Button
              type="primary"
              onClick={() => {
                this.setState({
                  visible: true,
                  purchaseId: record.id
                });
                this.getPurchaseDetails(record.id)
              }}
            >
              详情
            </Button>
          )
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };
    return <section>
      <div className="project-title">进货列表</div>
      <div style={{marginBottom: "10px"}}>
        <Button 
          type="primary" 
          icon="edit"
          onClick={() => {
            this.props.to(`${this.props.match.path}/${1}`);
          }}
        >
          添加
        </Button>
      </div>
      <TableExpand
        {...config}
        path={`${this.props.match.path}`}
        style={{display:"block",width:"100%",height:"inherit"}}
        replace={this.props.replace}
        refresh={this.state.refreshTable}
        onRefreshEnd={() => {
          this.setState({refreshTable: false});
        }}
      />
      <Modal
        width="70%"
        height="80%"
        visible={this.state.visible}
        title="采购入库单"
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
                style={{margin: '5px 0px'}}
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
      </Modal>
    </section>;
  }
}
const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const getPurchase = state => state.get("rts").get("getPurchase")
const getPurchaseDetails = state => state.get("rts").get("getPurchaseDetails")

const mapStateToProps = createStructuredSelector({
  UUid,
  getPurchase,
  getPurchaseDetails
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchasePurchase);



