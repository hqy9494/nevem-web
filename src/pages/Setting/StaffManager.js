import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import TableExpand from "../../components/TableExpand";

export class StaffManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  getStaff = () => {
    this.props.rts(
      {
        method: "get",
        url: `/accounts/staffs`
      },
      this.uuid,
      "staff"
    );
  };

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/accounts/staffs"
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to(`${this.props.match.path}/add`);
          }
        }
      ],
      search: {},
      columns: [
        {
          title: "用户名",
          dataIndex: "username",
          key: "username"
        },
        {
          title: "角色",
          dataIndex: "roles",
          key: "roles",
          render: (text = [], record) => (
            <span>{text.map(t => t.description).join(",")}</span>
          )
        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "fromNow"
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <a
                href="javascript:;"
                onClick={() => {
                  this.props.to(
                    `${this.props.match.path}/detail/${record.id}?name=${encodeURIComponent(record.name)}`
                  );
                }}
              >
                编辑
              </a>
            </span>
          )
        }
      ]
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

const StaffManageruuid = state => state.get("rts").get("uuid");
const staff = state => state.get("rts").get("staff");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  staff
});

export default connect(mapStateToProps, mapDispatchToProps)(StaffManager);
