import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button, Table, Modal, message, Popconfirm, InputNumber } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import DetailTemplate from "../../components/DetailTemplate";

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

export class WarehouseTransferDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      dataSourceRows: [],
    };
    this.uuid = uuid.v1();
  }


  /*selectRow = (record) => {
    const max = Math.max(Number(this.state.value) - 1, 0)
    const min = record.qty ? Math.min(Number(this.state.value) + 1, record.qty) : Number(this.state.value) + 1
    // const selectedRowKeys = [...this.state.selectedRowKeys];
    // console.log(record.qty,record.key)
    // if (selectedRowKeys.indexOf(record.key) >= 0) {
    //   selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    // } else {
    //   selectedRowKeys.push(record.key);
    // }
    // this.setState({ selectedRowKeys });
  }*/

  onChange = (e) => {
    // console.log(e.target.value)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dataSourceRows } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {};
        let batchList = [];
        if(values.inDepotId===values.outDepotId) return	message.warning('调入调出仓库不能为同一仓库！');
        for(let i of Object.keys(values)){
          if (!values[i]) continue
          params[i] = values[i]
        }
        dataSourceRows && dataSourceRows.length > 0 && dataSourceRows.forEach((v) => {
          batchList.push({
            ['batchId'] : v['batchId'],
            ['qty'] : v['num']
          })
        })
        params['items'] = batchList.length > 0 ? batchList : []
        if(params.items.length > 0) this.postDepotTransfer(params)
        else message.warning('请选择批次明细')
      }
    })
  }

  onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.getDepot()
    this.getBatches()
  }

  componentWillReceiveProps(nextProps) {
    const { getBatches, getDepot, getDepotStocks } = nextProps
    const { dataSourceRows = [] } = this.state
    let newDataSourceRows = [...dataSourceRows]
    if (getBatches && getBatches[this.uuid]) {
      this.setState({
        batchData: getBatches[this.uuid].data,
        batchTotal: getBatches[this.uuid].total
      })
    }
    if (getDepot && getDepot[this.uuid]) {

      this.setState({
        depotData: getDepot[this.uuid].data,
        depotTotal: getDepot[this.uuid].total
      })
    }
    if (getDepotStocks && getDepotStocks[this.uuid]) {
      newDataSourceRows = getDepotStocks[this.uuid].data.length > 0 && newDataSourceRows.length == 0 ? getDepotStocks[this.uuid].data.map((v, i) => {
        return {
          ...v,
          num: 0
        }
      }) : getDepotStocks[this.uuid].data.length > 0 && newDataSourceRows.length > 0 ? newDataSourceRows.map((v, i) => {
        return {
          ...v,
          num: v.num ? v.num : 0
        }
      }) : getDepotStocks[this.uuid].data;
      this.setState({
        dataSourceRows: newDataSourceRows,
        dataSourceTotal: getDepotStocks[this.uuid].total
      })
    }
  }


  getBatches = () => {
    this.props.rts({
      method: 'get',
      url: '/Batches',
      params: {
        filter: {
          include:'batchStandard'
        }
      }
    }, this.uuid, 'getBatches')
  }

  getDepotStocks = (id, pArr = []) => {
    this.props.rts({
      method: 'get',
      url: '/DepotStocks',
      params: {
        filter: {
          where: {
            depotId: id ,
            batchId: {
              inq: pArr
            }
          },
          include:["batch","depot"],
        }
      }
    }, this.uuid, 'getDepotStocks', () => {
      this.setState({
        refreshTable: true
      })
    })
  }

  postDepotTransfer = (params = {}) => {
    this.props.rts({
      method: 'post',
      url: '/DepotTransfers',
      data: params
    }, this.uuid, 'postDepotTransfer', () => {
      this.setState({
        refreshTable: true
      })
      this.props.goBack()
    })
  }

  onInChange = (val) => {
    this.setState({
      inDepotVal : val
    })
  }

  handleDelete = (key) => {
    const newData = [...this.state.dataSourceRows]
    this.setState({ dataSourceRows: newData.filter(item => item.key !== key) })
  }

  onNumberChange = (e, i) => {
    let newData = [...this.state.dataSourceRows]
    newData = newData.map((v, q) => {
      if(v.key === i) {
        return {
          ...v,
          num: Number(e)
        }
      }else {
        return v
      }
    })
    this.setState({ dataSourceRows: newData })
  }

  onOutChange = (val) => {
    this.setState({
      outDepotVal : val
    })
  }

  getDepot = () => {
    this.props.rts({
      method: 'get',
      url: '/Depots'
    }, this.uuid, 'getDepot', () => {
      this.setState({
        refreshTable: true
      })
    })
  }

  render() {
    const { selectedRowKeys, depotData, selectedRows, dataSourceRows, inDepotVal, outDepotVal } = this.state;
    dataSourceRows && dataSourceRows.forEach((v, i) => v['key'] = i)
    const { getFieldDecorator } = this.props.form
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      onChange: this.onSelectedRowKeysChange,
      selections: true,
      onSelection: this.onSelection,
    };
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Batches",
        include: 'batchStandard'
      },
      search: [
        {
          type: "field",
          field: "id",
          title: "批次编号"
        },
        {
          type: "field",
          field: "name",
          title: "批次名称"
        }
      ],
      columns: [
        {
          title: "批次编号",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "批次名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "批次规格",
          dataIndex: "batchStandard.name",
          key: "batchStandard",
        },
      ],
      path: this.props.match.url,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };
    const columns = [{
      title: '批次名称',
      dataIndex: 'batch.name',
      key: 'batch'
      },{
        title: '当前库存',
        dataIndex: 'qty',
        key: 'qty'
      },{
        title: '调拨数量',
        key: 'num',
        dataIndex: 'num',
        render: (text, record, index) => <InputNumber min={0} max={record.qty} style={{width: '100%'}} defaultValue={text} onChange={(e) => this.onNumberChange(e, index)}/>,
      },{
        title: '平均进价',
        dataIndex: 'avgPrice',
        key: 'avgPrice'
      },{
        title: '操作',
        dataIndex: 'handle',
        render: (text, record) => {
          return (
            dataSourceRows.length > 1
              ? (
                <Popconfirm
                  title="确定删除?"
                  onConfirm={() => this.handleDelete(record.key)}
                  okText="确定"
                  cancelText="取消"
                  icon="delete"
                >
                  <Button type="danger" size="small">删除</Button>
                </Popconfirm>
              ) : null
          )
        }
      }];
		const child = (
			<div>
				<Form onSubmit={this.handleSubmit}>
	        <div style={{backgroundColor: '#fff', padding: '20px'}}>
	            <Row gutter={24}>
	              <Col sm={12}>
	                <FormItem label={`调出仓库:`}>
	                  {getFieldDecorator(`outDepotId`, {
	                    rules: [{
	                      message: '必选项!',
	                      required: true
	                    }],
//	                    initialValue: depotData && outDepotVal ? outDepotVal : ''
	                  })(
	                    <Select
	                      placeholder="请选择"
	                      onChange={this.onOutChange}
	                      style={{width:'100%'}}
	                    >
	                      { 
	                        depotData && depotData.map((v, i) => {
	                          return  <Option value={v.id} key={i}>{v.name}</Option>
	                        })
	                      }
	                    </Select>
	                  )}
	                </FormItem>
	              </Col>
	            </Row>
	            <Row gutter={24}>
	              <Col sm={12}>
	                <FormItem label={`调入仓库:`}>
	                  {getFieldDecorator(`inDepotId`, {
	                    rules: [{
	                      message: '请选择!',
	                      required: true
	                    }],
//	                    initialValue: depotData && inDepotVal ? inDepotVal : '' 
	                  })(
	                    <Select
	                      placeholder="请选择"
	                      onChange={this.onInChange}
	                      style={{width:'100%'}}
	                    >
	                      {
	                        depotData && depotData.map((v, i) => {
	                          return  <Option value={v.id} key={i}>{v.name}</Option>
	                        })
	                      }
	                    </Select>
	                  )}
	                </FormItem>
	              </Col>
	            </Row>
	            <Card title="批次明细" className="mt-20" style={{display: outDepotVal ? 'block' : 'none'}}  
	            	extra={
	            		<Button
                    type="primary"
                    icon="search"
                    onClick={()=>{
                      this.setState({
                        visible: true
                      })
                    }}
                  >选择
                  </Button>
	              }
	            >
	              <Row gutter={24}>
	                <Col sm={2}>
	                  
	                </Col>
	                <Col sm={24}>
	                  <Table
	                    columns={columns}
	                    dataSource={dataSourceRows ? dataSourceRows : []} 
	                    bordered
	                    className="publicTable"
	                    locale={{
						    		    filterTitle: '筛选',
						    		    filterConfirm: '确定',
						    		    filterReset: '重置',
						    		    emptyText: '暂无选择批次数据，请点击选择按钮进行筛选！'
						    		  }}
	                  />
	                </Col>
	              </Row>
	              <Row gutter={24}>
	                {/*<Col sm={4}>
	                  <Input/>
	                </Col>*/}
	              </Row>
	            </Card>
	            <div>
	              <Row gutter={24}>
	                <Col sm={12}>
	                  <FormItem label={`备注`}>
	                    {getFieldDecorator(`remarks`, {
	                      rules: [{
	                        message: '请输入备注!',
	                      }],
	                      initialValue: ''
	                    })(
	                      <Input />
	                    )}
	                  </FormItem>
	                </Col>
	              </Row>
	            </div>
	          </div>
	        </Form>
	        <Modal
	          width="80%"
	          height="80%"
	          visible={this.state.visible}
	          title="单据详情"
	          okText="确定"
	          cancelText="取消"
	          onOk={() => {
	            this.setState({ 
	              visible: false,
	              refreshTable: true,
	            });
	            this.getDepotStocks(outDepotVal, selectedRowKeys)
	          }}
	          onCancel={() => {
	            this.setState({ 
	              visible: false,
	            });
	          }}
	        >
	          <TableExpand
	            {...config}
	            removeHeader
	            rowSelection={rowSelection}
	          />
	        </Modal>
	      </div>  
		)
    return (
      <section className="WarehouseTransferDetail-page">
      	<DetailTemplate
	      	config = {this.props.config}
	      	title = {this.props.title}
	      	child={child}
	      	onCancle={this.props.goBack}
	      	onOk={this.handleSubmit}
	      />
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const getDepot = state => state.get("rts").get("getDepot");
const getDepotStocks = state => state.get("rts").get("getDepotStocks");
const getBatches = state => state.get("rts").get("getBatches");
const postDepotTransfer = state => state.get("rts").get("postDepotTransfer");

const WarehouseTransferDetailForm = Form.create()(WarehouseTransferDetail)

const mapStateToProps = createStructuredSelector({
  UUid,
  getDepot,
  getBatches,
  getDepotStocks,
  postDepotTransfer
});

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseTransferDetailForm);
