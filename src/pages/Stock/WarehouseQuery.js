import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand";

export class WarehouseQuery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
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
          field: "createdAt1",
          title: "仓库"
        },
        {
          type: "field",
          field: "buyerNick",
          title: "一级分类"
        },
        {
          type: "field",
          field: "productName",
          title: "二级分类"
        },
        {
          type: "field",
          field: "orderTotalPrice1",
          title: "商品名称"
        },
        {
          type: "field",
          field: "receiverName",
          title: "商品名码"
        }
      ],
      columns: [
        {
          title: "仓库",
          dataIndex: "createdAt1",
          key: "createdAt1",
          type: "date",
          sort: true
        },
        {
          title: "一级分类",
          dataIndex: "buyerNick",
          key: "buyerNick",
        },
        {
          title: "二级分类",
          dataIndex: "productName",
          key: "productName",
        },
        {
          title: "商品名称",
          dataIndex: "orderTotalPrice1",
          key: "orderTotalPrice1",

        },
        {
          title: "商品名码",
          dataIndex: "receiverName",
          key: "receiverName"
        },
        {
          title: "数量",
          dataIndex: "receiverName",
          key: "receiverName",
          sort: true
        },
        {
          title: "平均进价",
          dataIndex: "receiverName",
          key: "receiverName",
          sort: true
        },
        {
          title: "近7天销售数",
          dataIndex: "receiverName",
          key: "receiverName"
        },
        {
          title: "库存预报",
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
    return <section className="WarehouseQuery-page">
      <TableExpand
        {...config}
        path={`${this.props.match.path}`}
        replace={this.props.replace}
        refresh={this.state.refreshTable}
        onRefreshEnd={() => {
          this.setState({refreshTable: false});
        }}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseQuery);



