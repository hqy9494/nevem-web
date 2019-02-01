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
//  console.log(id);
    this.props.rts({
        method: 'post',
        url: `/Terminals/reset`,
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



  render() {
    const { getFieldDecorator } = this.props.form;
    const { match } = this.props;
    const { slotTemplatesData, isEdit, isLuckyEdit, terminalsByIdData } = this.state;
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Terminals",
        where: {agent: true}
      },
      buttons: [
        // {
        //   title: "新建",
        //   onClick: () => {
        //     this.props.to(`/Equipment/EquipmentManagement/add`)
        //   }
        // }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "设备名称"
        },
        {
          type: "field",
          field: "serial",
          title: "序列号"
        },
        {
          type: "field",
          field: "code",
          title: "设备编号"
        },
        {
          type: "field",
          field: "version",
          title: "当前版本"
        },
        {
          type: "relevance",
          field: "positionId",
          title: "设备点位",
          model: {
            api: "/Positions",
            field: "name"
          }
        },
        {
          type: "unrelevance",
          field: "place",
          title: "设备场地",
          fieldName:'positionId',
          model: {
            api: "/Positions",
            field:"placeId",
            child:{
          		api: "/Places",
            	field: "name"
            },
          }
        },
        
      ],
      columns: [
        {
          title: "设备名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "序列号",
          dataIndex: "serial",
          key: "serial",
        },
        {
          title: "设备编号",
          dataIndex: "code",
          key: "code"
        },
        {
          title: "设备点位",
          dataIndex: "position.name",
          key: "position.name",
        },
        {
          title: "设备场地",
          dataIndex: "place",
          key: "place",
          render :(text,record)=>{
            return(
              <span>
              {record.position && record.position.place && record.position.place.name}
              </span>
            )
          }
        },
        {
          title: "省/市",
          dataIndex: "provinceCity",
          key: "provinceCity",
          render :(text,record)=>{
            return(
            <span>
              {record.position && record.position.place && record.position.place.province}/{record.position && record.position.place &&record.position.place.city}
              </span>
            )
          }
        },
        {
          title: "当前版本",
          dataIndex: "version",
          key: "version",
        },

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
              <FormItem label={`货到模板`}>
                {getFieldDecorator(`id`, {
                  rules: [{ message: '请选择货到模板', required: isEdit ? true : false}],
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
