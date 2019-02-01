import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,  Divider, Popconfirm,Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
// import styles from "./Index.scss";

export class OperatorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {refreshTable:false};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}


  // 启禁用
  // confirm(id, bool) {
  //   // console.log(id+"======"+bool);
  //   this.props.rts(
  //     {
  //       method: "put",
  //       url: `/CutdownConfigs/${bool ? 'enable' : 'disable'}/${id}`,
  //       // data: {
  //       //   active: bool
  //       // }
  //     },
  //     this.uuid,
  //     'pageInfo', () => {
  //       this.setState({refresh: true})
  //     }
  //
  //   );
  //
  // }

  // 删除
  // remove(id) {
  //   this.props.rts(
  //     {
  //       method: "delete",
  //       url: `/HomePages/${id}`
  //     },
  //     this.uuid,
  //     "removeHome",()=>{
  //       this.setState({refreshTable:true})
  //     }
  //   );
  // }

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Operators",
      },
      getAll:true,
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to(`${this.props.match.path}/detail/add`);
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "运营商名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        // {
        //   title: "状态",
        //   dataIndex: "enable",
        //   key: "enable",
        //   render: text => {
        //     if (text) {
        //       return "启用";
        //     } else {
        //       return "禁用";
        //     }
        //   }
        // },
        {
          title: "操作",
          // key: "handle",
          render: (text, record) => (
            <span>
               <Button
                 className="buttonListFirst"
                 size="small"
                 style={{marginRight: '5px'}}
                 onClick={() => {
                   this.props.to(`${this.props.match.path}/detail/${record.id}`);
                 }}
               >
                详情
              </Button>

              {/*<Divider type="vertical" />*/}
              {/*{record.enable ? (*/}
              {/*<Popconfirm*/}
              {/*title="确认禁用该页面?"*/}
              {/*onConfirm={() => {*/}
              {/*this.confirm(record.id, false);*/}
              {/*}}*/}
              {/*okText="是"*/}
              {/*cancelText="否"*/}
              {/*>*/}
              {/*<a href="javascript:;">禁用</a>*/}
              {/*</Popconfirm>*/}
              {/*) : (*/}
              {/*<Popconfirm*/}
              {/*title="确认启用该页面?"*/}
              {/*onConfirm={() => {*/}
              {/*this.confirm(record.id, true);*/}
              {/*}}*/}
              {/*okText="是"*/}
              {/*cancelText="否"*/}
              {/*>*/}
              {/*<a href="javascript:;">启用</a>*/}
              {/*</Popconfirm>*/}
              {/*)}*/}

              {/*<Divider type="vertical" />*/}
              {/*<Popconfirm*/}
              {/*title="确认删除该页面?"*/}
              {/*onConfirm={() => {*/}
              {/*this.remove(record.id);*/}
              {/*}}*/}
              {/*okText="是"*/}
              {/*cancelText="否"*/}
              {/*>*/}
              {/*<a href="javascript:;">删除</a>*/}
              {/*</Popconfirm>*/}
            </span>
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
      <section className="OperatorList-page">
        <TableExpand
          {...config}
          getAll
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

export default connect(mapStateToProps, mapDispatchToProps)(OperatorList);
