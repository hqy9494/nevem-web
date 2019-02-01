import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Transfer, Modal, Popconfirm } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable"

export class StrategyManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      targetKeys: [],
      priceRulesTotal: 0,
      refreshTable: false,
      bindId: '',
      forbitTermianls: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {
    this.getTerminals()
  }
  componentWillReceiveProps(nextProps) {
    const { getTerminals, getTerminalsById } = nextProps
    if (getTerminals && getTerminals[this.uuid]) {
      this.setState({
        terminalsData: getTerminals[this.uuid].data,
        terminalsTotal: getTerminals[this.uuid].total,
      })
    }

    if (getTerminalsById && getTerminalsById[this.uuid]) {
      const data = getTerminalsById[this.uuid].data || []
      const res = []
      data.forEach(v => {
        res.push(v.id)
      })
      this.setState({
        terminalsByIdData: getTerminalsById[this.uuid].data,
        targetKeys: res,
        forbitTermianls: res
      })
    }

    // if (getNotTerminalsById && getNotTerminalsById[this.uuid]) {
    //   this.setState({
    //     notTerminalsByIdData: getNotTerminalsById[this.uuid].data,
    //   })
    // }
  }
  getTerminals = () => {
    this.props.rts({
      method: 'get',
      url: '/Positions'
    }, this.uuid, 'getTerminals')
  }

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  }

  handleChange = (targetKeys, direction, moveKeys) => {
    // console.log(targetKeys, direction, moveKeys)

    this.setState({ targetKeys });
  }
  handleOk = () => {
  	this.bindPriceRules();
    this.setState({visible: false})
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  bindPriceRules = () => {
    const { targetKeys, bindId } = this.state
		//console.log(targetKeys,'targetKeys');
		this.props.rts({
      method: 'post',
      url: `/PriceRules/${bindId}/bind`,
      data: {
        ids: targetKeys
      }
    }, this.uuid, 'getTerminalsById', () => {
      this.setState({
        refreshTable: true
      })
    })
  }
  getTerminalsById = id => {
    this.props.rts({
      method: 'get',
      url: '/Positions',
      params: {
        filter: {
          where: {
            priceRuleId: id
          }
        }
      }
    }, this.uuid, 'getTerminalsById')
  }
  // getNotTerminalsById = id => {
  //   this.props.rts({
  //     method: 'get',
  //     url: '/Terminals',
  //     params: {
  //       filter: {
  //         where: {
  //           priceRuleId: {
  //             neq: id
  //           }
  //         }
  //       }
  //     }
  //   }, this.uuid, 'getNotTerminalsById')
  // }
  deletePriceRules = id => {
    this.props.rts({
      method: 'delete',
      url: `/PriceRules/${id}`
    }, this.uuid, 'deletePriceRules', () => {
      this.setState({
        refreshTable: true
      })
    })
  }
  handleFormat = data => {
    const { forbitTermianls } = this.state
    const res = []
    if (data) {
      data.forEach(v => {
        res.push({
          key: v.id,
          title: v.name,
          description: v.name,
          disabled: forbitTermianls.includes(v.id),
        })
      })
    }

    return res
  }
  render() {
    const { terminalsData, terminalsByIdData } = this.state
    const formatData = this.handleFormat(terminalsData)
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/PriceRules",
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to('/Strategy/StrategyManagement/add')
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "策略名称"
        },
        {
          type: "date",
          field: "createdAt",
          title: "创建时间"
        },
        /*{
          type: "number",
          field: "positionCount",
          title: "绑定点位数量"
        },*/
        
      ],
      columns: [
        {
          title: "策略名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
        },
        {
          title: "绑定点位数量",
          dataIndex: "positionCount",
          key: "positionCount",
          align:'right',
          width:150
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
                  this.props.to(`${this.props.match.path}/${text.id}`)
                }}
              >
                编辑
              </Button>
              <Button
                size="small"
                className="buttonListSecond"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.getTerminalsById(text.id)
                  // this.getNotTerminalsById(text.id)
                  this.setState({
                    bindId: text.id,
                    refreshTable: false,
                    visible: true
                  })
                }}
              >
                绑定点位
              </Button>
              <Popconfirm
                title="确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  this.deletePriceRules(text.id)
                }}
              >
                <Button
                  className="buttonListDanger"
                  size="small"
                  style={{marginRight: '5px'}}
                  onClick={() => {
                    // this.props.to(`${this.props.match.path}/${test.id}`)
                  }}
                >删除</Button>
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
      <section className="StrategyManagement-page">
        <TableExpand
          {...config}
        />
         <Modal
          title="绑定点位"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Transfer
            titles={['未绑定点位', '已绑定点位']}
            notFoundContent="暂无"
            dataSource={formatData}
            showSearch
            searchPlaceholder="请输入搜索内容"
            filterOption={this.filterOption}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={item => item.title}
            style={{display: 'flex', justifyContent: 'center'}}
            listStyle={{
              height: 300,
            }}
          />
        </Modal>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getTerminals: state => state.get("rts").get("getTerminals"),
  getTerminalsById: state => state.get("rts").get("getTerminalsById"),
  // getNotTerminalsById: state => state.get("rts").get("getNotTerminalsById"),
});

export default connect(mapStateToProps, mapDispatchToProps)(StrategyManagement);
