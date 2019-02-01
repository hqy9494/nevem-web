import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Input, Modal, Button, Select, Option } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand";

export class OrderPay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type : 'return'
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
          title: "商品",
          dataIndex: "createdAt1",
          key: "createdAt1",
          type: "date",
          sort: true
        },
        {
          title: "规格",
          dataIndex: "buyerNick",
          key: "buyerNick",
        },
        {
          title: "单价",
          dataIndex: "productName",
          key: "productName",
        },
        {
          title: "单品总数",
          key: "orderTotalPrice1",
          render: (text, record) => (
            <span>
              <Input/>
            </span>
          )
        },
        {
          title: "总价",
          dataIndex: "receiverName",
          key: "receiverName"
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };
    return <section className="OrderPay-page">
      <TableExpand
        {...config}
        path={`${this.props.match.path}`}
        replace={this.props.replace}
        refresh={this.state.refreshTable}
        onRefreshEnd={() => {
          this.setState({refreshTable: false});
        }}
      />
      <div className="ta-c mt-20">
        <Button style={{ marginRight: 8 }} onClick={() => {
          this.props.goBack()
        }}>
          返回
        </Button>
        <Button
          type="primary"
          onClick={()=>{
            this.setState({
              visible: true
            })
          }}
        >保存</Button>
      </div>
      <Modal
        width="50%"
        height="80%"
        visible={this.state.visible}
        title="单据详情"
        okText="确定"
        cancelText="取消"
        style={{display:"block"}}
        onOk={() => {
          //console.log(123)
        }}
        onCancel={() => {
          this.setState({ visible: false });
        }}
      >
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderPay);



