import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col, } from "react-bootstrap";
import { Button } from "antd"
import TableExpand from "../../components/TableExpand";

export class RoleList extends React.Component {
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
        data: "/accounts/roles",
      },
      getAll: true,
      columns: [
        {
          title: "角色",
          dataIndex: "name",
          key: "name",
          // render: (text, record) => {
          //   console.log(text);
          //   // switch (text) {
          //   //   case "WAIT_PAY":
          //   //     return "未付款";
          //   //   case "WAIT_SHIPPING":
          //   //     return "已付款(待发货)";
          //   //   case "SHIPPING":
          //   //     return "已发货";
          //   //   case "RECEIVED":
          //   //     return "已签收";
          //   //   case "SUCCESS":
          //   //     return "已完成";
          //   //   case "CLOSED":
          //   //     return "已关闭";
          //   //   case "STATE_REFUNDING":
          //   //     return "退款中";
          //   //   default:
          //   //     break;
          //   // }
          // }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
               <Button
                 type="primary"
                 size="small"
                 style={{marginRight: '5px'}}
                 onClick={() => {
                   this.props.to(`${this.props.match.path}/detail/${record.id}`);
                 }}
               >
                编辑
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
      }
    };

    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <TableExpand {...config} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const RoleListuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  RoleListuuid
});

export default connect(mapStateToProps, mapDispatchToProps)(RoleList);
