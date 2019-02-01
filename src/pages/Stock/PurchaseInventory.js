import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Modal, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand";

export class PurchaseInventory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const element = [
        {
          Rows: [
            {
              cols: 2,
              title: '地址:',
              key: "2"
            },
            {
              cols: 6,
              title: '山西茂业天地',
              key: "2"
            },
            {
              cols: 2,
              title: '电话:',
              key: "2"
            },
            {
              cols: 6,
              title: '4009939138:',
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
        },
        {
          Rows: [
            {
              cols: 2,
              title: '地址:',
              key: "2"
            },
            {
              cols: 6,
              title: '山西茂业天地',
              key: "2"
            },
            {
              cols: 2,
              title: '电话:',
              key: "2"
            },
            {
              cols: 6,
              title: '4009939138:',
              key: "2"
            },
            {
              cols: 2,
              title: '单号:',
              key: "2"
            },
            {
              cols: 6,
              title: 'CG18051409511886278',
              key: "2"
            }
          ]
        },
        {
          Rows: [
            {
              cols: 2,
              title: '地址:',
              key: "2"
            },
            {
              cols: 6,
              title: '山西茂业天地',
              key: "2"
            },
            {
              cols: 2,
              title: '电话:',
              key: "2"
            },
            {
              cols: 6,
              title: '4009939138:',
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
        },
        {
          Rows: [
            {
              cols: 2,
              title: '2',
              key: "2"
            }
          ]
        }
      ];
    const config1 = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Orders",
        total: "/Orders/count"
      },
      buttons: [
        {
          title: "批量导出"
        }
      ],
      columns: [
        {
          title: "商品条码",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "商品名称",
          dataIndex: "buyerNick",
          key: "buyerNick",
        },
        {
          title: "规格",
          dataIndex: "productName",
          key: "productName",
        },
        {
          title: "件数量",
          dataIndex: "orderTotalPrice1",
          key: "orderTotalPrice1",

        },
        {
          title: "零数量",
          dataIndex: "receiverName",
          key: "receiverName",
        },
        {
          title: "整件单件",
          dataIndex: "receiverName",
          key: "receiverName",
        },
        {
          title: "零数单件",
          dataIndex: "createdAt1",
          key: "createdAt1",
          type: "date",
        },
        {
          title: "金额",
          dataIndex: "buyerNick",
          key: "buyerNick",
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Orders",
        total: "/Orders/count"
      },
      buttons: [
        {
          title: "搜索"
        }
      ],
      search: [
        {
          type: "field",
          field: "id",
          title: "订单编号"
        },
        {
          type: "option",
          title: "订单状态",
          field: "orderStatus",
          options: [
            { title: "未付款", value: "WAIT_PAY" },
            { title: "已付款(待发货)", value: "WAIT_SHIPPING" },
            { title: "已发货", value: "SHIPPING" },
            { title: "已签收", value: "RECEIVED" },
            { title: "已完成", value: "SUCCESS" },
            { title: "已关闭", value: "CLOSED" },
            { title: "退款中", value: "STATE_REFUNDING" }
          ]
        },
        {
          type: "date",
          field: "createdAt",
          title: "交易时间"
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
          dataIndex: "productName",
          key: "productName",
        },
        {
          title: "操作员",
          dataIndex: "buyerNick",
          key: "buyerNick",
        },
        {
          title: "创建时间",
          dataIndex: "createAt",
          key: "createAt",
          type: "date",
          sort: true
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <Button
              type="primary"
              onClick={() => {
                this.setState({
                  visible: true
                });
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
      <div style={{marginBottom: "10px",}}>
        <Button 
          type="primary" 
          icon="edit"
          onClick={() => {
            this.props.to(`${this.props.match.path}/${1}`);
          }}
        >
          新建
        </Button>
      </div>
      <TableExpand
        {...config}
        path={`${this.props.match.path}`}
        replace={this.props.replace}
        refresh={this.state.refreshTable}
        onRefreshEnd={() => {
          this.setState({refreshTable: false});
        }}
      />
      <Modal
        width="50%"
        height="80%"
        visible={this.state.visible}
        title="单据详情"
        okText="确定"
        cancelText="取消"
        style={{display:"block"}}
        onOk={() => {
          // console.log(123)
        }}
        onCancel={() => {
          this.setState({ visible: false });
        }}
      >
        <div>
          {element.map((b, i) => {
            return (
              <Row
                type="flex"
                justify="start"
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
          <TableExpand
            {...config1}
            path={`${this.props.match.path}`}
            style={{display:"block",width:"100%",height:"inherit"}}
            replace={this.props.replace}
            refresh={this.state.refreshTable}
            onRefreshEnd={() => {
              this.setState({refreshTable: false});
            }}
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

const mapStateToProps = createStructuredSelector({
  UUid
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseInventory);



