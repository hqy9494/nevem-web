import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col, Panel } from "react-bootstrap";
import { Table, Button } from "antd";
import TableExpand from "../../components/AsyncTable";
const ButtonGroup = Button.Group;

export class MenuManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {}


  render() {
		const config = {
			api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/menus/all"
      },
      buttons: [
	      {
	        title: "新建",
	        onClick:() => {
            this.props.to(`${this.props.match.path}/add`);
          }
	      }
	    ],
      search:[],
      columns : [
      {
        title: "名称",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "标识",
        dataIndex: "eName",
        key: "eName"
      },
      {
        title: "组件/路由",
        dataIndex: "component",
        key: "component"
      },
      {
        title: "排序",
        dataIndex: "sort",
        key: "sort"
      },
      {
        title: "操作",
        key: "handle",
        render: (text, record) => (
          <span>
            <Button
            	className="buttonListFirst"
            	size="small"
              onClick={() => {
                this.props.to(`${this.props.match.path}/detail/${record.id}`);
              }}
            >
              编辑权限
            </Button>
          </span>
        )
      }
    ],
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

const MenuManageruuid = state => state.get("rts").get("uuid");
const allMenu = state => state.get("rts").get("allMenu");

const mapStateToProps = createStructuredSelector({
  MenuManageruuid,
  allMenu
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuManager);
