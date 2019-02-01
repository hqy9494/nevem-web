import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Popconfirm, Modal, Form, Select, Input } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
const FormItem = Form.Item
const Option = Select.Option

export class EquipmentManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      slotTemplatesData: [],
      id: '',
      isEdit: false,
      isLuckyEdit: false,
      title: '',
      terminalsByIdData: {},

    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {

  }
  componentDidMount() {
    this.getSlotTemplates();
  }
  componentWillReceiveProps(nextProps) {
    const { getSlotTemplates } = nextProps;

    if (getSlotTemplates && getSlotTemplates[this.uuid]) {
      this.setState({
        slotTemplatesData: getSlotTemplates[this.uuid].data,
      })
    }
  }

  // 正常模式
  showModal = (id,bol) => {
    let status = bol ? 'normal' : 'operator';

      this.props.rts({
          method: 'post',
          url: `/Terminals/change/status`,
          data: {
            id: id,
            status: status
          }
        },
        this.uuid,
        'resetTerminals',
        () => {
          this.setState({refreshTable: true})
        }
      )

  };

  // 重置设备
  reset = (id) => {

    this.props.rts({
        method: 'post',
        url: `/Terminals/reset`,
        data: {
          id: id
        }
      },
      this.uuid,
      'resetTerminals',
      () => {
	      this.setState({refreshTable: true})
	    }
    )
  };
  // 重置设备
  exit = (id) => {

    this.props.rts({
        method: 'post',
        url: `/Terminals/exit`,
        data: {
          id: id
        }
      },
      this.uuid,
      'resetTerminals',
      this.setState({refreshTable: true})
    )
  };

  getSlotTemplates = () => {
    this.props.rts({
      method: 'get',
      url: `/SlotTemplates`,
    }, this.uuid, 'getSlotTemplates')
  };


  postLuckySerialTemplates = (id, params) => {
    this.props.rts({
      method: 'post',
      url: `/Terminals/${id}/luckyDrawSerial`,
      params: params,
    }, this.uuid, 'postLuckySerialTemplates',() => {
      this.handleCancel()
    })
  };
 
  // 确定货道初始化提交
  postInitTlemplate = (id, ids) => {
    this.props.rts({
      method: 'post',
      url: `/Terminals/${id}/slotTemplate`,
      data: {
        slotTemplateId: ids
      }
    }, this.uuid, 'postInitTlemplate', () => {
      this.handleCancel()
    })
  };

  // 确定初始化货道
  handleOk = (e) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { id } = this.state;
        let params = {};
        if('id' in values) {
          if(values.id && values.id !== '') {
            this.postInitTlemplate(id, values.id);
            // this.handleCancel('id')
          }
        }
        if('luckyDrawSerial' in values) {
          if(values.luckyDrawSerial && values.luckyDrawSerial !== '') {
            params.luckyDrawSerial = values.luckyDrawSerial
            this.postLuckySerialTemplates(id, params)
            // this.handleCancel('luckyDrawSerial')
          }
        }
      }
    })
  };

  // 取消初始化货道
  handleCancel = () => {
    this.setState({
      visible: false,
      isEdit: false,
      isLuckyEdit: false,
    }, () => {
      // this.props.form.setFieldsValue({
      //   [name]: '',
      // })
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { match } = this.props;
    const { slotTemplatesData, isEdit, isLuckyEdit, terminalsByIdData } = this.state;
    const config = {
    	api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Terminals",
        where: {
          agent: true
        },
        include: ["agent"],
     },
      search: [
        {
          type: "field",
          field: "name",
          title: "设备名称",
        },
        {
          type: "field",
          field: "serial",
          title: "设备序列号"
        },
        {
          type: "option",
          title: "设备型号",
          field: "board",
          options: [
            { title: "微米", value: "WEIMI_V1.0" },
            { title: "创盈", value: "CHUANGYING_V1.0,null",or:true,fieldName:'board,board' }
          ]
        },
        {
          type: "option",
          title: "设备模式",
          field: "status",
          options: [
            { title: "正常模式", value: "normal" },
            { title: "运维模式", value: "operator" }
          ]
        },
        {
          type: "field",
          field: "luckyDrawSerial",
          title: "抽奖序列号"
        },
       {
         type: "relevance",
         field: "agentId",
         title: "代理商名称",
         model: {
           api: "/Agents",
           field: "name"
         }
       },
       {
          type: "optionRelevance",
          title: "代理商属性",
          field: "directId",
          fieldName: "agentId",
          options: [
            { title: "直属", value: true },
            { title: "一般", value: false }
          ],
          model: {
            api: "/Agents",
            field: "direct"
          }
        },
        {
          type: "field",
          field: "code",
          title: "设备编号"
        },
      ],
      columns: [
        {
          title: "设备名称",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (text ? <span>{text}</span> : <span>--</span>)
        },
        /*{
          title: "厂家",
          dataIndex: "factoryName",
          key: "factoryName",
        },*/
        {
          title: "设备序列号",
          dataIndex: "serial",
          key: "serial",
        },
        {
          title: "设备型号",
          dataIndex: "board",
          key: "board",
          render: (text, record) => {
            if (text === "WEIMI_V1.0"){
              return <span className="statusBlueTwo">微米</span>
            }
            return <span className="statusBlueOne">创盈</span>
          }
        },
        {
          title: "设备当前模式",
          dataIndex: "status",
          key: "status",
          render: (text, record) => {
            if (text == "normal"){
              return <span className="statusBlueTwo">正常模式</span>
            }else {
              return <span className="statusBlueOne">运维模式</span>
            }
          }
        },
        {
          title: "代理商名称",
          dataIndex: "agent.name",
          key: "agent.name",
        },
        {
          title: "代理商属性",
          dataIndex: "agent.direct",
          key: "agent.direct",
          render: (text, record) => {
            return (
              text ? <span style={{color: "#8ddc57"}}>直属</span> : <span style={{color: "#1aaceb"}}>一般</span>
            )
          }
        },
        {
          title: "抽奖序列号",
          dataIndex: "luckyDrawSerial",
          key: "luckyDrawSerial",
        },
        {
          title: "设备编号",
          dataIndex: "code",
          key: "code",
          render: (text, record) => (text ? <span>{text}</span> : <span>--</span>)
        },
        {
          title: "基础配置",
          key: "handle",
          render: (text, record) => (
            <div>
              {
                // <Button type="danger" size="small" style={{marginRight: '5px'}}>停止售货</Button>
              }
              <Button
                size="small"
                className="buttonListSecond"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`/Equipment/EquipmentInfo/${record.id}`)
                }}
              >
                运营配置
              </Button>
              	<Button
	                className="buttonListDanger"
	                size="small"
	                style={{marginRight: '5px'}}
	                onClick={() => {
	                  this.setState({
	                    id: record.id,
	                    visible: true,
                      isEdit: true,
                      title: '请选择初始化货道',
                      terminalsByIdData: record,
	                  })
	                }}
	              >
	                初始化货道
	              </Button>
                <Button
                  className="buttonListFourth"
                  size="small"
                  style={{marginRight: '5px'}}
                  onClick={() => {
                    this.setState({
                      id: record.id,
                      visible: true,
                      isLuckyEdit: true,
                      title: '请填写抽奖序列号',
                      terminalsByIdData: record,
                    })
                  }}
                >
                  抽奖配置
                </Button>
            </div>
          )
        },
        {
          title: "运营操作",
          dataIndex: "againHandle",
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
                查看货道
              </Button>
              {record.status == "normal" ? (
                  <Popconfirm
                    title="确认设备进入运维模式?"
                    onConfirm={() => {
                      this.showModal(record.id, false);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <Button
                      size="small"
                      className="buttonListMoreOne"
                      style={{marginRight: '5px'}}
                    >
                      运维模式
                    </Button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="确认设备进入正常模式?"
                    onConfirm={() => {
                     this.showModal(record.id, true);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <Button
                      size="small"
                      className="buttonListMoreTwo"
                      style={{marginRight: '5px'}}
                    >
                      正常模式
                    </Button>
                  </Popconfirm>
                )}
                {
                  // <Popconfirm
                  //   title="退出应用后设备将无法售卖，是否退出设备？"
                  //   onConfirm={() => {
                  //     this.exit(record.id, true);
                  //   }}
                  //   okText="是"
                  //   cancelText="否"
                  // >
                  //   <Button
                  //     size="small"
                  //     className="buttonListFifth"
                  //     style={{marginRight: '5px'}}
                  //   >
                  //     退出应用
                  //   </Button>
                  // </Popconfirm>
                }
                <Popconfirm
                  title="重置设备后将会回到未激活状态，需重新设置出厂配置，是否重置设备？"
                  onConfirm={() => {
                    this.reset(record.id, true);
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <Button
                    size="small"
                    className="buttonListFifth"
                    style={{marginRight: '5px'}}
                  >
                    重置设备
                  </Button>
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
    };
    return (
      <section className="EquipmentManagement-page">
        <TableExpand
          {...config}
        />
        {/*初始化货道*/}
        <Modal
          title={this.state.title ? this.state.title : '请选择'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={() => { isEdit ? this.handleCancel('luckyDrawSerial') : isLuckyEdit ? this.handleCancel('id') : null }}
          okText="确定"
          cancelText="取消"
        >
          
        {
          isEdit ?
            <Form layout="vertical">
              <FormItem label={`货道模板`}>
                {getFieldDecorator(`id`, {
                  rules: [{ message: '请选择货道模板', required: isEdit ? true : false}],
                  // initialValue: product && product.name || ''
                })(
                  <Select>
                    {
                      slotTemplatesData && slotTemplatesData.map((v, i) => (
                        <Option value={v.id} key={i}>{v.name}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Form> : null
        }
        {
          isLuckyEdit ?
            <Form layout="vertical">
              <FormItem label={``}>
                {getFieldDecorator(`luckyDrawSerial`, {
                  rules: [{ message: '请填写系统序列码', required: isLuckyEdit ? true : false }],
                  initialValue: terminalsByIdData && terminalsByIdData.luckyDrawSerial || ''
                })(
                  <Input/>
                )}
              </FormItem>
            </Form> : null
        }
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
  getSlotTemplates: state => state.get("rts").get("getSlotTemplates"),
  postLuckySerialTemplates: state => state.get("rts").get("postLuckySerialTemplates"),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EquipmentManagement));
