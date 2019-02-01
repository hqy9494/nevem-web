import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Modal } from "antd";
import moment from "moment";
import uuid from "uuid";

import TableExpand from "../../components/AsyncTable";
// import styles from "./Index.scss";
const receiptData = [
  {text:'采购入库',className:'statusPurpleOne'},
  {text:'采购退货',className:'statusRedTwo'},
  {text:'库存盘点',className:'statusBlueFour'},
  {text:'库存调拨',className:'statusGreenTree'},
  {text:'补货员提货',className:'statusBlueFive'},
  {text:'补货员退货',className:'statusYellowOne'},
  {text:'代理商购买',className:'statusGreenFour'},
  {text:'代理商退货',className:'statusRedOne'}
]

export class WarehouseRun extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentDidMount() {
   
  }
 	render() {
    const config = {
    	hasParams:{"id":this.props.params.id},
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/DepotJournals",
        include:["depot","batch"],
        where:{"depotId":this.props.params.id}
      },
      search: [
        {
          type: "field",
          field: "receiptNo",
          title: "单据编号"
        },
        {
          type: "relevance",
          field: "batchId",
          title: "批次名称",
          model: {
            api: "/Batches",
            field: "name"
          }
        },
        { 
          type: "number",
          title: "发生数量",
          field: "qty",
        },
        {
          type: "number",
          field: "afterQty",
          title: "剩余数量"
        },
        {
          type: "number",
          field: "price",
          title: "单价"
        },
        {
          type: "number",
          field: "totalPrice",
          title: "合计"
        },
        {
          type: "date",
          field: "createdAt",
          title: "创建时间"
        },
        {
          type: "option",
          title: "单据类型",
          field: "receiptType",
          options: [
            { title: "库存盘点", value: 3 },
            { title: "库存调拨", value: 4 },
            { title: "补货员提货", value: 5 },
            { title: "补货员退货", value: 6 },
            { title: "代理商购买", value: 7 },
            { title: "代理商退货", value: 8 }
          ]
        },
      ],
      element: [
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
          key: "depot",
        },
        {
          title: "批次名称",
          dataIndex: "batch.name",
          key: "batch",

        },
        {
          title: "发生数量",
          dataIndex: "qty",
          key: "qty",
          align:'right'
        },
        {
          title: "剩余数量",
          dataIndex: "afterQty",
          key: "afterQty",
          align:'right'
        },
        {
          title: "单价",
          dataIndex: "price",
          key: "price",
          align:'right'
        },
        {
          title: "合计",
          dataIndex: "totalPrice",
          key: "totalPrice",
          align:'right'
        },
        {
          title: "创建时间",
          key: "createdAt",
          dataIndex: "createdAt",
          type: "date"
        },
        {
          title: "单据类型",
          dataIndex: "receiptType",
          key: "receiptType",
          render: (text, record) => (
            <span
              className={receiptData[text-1].className}
            >
              {receiptData[text-1].text}
            </span>
          )
        }
      ],
      path: this.props.match.url,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      config:this.props.config,
	    title:this.props.title
    };
    return <section className="WarehouseRun-page">
      <TableExpand
        {...config}
      />
      <Modal
        width="70%"
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
          {config.element.map((b, i) => {
            return (
              <Row
                type="flex"
                justify="start"
                key={i}
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
            {...config}
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
const getDepotJournal = state => state.get("rts").get("getDepotJournal");

const mapStateToProps = createStructuredSelector({
  UUid,
  getDepotJournal
});

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseRun);
