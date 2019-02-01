import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";

export class EquipmentStatus extends React.Component {
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
        data: "/Terminals",
        include:["position"],
        where:{
          agent: true
        }
        // total: "/Orders/count"
      },
      // buttons: [
      //   {
      //     title: "批量导出"
      //   }
      // ],
      search: [
      	{
          title: "设备名称",
          type: "field",
          field: "name"
       	},
      	{
          title: "在线名称",
          type: "field",
          field: "id"
       },
       {
          title: "储备箱库存",
          type: "field",
          field: "address"
       }
      ],
      columns: [
        {
          title: "设备名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "在线名称",
          dataIndex: "id",
          key: "id"
        },
        {
          title: "储备箱库存",
          dataIndex: "address",
          key: "address"
        },
        {
          title: "操作",
          render: (text, record) => (
            <span>
              <Button
                className="buttonListFirst"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`/Equipment/StockAdjustment/add`);
                }}
              >
                库存调整列表
              </Button>
            </span>
          )
        },
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
      <section className="EquipmentStatus-page">
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

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentStatus);
