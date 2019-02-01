import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button, Modal, Table } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
// import styles from "./Index.scss";

export class WarehouseTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouseDetailsData : null
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    const { getwarehouseDetails } = nextProps
    if (getwarehouseDetails && getwarehouseDetails[this.uuid]) {
      this.setState({
        warehouseDetailsData: getwarehouseDetails[this.uuid]
      })
    }
  }
  getwarehouseDetails = (id) => {
    this.props.rts({
      method: 'get',
      url: `/DepotTransfers/${id}`,
      include: ["opAccount","inDepot","outDepot"]
    }, this.uuid, 'getwarehouseDetails', () => {
      this.setState({
        refreshTable: true
      })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/DepotTransfers",
        include: ["opAccount","inDepot","outDepot"]
      },
      search: [
        {
          type: "field",
          field: "receiptNo",
          title: "单据编号"
        }
      ],
      buttons: [
        {
          title: "新建",
          onClick: () => {
          	this.props.to(`${this.props.match.path}/${1}`)
          }
        }
      ],
      columns: [
        {
          title: "单据编号",
          dataIndex: 'receiptNo',
          key: 'receiptNo'
        },
        {
          title: "调出仓库",
          dataIndex: "outDepot.name",
          key: "outDepot",
        },
        {
          title: "调入仓库",
          dataIndex: "inDepot.name",
          key: "inDepot",
        },
        {
          title: "操作员",
          dataIndex: "opAccount.username",
          key: "opAccount",

        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "操作",
          key: "handle",
          render: (record) => (
            <span>
              <Button
              	className="buttonListFirst"
              	size="small"
              	onClick={() => {
                  this.getwarehouseDetails(record.id)
                  this.setState({
                    visible: true,
                  });
                }}
              >
               	 详情
              </Button>
            </span>
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
    const config1 = {
      data: this.state.warehouseDetailsData && this.state.warehouseDetailsData.items.map((v,i) => {
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
          title: "批次名称",
          dataIndex: "batch.name",
          key: "batch",
        },
        {
          title: "数量",
          dataIndex: "qty",
          key: "qty",
        }
      ],
      
      element : [
        {
          Rows: [
            {
              cols: 2,
              title: '业务日期',
              key: "2"
            },
            {
              cols: 6,
              title: this.state.warehouseDetailsData && this.state.warehouseDetailsData.createdAt,
              key: "2"
            },
            {
              cols: 2,
              title: '单号:',
              key: "2"
            },
            {
              cols: 6,
              title: this.state.warehouseDetailsData && this.state.warehouseDetailsData.receiptNo,
              key: "2"
            },
            {
              cols: 2,
              title: '类别:',
              key: "2"
            },
            {
              cols: 6,
              title: '库存调拨',
              key: "2"
            }
          ]
        },
        {
          Rows: [
            {
              cols: 2,
              title: '调出仓库:',
              key: "2"
            },
            {
              cols: 6,
              title: this.state.warehouseDetailsData && this.state.warehouseDetailsData.outDepot.name,
              key: "2"
            },{
              cols: 2,
              title: '调入仓库:',
              key: "2"
            },
            {
              cols: 6,
              title: this.state.warehouseDetailsData && this.state.warehouseDetailsData.inDepot.name,
              key: "2"
            },
            {
              cols: 2,
              title: '制单人:',
              key: "2"
            },
            {
              cols: 6,
              title: this.state.warehouseDetailsData && this.state.warehouseDetailsData.opAccount.username,
              key: "2"
            }
          ]
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };
    return <section className="WarehouseTransfer-page">
      <TableExpand
        {...config}
      />
      <Modal
        width="70%"
        height="auto"
        visible={this.state.visible}
        title="库存调拨单"
        footer = {null}
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
                key={`row-${i}`}
                style={{margin: 5}}
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

const getwarehouseDetails = state => state.get("rts").get("getwarehouseDetails");

const mapStateToProps = createStructuredSelector({
  UUid,
  getwarehouseDetails,
});

const WarehouseTransferForm = Form.create()(WarehouseTransfer);

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseTransferForm);
