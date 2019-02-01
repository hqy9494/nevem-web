import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button  } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";

export class StockReplenish extends React.Component {

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
        data: "/Terminals/stock",
      },
      search: [
        {
          type: "field",
          field: "name",
          title: "设备名称"
        },
        {
          type: "field",
          field: "code",
          title: "设备编号"
        },
        {
          type: "relevance",
          field: "positionId",
          title: "点位名称",
          model: {
            api: "/Positions",
            field: "name"
          }
        },
        {
          type: "unrelevance",
          field: "place",
          title: "设备场地",
          fieldName:'positionId',
          model: {
            api: "/Positions",
            field:"placeId",
            child:{
          		api: "/Places",
            	field: "name"
            },
          }
        },
        {
          type: "unrelevance",
          field: "opAccount",
          title: "申请补货员",
          fieldName:'positionId',
          model: {
            api: "/Positions",
            field:"opAccountId",
            child:{
          		api: "/accounts",
            	field: "fullname"
            },
          }
        },
        /*{
          type: "number",
          field: "slotTotalStock",
          title: "在售数量"
        },
        {
          type: "number",
          field: "depotTotalStock",
          title: "储备箱数量"
        },*/
      ],
      columns: [
        {
          title: "设备名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "设备编号",
          dataIndex: "code",
          key: "code",
        },
        {
          title: "场地",
          dataIndex: "position.place.name",
          key: "address",
        },
        {
          title: "点位名称",
          dataIndex: "position.name",
          key: "position",

        },
        {
          title: "补货员",
          dataIndex: "position.opAccount.fullname",
          key: "opAccount",
        },
        {
          title: "在售数量",
          dataIndex: "slotTotalStock",
          key: "slotTotalStock",
          align:'right'
        },
        {
          title: "储备箱数量",
          dataIndex: "depotTotalStock",
          key: "depotTotalStock",
          align:'right'
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
                  this.props.to(`${this.props.match.path}/detail?id=${record.id}&status=${record.status}`);
                }}
              >
                补货列表
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
    <section className="StockReplenish-page">
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

export default connect(mapStateToProps, mapDispatchToProps)(StockReplenish);



