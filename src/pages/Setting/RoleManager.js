import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import moment from "moment";
import uuid from "uuid";
import { Grid, Row, Col } from "react-bootstrap";
import { Button } from "antd";
import TableExpand from "../../components/AsyncTable";

export class RoleManager extends React.Component {
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
        // data: "/accounts/roles"
         data: "/roleMenus/roles"
      },
      getAll:true,
      // buttons: [
      //   {
      //     title: "新建",
      //     onClick: () => {
      //       this.props.to(`${this.props.match.path}/add`);
      //     }
      //   }
      // ],
      search: [],
      columns: [
        {
          title: "名称",
          dataIndex: "description",
          key: "description"
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <Button
                className="buttonListFirst"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`${this.props.match.path}/detail/${record.id}?name=${record.name}`);
                }}
              >
                编辑
              </Button>
            </span>
          )
        }
      ],
      config:this.props.config,
	    title:this.props.title
    };

    return (
      <div style={{paddingBottom:"30px",height:"auto"}}>
        <TableExpand {...config} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const RoleManageruuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  RoleManageruuid
});

export default connect(mapStateToProps, mapDispatchToProps)(RoleManager);
