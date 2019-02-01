import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";

export class EquipmentFailure extends React.Component {
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
        data: "/SlotFaults",
        include: ["agent"],
        where:{
          agent: true
        }
      },
      search: [
      	{
          type: "relevance",
          field: "terminalId",
          title: "设备名称",
          model: {
            api: "/Terminals",
            field: "name"
          }
        },
        /*{
           title: "故障货道",
           type: "field",
           field: "serialPort"
        },
        {
          type: "relevance",
          field: "serialPort",
          title: "故障货道",
          model: {
            api: "/Slots",
            field: "title"
          }
        },*/
       {
          title: "故障场景",
          type: "option",
          field: "scene",
          options: [
            { title: "客户购买", value: '客户购买' },
            { title: "货道检测", value: '货道检测' }
          ]
       },
       {
           title: "设备序列号",
           type: "field",
           field: "terminalSerial"
        },
       {
          type: "option",
          title: "故障状态",
          field: "status",
          options: [
            { title: "待修复", value: 'created' },
            { title: "已修复", value: 'finish' }
          ]
        },
        {
          type: "relevance",
          field: "positionId",
          title: "设备点位",
          fieldName:'terminalId',
          model: {
          	fieldName:'terminalId',
            api: "/Positions",
            field: "name",
          }
        },
        /*{
          type: "unrelevance",
          field: "opAccount",
          title: "补货员",
          fieldName:'terminalId',
          model: {
            api: "/Positions",
            field:"opAccountId",
            fieldName:'terminalId',
            child:{
          		api: "/accounts",
            	field: "fullname",
            },
          }
        },*/
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
          type: "option",
          title: "故障原因",
          field: "reason",
          isValueArray:true,
          options: [
            { title: "没有串口", value: 'NO_SERIAL_PORT' },
            { title: "系统繁忙", value: 'BUSY' },
            { title: "系统超时", value: 'TIMEOUT' },
            { title: "设备断电", value: 'NO_ELECTRIC' },
            { title: "设备卡位", value: 'KAWEI' },
            { title: "设备无响应", value: 'BOARD_NO_RESPONSE' }
          ]
        },
        {
          type: "date",
          field: "createdAt",
          title: "故障时间"
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
	        dataIndex: "terminal.name",
          key: "terminal.name",
          render: (text, record) => (text ? <span>{text}</span> : <span>--</span>)
	      },
	      {
	        title: "设备序列号",
	        dataIndex: "terminalSerial",
          key: "terminalSerial",
          render: (text, record) => (text ? <span>{text}</span> : <span>--</span>)
	      },
	      {
	        title: "设备点位",
	        dataIndex: "position.name",
	        key: "position.name"
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
	      {
	        title: "故障场景",
	        dataIndex: "scene",
	        key: "scene",
	      },
	      {
	        title: "故障货道",
	        dataIndex: "slot.title",
	        key: "slot.title",
	        render:(text, record, index) => {
	          return text ? <span>{text}</span> : <span> { record.slot && record.slot.serialPort ? record.slot.serialPort : ''} </span>
	        }
          
	      },
        {
          title: "故障原因",
          dataIndex: "reason",
          key: "reason",
          render:(text, record, index) => {
            if(text) {
              switch(text[0]) {
                case 'NO_SERIAL_PORT':
                  return <span className="statusPurpleOne">没有串口</span>
                case 'BUSY':
                  return <span className="statusRedTwo">系统繁忙</span>
                case 'TIMEOUT':
                  return <span className="statusRedOne">系统超时</span>
                case 'NO_ELECTRIC':
                  return <span className="statusYellowTwo">设备断电</span>
                case 'KAWEI':
                  return <span className="statusRedTree">设备卡位</span>
                case 'BOARD_NO_RESPONSE':
                  return <span className="statusYellowOne">设备无响应</span>
                default:
              }
            }
          }
        },
        {
          title: "补货员",
          dataIndex: "position.opAccount.username",
          key: "position.opAccount.username"
        },
        {
          title: "故障时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        /*
        {
          title: "电话",
          dataIndex: "position.opAccount.mobile",
          key: "position.opAccount.mobile"
        },
        */
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          render: (text, record) => {
            if (text === 'created') {
              return <span className="statusBlueTree">待修复</span>;
            } else if (text === 'finish'){
              return <span className="statusGreyOne">已修复</span>;
            }
          }
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
      <section className="EquipmentFailure-page">
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

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentFailure);
