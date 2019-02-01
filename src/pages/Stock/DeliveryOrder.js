import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button  } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";

export class DeliveryOrder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type : 'pick'
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/DepotPickups",
        include: ['depot','account','opAccount'],
        where: {
          type : this.state.type,
        }
      },
      search: [
        {
          type: "field",
          field: "receiptNo",
          title: "单据编号"
        },
        {
          type: "number",
          field: "totalSpecQty",
          title: "批次品类数量"
        },
        {
          type: "number",
          field: "totalProductQty",
          title: "申请批次总数量"
        },
        {
          type: "number",
          field: "totalProductRealQty",
          title: "实际批次总数量"
        },
        {
          type: "option",
          title: "订单状态",
          field: "status",
          options: [
            { title: "已拒绝", value: -1 },
            { title: "等待审核", value: 0 },
            { title: "待确认收货", value: 1 },
            { title: "提货成功", value: 2 }
          ]
        },
        {
          type: "date",
          field: "createdAt",
          title: "创建时间",
          sort: true
        },
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
          title: "补货员",
          dataIndex: "account.username",
          key: "account",
        },
        {
          title: "操作员",
          dataIndex: "opAccount.username",
          key: "opAccount"
        },
        {
          title: "批次品类数量",
          dataIndex: "totalSpecQty",
          key: "totalSpecQty",
					align:'right'
        },
        {
          title: "申请批次总数量",
          dataIndex: "totalProductQty",
          key: "totalProductQty",
          align:'right'
        },
        {
          title: "实际批次总数量",
          dataIndex: "totalProductRealQty",
          key: "totalProductRealQty",
          align:'right',
          sort: true
        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          render: text => {
            if (text == -1) {
              return <span className="statusRedOne">已拒绝</span>
            } else if(text == 0) {
              return <span className="statusBlueTree">等待审核</span>
            } else if(text == 1) {
              return <span className="statusGreenFour">待确认收货</span>
            } else if(text == 2) {
              return <span className="statusGreyOne">提货成功</span>
            } else {
              return <span style={{padding: '5px', color: '#fff'}}></span>
            }
          }
        },
       	{
          title: "操作",
          key: "handle",
          render: (record) => (
            <span>
              <Button
                className="buttonListFirst"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`${this.props.match.path}/detail/id=${record.id}&status=${record.status}`);
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
    return (
    <section className="DeliveryOrder-page">
      <TableExpand
        {...config}
      />
    </section>
  )
  }
}
const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryOrder);



