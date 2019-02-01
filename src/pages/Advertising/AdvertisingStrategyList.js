import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,  Divider, Popconfirm, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
// import styles from "./Index.scss";

export class AdvertisingStrategyList extends React.Component {
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
            this.props.to(`${this.props.match.path}/add`);
          }
        }
      ],
      search: [],
      columns: [
        {
          title: "策略名称",
          dataIndex: "username",
          key: "username"
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
                   this.props.to(`${this.props.match.path}/detail/${record.id}`);
                 }}
               >
                编辑
              </Button>
              <Popconfirm
                  title="是否删除该数据?"
                  onConfirm={() => {
                    this.remove(record.id, false);
                  }}
                  okText="是"
                  cancelText="否"
                >
                <Button
                  className="buttonListDanger"
                  size="small" 
                  style={{marginRight: '5px'}}
                >删除</Button>
              </Popconfirm>
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
      title:this.props.title
    };

    return (
      <section className="AdvertisingStrategyList-page">
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

export default connect(mapStateToProps, mapDispatchToProps)(AdvertisingStrategyList);
