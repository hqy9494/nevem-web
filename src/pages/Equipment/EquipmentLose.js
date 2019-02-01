import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";

export class EquipmentLose extends React.Component {
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
        include: ["position"],
        where: {
          outStockPercent: {
            gt: 50
          },
          agent: true
        }
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
          type: "number",
          field: "totalOutStock",
          title: "缺货数量"
        },
        {
          type: "unrelevance",
          field: "opAccount",
          title: "补货员",
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
          type: "field",
          field: "address",
          title: "设备地址"
        },*/
       /* {
          type: "number",
          field: "outStockPercent",
          title: "缺货率"
        },*/
      ],
      columns: [
        {
          title: "设备名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "设备编号",
          dataIndex: "code",
          key: "code"
        },
        {
          title: "设备场地",
          dataIndex: "position.place.name",
          key: "position.place.name",
        },
        {
          title: "设备地址",
          key: "position",
          render: (text) => {
            if (text && text.position && text.position.place) {
              return `${text.position.place.province}${text.position.place.city}${text.position.place.district}${text.position.place.name}`
            }
          }
        },
        {
          title: "缺货率",
          dataIndex: "outStockPercent",
          key: "outStockPercent",
          render: text => `${Number(text).toFixed(2)}%`
        },
        // {
        //   title: "断货量",
        //   dataIndex: "receiverMobile",
        //   key: "receiverMobile"
        // },
        {
          title: "补货员 ",
          dataIndex: "position.opAccount.fullname",
          key: "position.opAccount.fullname",
        },
        {
          title: "缺货数量",
          dataIndex: "totalOutStock",
          key: "totalOutStock",
          align:'right'
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
              >详情</Button>
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
      <section className="EquipmentLose-page">
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

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentLose);
