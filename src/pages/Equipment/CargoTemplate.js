import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";

export class CargoTemplate extends React.Component {
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
        data: "/SlotTemplates"
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to(`/Equipment/CargoTemplate/add`)
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "模板名称"
        },
        /*{
          type: "option",
          title: "模板状态",
          field: "active",
          options: [
            { title: "正常", value: true },
            { title: "异常", value: false }
          ]
        }*/
      ],
      columns: [
        {
          title: "模板名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "模板状态",
          dataIndex: "active",
          key: "active",
          render: text => text ? <span className="statusBlueTree">正常</span> : <span className="statusRedOne">异常</span>
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
                  this.props.to(`/Equipment/CargoTemplate/${text.id}`)
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

export default connect(mapStateToProps, mapDispatchToProps)(CargoTemplate);
