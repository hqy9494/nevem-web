import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Transfer, Modal, Popconfirm, message } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable"

export class CollectAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}

  postPaymentActive = (id, params)=> {
    id && this.props.rts({
      method: 'post',
      url: `/Payments/${id}/active`,
      data: {
        bol: params
      }
    }, this.uuid, 'postPaymentActive', () => {
      message.success('保存成功', 1, () => {
        if(!params) {
          this.getPositions(id)
        } else {
          this.setState({
            refreshTable: true
          })
        }
      })
    })
  }

  postPaymentRelieve = (id, params) => {
    id && 
    this.props.rts({
      method: 'post',
      url: `/Payments/${id}/relieve`,
      data: {
        ids: params
      }
    }, this.uuid, 'postPaymentRelieve', () => {
        this.setState({
          refreshTable: true
        })
    })
  }

  getPositions = id => {
    id && 
    this.props.rts({
      url: `/Positions`,
      method: 'get',
      params: {
        filter: {
          where: {
            paymentId: id
          },
          include: ["agent","place","terminal"]
        }
      }
    }, this.uuid, 'getPositions', (v) => {
      let ids = v.data.length ? v.data.map(v => v.id) : []
      ids.length ? this.postPaymentRelieve(id, ids) : this.setState({ refreshTable: true })
    })
  }

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Payments",
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to(`${this.props.match.path}/add`)
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "收款账号名称"
        },
        {
          type: "option",
          field: "type",
          title: "类型",
          options: [
            {title: "采宝", value: "CAIBAO"},
            {title: "官方", value: "NATIVE"}
          ]
        },
        {
          type: "option",
          field: "active",
          title: "状态",
          options: [
            {title: "启用", value: true},
            {title: "禁用", value: false}
          ]
        },
      ],
      columns: [
        {
          title: "收款账号名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          render: (text, record) => {

            if(text === 'CAIBAO') {
              return <span>采宝</span>
            }
            return <span>官方</span>
          }
        },
        {
          title: "账户",
          dataIndex: "caiBaoConfig.account",
          key: "caiBaoConfig.account",
          align:'right',
          render: (text, record) => {
            if(record && record.caiBaoConfig && record.caiBaoConfig.account) {
              return <span>{ record.caiBaoConfig.account }</span>
            }
            return <span>--</span>
          }
        },
        {
          title: "状态",
          dataIndex: "active",
          key: "active",
          align:'right',
          width:150,
          render: (text, record) => text ? <span>启用</span> : <span>禁用</span>
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <div>
              <Button
                className="buttonListFirst"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`${this.props.match.path}/${record.id}`)
                }}
              >
                编辑
              </Button>
              <Button
                size="small"
                className={!record.active ? 'buttonListSixth' :  "buttonListSecond"}
                disabled={!record.active}
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`${this.props.match.path}/management/${record.id}`)
                }}
              >
                捆绑设备
              </Button>
              <Popconfirm
                title={`确认${record.active ? '禁用' : '启用'}？`}
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  this.postPaymentActive(record.id, !record.active)
                }}
              >
                <Button
                  className="buttonListDanger"
                  size="small"
                  style={{marginRight: '5px'}}
                  onClick={() => {
                  }}
                >{record && record.active ? '禁用' : '启用'}</Button>
              </Popconfirm>

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
    }
    return (
      <section className="CollectAccount-page">
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

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getPositions: state => state.get("rts").get("getPositions"),
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectAccount);
