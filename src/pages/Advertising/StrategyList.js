import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,  Divider, Popconfirm, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
// import styles from "./Index.scss";

export class StrategyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  confirm(id, bool) {
    // console.log(id+"======"+bool);
    this.props.rts(
      {
        method: "put",
        url: `/accounts/${id}/${bool ? 'enable' : 'disable'}`,
        // data: {
        //   active: bool
        // }
      },
      this.uuid,
      'pageInfo', () => {
        this.setState({refreshTable: true})
      }

    );

  }

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
        data: "/accounts",
        where:{}
        // total: "/HomePages/count"
      },
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
          title: "登录手机号",
          dataIndex: "mobile",
          key: "mobile"
        },
        {
          title: "姓名",
          dataIndex: "fullname",
          key: "fullname"
        },
        {
          title: "角色",
          dataIndex: "role.name",
          key: "role.name"
        },
        // {
        //   title: "排序",
        //   dataIndex: "sequence",
        //   key: "sequence",
        //   sort: true,
        //   align: "right"
        // },

        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "状态",
          dataIndex: "enabled",
          key: "enabled",
          render: text => {

            if (text) {
              return <span className="statusBlueTree">启用</span>;
            } else {
              return <span className="statusRedOne">禁用</span>;
            }
          }
        },
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
                编辑
              </Button>
              {record.enabled ? (
                  <Popconfirm
                    title="确认禁用该用户?"
                    onConfirm={() => {
                      this.confirm(record.id, false);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <Button className="buttonListDanger" size="small" style={{marginRight: '5px'}}>禁用</Button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="确认启用该用户?"
                    onConfirm={() => {
                      this.confirm(record.id, true);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <Button size="small" className="buttonListSecond">启用</Button>
                  </Popconfirm>
                )}
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
      refresh: this.state.refresh,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      config:this.props.config,
      title:this.props.title,
    };

    return (
      <section className="StrategyList-page">
        <TableExpand
          {...config}
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

export default connect(mapStateToProps, mapDispatchToProps)(StrategyList);
