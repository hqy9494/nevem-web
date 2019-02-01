import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { ButtonGroup, ButtonToolbar} from "react-bootstrap";
import { Button, Col, Row, Icon, Modal, Input, Card, Form, DatePicker, Radio, Select, Cascader, AutoComplete} from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import CheckInput from "../../components/CheckInput";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
// import styles from "./Index.scss";

export class StockLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areaData: [],
      address: [],
      editAddress: [],
    };
    this.uuid = uuid.v1();
    this.areaObj = {};
  }
  componentWillMount() {
  }
  componentDidMount() {
    this.getDepot();
    this.getArea();
    this.getAccount()
  }
  componentWillReceiveProps(nextProps) {
    const { getDepot, getAccount, getArea } = nextProps

    if (getDepot && getDepot[this.uuid]) {
      this.setState({
        depotData: getDepot[this.uuid].data,
        depotTotal: getDepot[this.uuid].total,
      })
    }

    if (getArea && getArea[this.uuid]) {
      this.setState({
        areaData: getArea[this.uuid],
      })
    }

    if (getAccount && getAccount[this.uuid]) {
      this.setState({
        accountData: getAccount[this.uuid].data,
        accountTotal: getAccount[this.uuid].total,
      })
    }
  }

  setAccount = (accountData = []) => {
    let data = [];
    accountData.forEach(v => {
      if (v) data.push({
        id: v.id,
        username: v.username
      })
    })  ;
    return data
  };

  getArea = () => {
    this.props.rts({
      method: 'get',
      url: '/tools/getAreaData'
    }, this.uuid, 'getArea')
  };

  getDepot = () => {
    this.props.rts({
      method: 'get',
      url: '/Depots',
    }, this.uuid, 'getDepot')
  };
  getAccount = () => {
    this.props.rts({
      method: 'get',
      url: '/accounts',
    }, this.uuid, 'getAccount')
  };

  putDepot = (params = {}, id) => {
    this.props.rts({
      method: id ? 'put' : 'post',
      url: id ? `/Depots/${id}` : `/Depots`,
      data: params
    }, this.uuid, 'putDepot', () => {
      this.setState({
        refreshTable: true,
        visible: false,
        stockDetail: {}
      }, () => {
        this.props.form.resetFields()
      })
    })
  };

  handleEdit = (e) => {
    e.preventDefault();
    const { stockDetail, editAddress } = this.state
    const { id } = stockDetail
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)){
          if (!values[i]) continue
          if(i === 'residence') continue;
          params[i] = values[i]
        }
        if (editAddress[0]) params.province = editAddress[0].label
        if (editAddress[1]) params.city = editAddress[1].label
        if (editAddress[2]) params.district = editAddress[2].label
        this.putDepot(params,id)
      }
    });
  };

  handleArea = (areaData) => {
    let res = [];
    if(areaData.length) {
      areaData.forEach(v => {
        const child = {
          label: v.name,
          value: v.name,
        };
        this.areaObj[v.name] = v.id;
        if (v.child.length > 0) child.children = this.handleArea(v.child);
        res.push(child)
      });

      return res
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { depotData, accountData, areaData, stockDetail, isEdit } = this.state;
    const area = this.handleArea(areaData) || [];

    let rulesOption = this.setAccount(accountData);

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 34 },
        sm: { span: 15 },
      },
    };
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Depots",
        include: 'charge',
      },
      search: [
        {
          type: "field",
          field: "name",
          title: "仓库名称"
        },
        /*{
          type: "field",
          field: "remarks",
          title: "仓库备注"
        },*/
	      {
          type: "option",
          field: "isDelete",
          title: "默认仓库",
          options: [
            { title: "是", value: -1 },
            { title: "否", value: 0 },
          ]
	      },
	     /* {
          type: "number",
          field: "totalSpecQty",
          title: "批次数量"
        },*/
       /*{
          type: "number",
          field: "qty",
          title: "批次总数量"
        },*/
       /*{
          type: "number",
          field: "totalPrice",
          title: "库存成本"
        }*/
	     {
          type: "relevance",
          field: "chargeId",
          title: "负责人",
          model: {
            api: "/accounts",
            field: "username"
          }
        },
        
      ],
      buttons: [
        {
          title: "新建",
          onClick: () => {
          	this.setState({ 
              visible: true,
              isEdit: false,
              stockDetail: {}
            },() => {
              this.props.form.resetFields()
            });
          }
        }
      ],
      columns: [
        {
          title: "仓库名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "负责人",
          dataIndex: "charge.username",
          key: "chargeId",
        },     
        {
          title: "默认仓库",
          key: "isDelete",
          render: (text, record) => (
            record.isDelete ? <span className="statusBlueTree">是</span> : <span className="statusGreyOne">否</span>
          )
        },
        {
          title: "备注",
          dataIndex: "remarks",
          key: "remarks",
        },
        {
          title: "批次数量",
          dataIndex: "totalSpecQty",
          key: "totalSpecQty",
          align:'right'
        },
        {
          title: "批次总数量",
          dataIndex: "qty",
          key: "qty",
          align:'right'
        },
        {
          title: "库存成本",
          dataIndex: "totalPrice",
          key: "totalPrice",
          align:'right',
          render:(val) => <span>￥ {val}</span>
        },
        {
          title: "操作",
          key: "handle",
          render: (text,record) => (
            <div>
              <Button
                className="buttonListFirst"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.setState({
                    visible: true,
                    stockDetail: record,
                    isEdit: true,
                  })
                }}
              >
                编辑
              </Button>
              <Button
                size="small"
                className="buttonListSecond"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`${this.props.match.path}/detail/${record.id}`);
                }}
              >
                详情
              </Button>
              <Button
                size="small"
                className="buttonListThird"
                onClick={() => {
									this.props.to(`/Stock/WarehouseRun?id=${record.id}`)
                }}
              >库存流水</Button>
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
    return <section className="StockLists-page">
      <TableExpand
        {...config}
      />
      <Modal
        width="70%"
        height="50%"
        visible={this.state.visible}
        title={isEdit ? '编辑': '新建'}
        footer={null}
        onCancel={() => {
          this.setState({ visible: false });
        }}
      >
        <Form style={{backgroundColor: '#fff', padding: '20px'}} onSubmit={this.handleEdit}>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem
                {...formItemLayout}
                label={`仓库名称`}
                >
                  {getFieldDecorator(`name`,{
                    rules: [{
                      message: '必填字段!',
                      required: true
                    }],
                    initialValue: isEdit ? (stockDetail && stockDetail.name || '') : ''
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                {...formItemLayout}
                label={`仓库管理员`}>
                  {getFieldDecorator(`chargeId`, {
                    rules: [{
                      message: '必填字段!',
                      required: true
                    }],
                    initialValue: isEdit ? (stockDetail && stockDetail.chargeId || '') : ''
                  })(
                    <Select style={{width:'100%'}}>
                      {
                        rulesOption.length > 0 ? rulesOption.map(e => {
                          return <Option value={e.id} key={e.id}>{e.username}</Option>
                        }) : []
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>

            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem
                  {...formItemLayout}
                  label="仓库地址"
                >
                  {getFieldDecorator('residence', {
                    rules: [{ type: 'array', required: true, message: '请选择' }],
                    initialValue: isEdit ? (stockDetail && [stockDetail.province, stockDetail.city, stockDetail.district] || []) : []
                  })(
                    <Cascader
                      options={area}
                      placeholder="请选择"
                      onChange={(value, selectedOptions) => {
                        this.setState({
                          editAddress: selectedOptions
                        }, () => {
                          let last = selectedOptions[selectedOptions.length - 1];
                        })
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                {...formItemLayout}
                label={`详细地址`}>
                  {getFieldDecorator(`address`, {
                    rules: [{
                      message: '必填字段!',
                      required: true
                    }],
                    initialValue: isEdit ? (stockDetail && stockDetail.address || '') : ''
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem
                {...formItemLayout}
                label={`仓库电话`}>
                  {getFieldDecorator(`phone`, {
                    rules: [{
                      message: '必填字段!',
                    }],
                    initialValue:isEdit ? (stockDetail && stockDetail.phone || '') : ''
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col sm={12}>
                <FormItem
                {...formItemLayout}
                label={`备注`}>
                  {getFieldDecorator(`remarks`, {
                    rules: [{
                      message: '必填字段!',
                    }],
                    initialValue: isEdit ? (stockDetail && stockDetail.remarks || '') : ''
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>

            <div className="ta-c mt-20">
              <Button style={{ marginRight: 8 }} onClick={() => {
                this.setState({
                  visible: false
                })
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </div>
        </Form>
      </Modal>
    </section>
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getDepot: state => state.get("rts").get("getDepot"),
  getAccount: state => state.get("rts").get("getAccount"),
  putDepot: state => state.get("rts").get("putDepot"),
  getArea: state => state.get("rts").get("getArea"),
});

const StockListsForm = Form.create()(StockLists);

export default connect(mapStateToProps, mapDispatchToProps)(StockListsForm);
