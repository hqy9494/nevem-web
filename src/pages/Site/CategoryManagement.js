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
      OrderRefundMsg:{},
      orderByIdData: {},
      result: "true",
      reason:"1",
      loading:false,
      replyResult:"",
      disabled:false,
      title:true
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }
  // componentDidMount() {
    // const { params } =  this.props.match;
    // const {id} = params;
    // if (id && id !== "add") {
    //   this.setState({
    //     title:false
    //   });
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    const { getOrderId } = nextProps;
    if (getOrderId && getOrderId[this.uuid]) {
      const res = getOrderId[this.uuid]
      // console.log(res.refundReply, 'refundReply')
      this.setState({
        orderByIdData: res,
        // money: res.refundReply || 0
      })
    }
  }



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
    //
  // changeOrderRefundMsg = () => {
  //   const { OrderRefundMsg = {} } = this.state;
  //   Number(OrderRefundMsg.price)&& OrderRefundMsg.id &&
  //   this.props.rts(
  //     {
  //       method: "put",
  //       url: `/Products/${OrderRefundMsg.id}`,
  //       data: {
  //         price: product.price*100
  //       }
  //     },
  //     this.uuid,
  //     "fixProducts",()=>{
  //       this.setState({visible:false,refreshTable:true})
  //     }
  //   );
  // };


  // 新建&编辑 用id判断
  check = (id) => {
    const { match } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      let val ={
        parentId:match.params.id,
        name:values.name
      };
      if (!err) {
        if(id){
          // console.log(val,"val")
          this.props.rts(
            {
              method: "put",
              url: `/Industries/${id}`,
              data:val
            },
            this.uuid,
            "fixActive",
            () => {
              this.setState({ visible: false ,refreshTable:true,reason:"",loading:false});
              message.success("修改成功");
            }
          );

        }else {
          // console.log(val,"val")
          this.props.rts(
            {
              method: "post",
              url: `/Industries`,
              data:val
            },
            this.uuid,
            "fixActive",
            () => {
              this.setState({ visible: false ,refreshTable:true,reason:"",loading:false});
              message.success("创建成功");
            }
          );

        }







      }else {
        message.error("请输入行业名称");
      }
    });
  };


// 删除
  remove(id,name) {
    this.props.rts(
      {
        method: "delete",
        url: `/Industries/${id}`,
        data:name
      },
      this.uuid,
      "removeHome",()=>{
        this.setState({refreshTable:true});
        message.success("删除成功");
      }
    );
  }







  render() {
    const { match } = this.props;
    const { getFieldDecorator} = this.props.form;
    const {industries,title} = this.state;

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Industries",
        where: {
          parentId: match.params.id
        }
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.setState({
              visible: true,
              title:true,
              industries:"",
              detailId:''
            });
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "类别名称"
        },
      ],
      columns: [
        {
          title: "类别名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "状态",
          dataIndex: "enabled",
          key: "enabled",
          render: text => {
            if (text) {
              return "启用";
            } else {
              return "禁用";
            }
          }
        },
        {
          title: "交易操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <Button
                type="primary"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  //this.check(record.id);
                  this.setState({
                    visible: true,
                    title:false,
                    industries:record.name,
                    detailId:record.id
                  });
                }}
              >
                编辑
              </Button>
              <Popconfirm
                title="确认删除该页面?"
                onConfirm={() => {
                  this.remove(record.id,record.name);

                }}
                okText="是"
                cancelText="否"
              >
              <Button type="danger" size="small" style={{marginRight: '5px'}}>删除</Button>
              </Popconfirm>
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


        {/*类别管理弹框*/}
        <Modal
          visible={this.state.visible}
          title={this.state.title?"新建类别":"类别详情"}
          okText="确定"
          cancelText="取消"
          loading={this.state.loading}
          onOk={() => {
            this.check(this.state.detailId);
            this.props.form.resetFields()
          }}
          onCancel={() => {
            this.setState({
              visible: false,
              disabled: false
            }, () => {
              this.props.form.resetFields()
            });
          }}

        >
          <Form layout="vertical">

            <FormItem {...formItemLayout} label="类别名称："  >
              {getFieldDecorator("name", {
                rules: [{
                  required: true, message: '必填项',
                }],
                initialValue: title ? "" : industries
              })(
                <Input placeholder="请输入类别名称"/>
              )}
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
const getOrderId = state => state.get("rts").get("getOrderId");

const mapStateToProps = createStructuredSelector({
  UUid,
  getOrderId
});
const WrappeBatchManagement = Form.create()(BatchManagement);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeBatchManagement);
