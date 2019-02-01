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
        include:["position", "agent"],
        where: {
          agent: true
        },
        // include:["position"],
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
          title: "设备编号",
          type: "field",
          field: "code"
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
	        type: "relevance",
	        field: "agentId",
	        title: "代理商名称",
	        model: {
	          api: "/Agents",
	          field: "name"
	        }
      	},
      	{
          type: "optionRelevance",
          title: "代理商属性",
          field: "directId",
          fieldName: "agentId",
          options: [
            { title: "直属", value: true },
            { title: "一般", value: false }
          ],
          model: {
            api: "/Agents",
            field: "direct"
          }
        },
     	],
      columns: [
        {
          title: "设备名称",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (text ? <span>{text}</span> : <span>--</span>)
        },
        // {
        //   title: "属性",
        //   dataIndex: "agent.direct",
        //   key: "agent.direct",
        //   render: (text, record, index) => record.agent && (record.agent.direct ? <span>直营</span> : <span>代理</span>)
        // },
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
        {
          title: "代理商名称",
          dataIndex: "agent.name",
          key: "agent.name",
        },
        {
          title: "代理商属性",
          dataIndex: "agent.direct",
          key: "agent.direct",
          render: (text, record) => {
            return (
              text ? <span style={{color: "#8ddc57"}}>直属</span> : <span style={{color: "#1aaceb"}}>一般</span>
            )
          }
        },
        // {
        //   title: "网络状态",
        //   dataIndex: "buyerNick",
        //   key: "buyerNick"
        // },
        // {
        //   title: "温度",
        //   dataIndex: "receiverName",
        //   key: "receiverName"
        // },
        {
          title: "设备编号",
          dataIndex: "code",
          key: "code",
          render: (text, record) => (text ? <span>{text}</span> : <span>--</span>)
        },
        {
          title: "在线状态",
          dataIndex: "online",
          key: "online",
          render: (text, record) => {
            if (text) {
              return <span className="statusBlueTree">在线</span>;
            } else {
              return <span className="statusGreyOne">离线</span>;
            }
          }
        }
        // {
        //   title: "硬币器",
        //   dataIndex: "createdAt",
        //   key: "createdAt",
        // },
        // {
        //   title: "纸币器",
        //   dataIndex: "b",
        //   key: "b",
        // },
        // {
        //   title: "操作",
        //   key: "handle",
        //   render: (text, record) => (
        //     <div>
        //       <Button type="primary" size="small">查看屏幕</Button>
        //     </div>
        //   )
        // }
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
