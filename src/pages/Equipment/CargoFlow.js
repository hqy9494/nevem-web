import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";

export class CargoFlow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const config = {
      hasParams: {"id":this.props.params.id},
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/SlotRecords",
        where: {
          slotId: this.props.params.id
        },
      },
      search: [
        {
          type: "option",
          title: "类型",
          field: "type",
          options: [
            { title: "补货", value: 1 },
            { title: "出货", value: 2 }
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
          title: "交易时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "fromNow",
          sort: true
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          render: (record, text, index) => {
             {
              switch(text.type) {
                case 1:
                  return <span style={{ color: '#3cbce5' }}>补货</span>
                case 2:
                  return <span style={{ color: '#3bd7b6' }}>出货</span>
                default:
                  return;
              }
            }
          }
        },
        {
          title: "数量",
          dataIndex: "productNum",
          key: "productNum",
          align:"right",
          render: (record, text, index) => <span>{Number(text.afterQty) > Number(text.beforeQty) ? text.afterQty - text.beforeQty : text.beforeQty - text.afterQty }</span>
        },
        {
          title: "原数量",
          dataIndex: "beforeQty",
          key: "beforeQty",
          align:"right"
        },
        {
          title: "交易后数量",
          dataIndex: "afterQty",
          key: "afterQty",
          align: "right",

        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      config:this.props.config,
	    title:`${localStorage.titleName}-第${localStorage.titleIndex}号`
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

export default connect(mapStateToProps, mapDispatchToProps)(CargoFlow);
