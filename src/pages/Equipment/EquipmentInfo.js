import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";

export class EquipmentInfo extends React.Component {
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
        where: {
          agent: true
        },
        // include: ["place", "priceRule", "opAccount"]
      },
      // buttons: [
      //   {
      //     title: "批量导出"
      //   }
      // ],
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
          title: "设备点位",
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
      ],
      columns: [
        {
          title: "设备名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "设备场地",
          key: "placeName",
          render: (text, record) => (
          <span>
            {record.position && record.position.place && record.position.place.name}
          </span>
          )
        },
        {
          title: "设备点位",
          dataIndex: "position.name",
          key: "position.name",
        },
        
        // {
        //   title: "虚拟货架策略",
        //   dataIndex: "receiverName",
        //   key: "receiverName"
        // },
        // {
        //   title: "自动退款策略",
        //   dataIndex: "receiverMobile",
        //   key: "receiverMobile"
        // },
        // {
        //   title: "故障策略",
        //   dataIndex: "createdAt",
        //   key: "createdAt",
        // },
        // {
        //   title: "库存缺货阀值",
        //   dataIndex: "b",
        //   key: "b",
        // },
        // {
        //   title: "库存断货阀值",
        //   dataIndex: "c",
        //   key: "c",
        // },
        {
          title: "设备编号",
          dataIndex: "code",
          key: "code"
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <div>
              <Button
                className="buttonListFirst"
                size="small"
                onClick={() => {
                  this.props.to(`${this.props.match.path}/${text.id}`)
                }}
              >运营配置</Button>
            </div>
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
      <section className="EquipmentInfo-page">
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

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentInfo);
