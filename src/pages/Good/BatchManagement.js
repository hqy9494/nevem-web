import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Form, Input, InputNumber, Modal, Select,Button,Card,Divider,Table,message,Popconfirm } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
// import styles from "./Index.scss";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

export class BatchManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      disabled:false,
      title:true,
      batchStandardData:[],
      batchStandardDetail:{},
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }

  componentDidMount() {
    // const { params } =  this.props.match;
    // const {id} = params;
    this.getBatchStandard();
    // if (id && id !== "add") {
    //   this.setState({
    //     disabled: true,
    //   });
    //   this.getOne();
    // }
  }

  componentWillReceiveProps(nextProps) {
    const { getBatchStandard,getBatches } = nextProps;

    if (getBatches && getBatches[this.uuid]) {
      this.setState({
        batchStandardDetail:getBatches[this.uuid]
      })
    }

    if (getBatchStandard && getBatchStandard[this.uuid]) {

      this.setState({
        batchStandardData:getBatchStandard[this.uuid].data
      })
    }
  }


// 启禁用
  confirm(id, bool) {
    this.props.rts(
      {
        method: "post",
        url: `/Batches/${id}/active`,
        data: {
          bol: bool
        }
      },
      this.uuid,
      'pageInfo', () => {
        this.setState({refreshTable: true})
      }
    );
  }


  check = () => {

    this.props.form.validateFieldsAndScroll((err, values) => {

      let price =parseFloat(values.price)
      let val ={
        name:values.name,
        batchStandardId:values.batchStandardId,
        price:price
      };
      // console.log(val,"val")
      if (!err) {
            this.props.rts(
              {
                method: "post",
                url: `/Batches`,
                data:val
              },
              this.uuid,
              "fixActive",
              () => {
                this.setState({ visible: false ,refreshTable:true,reason:"",loading:false});
                message.success("处理成功");

              }
            );



      }
    });

    // const { OrderRefundMsg = {} , reason,} = this.state;
    // if (orderByIdData.id && !this.state.loading) {
    //
    // }
    //   this.state.loading = true;
  };


  getBatches = (id) => {
    this.props.rts(
      {
        method: "get",
        url: `/Batches/${id}`,
        // params: {
        //   filter: {
        //     include: 'terminal'
        //   }
        // }
      },
      this.uuid,
      "getBatches",
       () => {
        this.setState({refreshTable: true})
      }
    );
  };


  // 获取批次规格
  getBatchStandard = () => {
    this.props.rts(
      {
        method: "get",
        url: `/BatchStandards`
      },
      this.uuid,
      "getBatchStandard"
    );
  };

  render() {

    const { getFieldDecorator} = this.props.form;
    const {disabled, batchStandardData,batchStandardDetail,title} = this.state;

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Batches",
        include: "batchStandard",
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.setState({
              visible: true,
              title:true
            });
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "批次名称"
        },
        {
          title: "批次状态",
          field: "active",
          type: "option",
          options:[
          	{title:'启用',value:1},
          	{title:'禁用',value:0}
          ]
        },
        {
          title: "批次价格",
          field: "price",
          type: "number"
        },
        {
          title: "批次规格",
          field: "batchStandardId",
          type: "relevance",
          model: {
            api: "/BatchStandards",
            field: "name"
          }
        }
      ],
      columns: [
        {
          title: "批次名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "批次规格",
          dataIndex: "batchStandard.name",
          key: "batchStandard.name",
        },
        {
          title: "批次状态",
          dataIndex: "active",
          key: "active",
          render: text => {
            if (text) {
              return <span className="statusBlueTree">启用</span>;
            } else {
              return <span className="statusRedOne">禁用</span>;
            }
          }
        },
        {
          title: "批次价格",
          dataIndex: "price",
          key: "price",
          align: "right",
          width:100,
          sort: true
        },
        {
          title: "交易操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <Button
                className="buttonListFirst"
                size="small" 
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.getBatches(record.id);
                  this.setState({
                    visible: true,
                    title:false,
                    disabled:true
                  });
                }}
              >
                详情
              </Button>
              {record.active ? (
                  <Popconfirm
                    title="确认禁用该用户?"
                    onConfirm={() => {
                      this.confirm(record.id, false);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <Button
                    	className="buttonListDanger"
                    	size="small" 
                    	style={{marginRight: '5px'}}
                    >禁用</Button>
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
                    <Button className="buttonListSecond" size="small">启用</Button>
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
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      config:this.props.config,
	    title:this.props.title
    };

    return (
      <section className="OrderManagement-page">
        <TableExpand
          {...config}
        />


        {/*批次弹框*/}
        <Modal
          visible={this.state.visible}
          title={title?"新建批次":"批次详情"}
          okText="确定"
          cancelText="取消"
          loading={this.state.loading}
          okButtonProps={{disabled:disabled}}
          onOk={
            () => {
              this.check();
              this.props.form.resetFields()

          }
          }
          onCancel={() => {
            this.setState({
              visible: false,
              disabled: false,
              batchStandardDetail:{}
            }, () => {
              this.props.form.resetFields()
            });
          }}

        >
          <Form layout="vertical">
            <FormItem {...formItemLayout} label="批次名称："  >
              {getFieldDecorator("name", {
                rules: [{
                  required: true, message: '必填项',
                }],
                initialValue:batchStandardDetail.name || ""
              })(
                <Input placeholder="请输入批次名称"  disabled={disabled}/>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="规格："  >
              {getFieldDecorator("batchStandardId", {
                rules: [{
                  required: true, message: '必填项',
                }],
                initialValue: batchStandardDetail.batchStandard && batchStandardDetail.batchStandard.name || ""
              })(
                <Select
                  placeholder="请选择"
                  style={{ width: "100%" }}
                  disabled={disabled}
                >

                  {batchStandardData && batchStandardData.map((val,key) => {
                    return<Option value={val.id} key={key}>{val.name}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="价格："  >
              {
                title?

                  (
                    getFieldDecorator("price", {
                      rules: [{
                        required: true, message: '必填项',
                      }],
                      initialValue: batchStandardDetail && batchStandardDetail.price || 0
                    })(
                    <div>
                      <InputNumber
                        min={0}
                        //formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        disabled={disabled}
                        style={{color:"red",width:"100%"}}
                      />
                    </div>
                      )
                 ) :
                 <strong style={{color:"red"}}> ¥{ batchStandardDetail.price}</strong>
            }
            </FormItem>
          </Form>
        </Modal>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => {
            this.setState({ previewVisible: false });
          }}
        >
          <img
            alt="商品图片(大)"
            style={{ width: "100%" }}
            src={this.state.previewImage}
          />
        </Modal>
    </section>
  )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const getBatches = state => state.get("rts").get("getBatches");
const getBatchStandard = state => state.get("rts").get("getBatchStandard");

const mapStateToProps = createStructuredSelector({
  UUid,
  getBatches,
  getBatchStandard
});
const WrappeBatchManagement = Form.create()(BatchManagement);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeBatchManagement);
