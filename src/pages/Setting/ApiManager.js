import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col, Panel } from "react-bootstrap";
import TableExpand from "../../components/AsyncTable";
import { Table } from "antd";

export class ApiManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getAllApi();
  }

  componentWillReceiveProps(nextProps) {}

  getAllApi = () => {
    this.props.rts(
      {
        method: "get",
        url: `/Permissions/methods`
      },
      this.uuid,
      "allApi"
    );
  };

  expandedRowRender = record => {
    return (
      <Table
        rowKey="name"
        columns={[
          {
            title: "接口名称",
            dataIndex: "name",
            key: "name"
          },
          {
            title: "接口描述",
            dataIndex: "description",
            key: "description"
          },
          /*{
            title: "操作",
            key: "handle",
            render: (text, r) => (
              <span>
                <a
                  href="javascript:;"
                  onClick={() => {
                    this.props.to(
                      `${this.props.match.path}/detail/${r.name}?model=${
                        record.model
                      }&desc=${r.description}`
                    );
                  }}
                >
                  编辑权限
                </a>
              </span>
            )
          }*/
        ]}
        dataSource={record.methods}
        pagination={false}
      />
    );
  };

  render() {
		const config = {
			api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Permissions/methods"
      },
			columns:[
	      {
	        title: "模型",
	        dataIndex: "model",
	        key: "model"
	      }
	    ],
	    expandedRowRender:this.expandedRowRender,
	    config:this.props.config,
	    title:this.props.title
		}
    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
              <TableExpand
              	{...config}
              />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const ApiManageruuid = state => state.get("rts").get("uuid");
const allApi = state => state.get("rts").get("allApi");

const mapStateToProps = createStructuredSelector({
  ApiManageruuid,
  allApi
});

export default connect(mapStateToProps, mapDispatchToProps)(ApiManager);
