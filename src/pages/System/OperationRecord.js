import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,  Divider, Popconfirm,Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand";
// import styles from "./Index.scss";

export class OperationRecord extends React.Component {
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
        data: "/accounts",
      },
      search: [

      ],
      columns: [
        {
          title: "操作人",
          dataIndex: "fullname",
          key: "fullname"
        },
        {
          title: "IP",
          dataIndex: "mobile",
          key: "mobile"
        },
        {
          title: "操作平台",
          dataIndex: "id",
          key: "id"
        },
        {
          title: "操作时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "操作类型",
          dataIndex: "stockout",
          key: "stockout",
          render: text => {
            if (text) {
              return "启用";
            } else {
              return "禁用";
            }
          }
        },
        {
          title: "操作对象",
          dataIndex: "username",
          key: "username"
        },
        {
          title: "操作内容",
          dataIndex: "password",
          key: "password"
        },
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refresh,
      onRefreshEnd: () => {
        this.setState({ refresh: false });
      }
    };

    return (
      <section className="OperationRecord-page">
      	<div className="project-title">操作记录列表</div>
        <TableExpand
          {...config}
          path={`${this.props.match.path}`}
          replace={this.props.replace}
          refresh={this.state.refreshTable}
          onRefreshEnd={() => {
            this.setState({refreshTable: false});
          }}
        />
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationRecord);
