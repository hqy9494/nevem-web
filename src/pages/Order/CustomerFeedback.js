import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,Modal,Form, Input, InputNumber, Button  } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand";
// import styles from "./Index.scss";
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};


const FormItem = Form.Item;
const { TextArea } = Input;

export class CustomerFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      feedback: {}
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}


  reply = e => {
    e.preventDefault();
    const { feedback= {} } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // feedback.id &&
        // this.props.rts(
        //   {
        //     method: "put",
        //     url: `/Suggestions/${feedback.id}/reply`,
        //     data: {
        //       reply: values.reply
        //     }
        //   },
        //   this.uuid,
        //   "fixProducts",()=>{
        //     this.setState({visible:false,refreshTable:true})
        //   }
        // );
      }
    });
  };



  render() {
    const { getFieldDecorator } = this.props.form;
    const { feedback = {} } = this.state;
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Suggestions",
        total: "/Suggestions/count"
      },
      // buttons: [
      //   {
      //     title: "批量导出"
      //   }
      // ],
      search: [
        {
          type: "field",
          field: "id",
          title: "订单编号"
        },
        {
          type: "option",
          title: "订单状态",
          field: "orderStatus",
          options: [
            { title: "未付款", value: "WAIT_PAY" },
            { title: "已付款(待发货)", value: "WAIT_SHIPPING" },
            { title: "已发货", value: "SHIPPING" },
            { title: "已签收", value: "RECEIVED" },
            { title: "已完成", value: "SUCCESS" },
            { title: "已关闭", value: "CLOSED" },
            { title: "退款中", value: "STATE_REFUNDING" }
          ]
        },
        {
          type: "date",
          field: "createdAt",
          title: "交易时间"
        }
      ],
      columns: [
        {
          title: "反馈时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "用户",
          dataIndex: "nickname",
          key: "nickname",
        },
        {
          title: "订单内容",
          dataIndex: "contact",
          key: "contact",
          width: 420,
          render: (text, record) => {
            return <div className="tableExpand-column-TextArea">{text}</div>;
          }
        },
        {
          title: "用户吐槽",
          dataIndex: "content",
          key: "content",


        },
        {
          title: "用户等待时长",
          dataIndex: "updatedAt",
          key: "updatedAt",
          type: "fromNow",
          sort: true
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
                  this.setState({
                    feedback: {
                      id: record.id,
                      contact: record.contact,
                      content: record.content,
                      reply:record.reply
                    },
                    visible: true
                  });
                }}
              >
                回复
              </Button>
            </span>
          )
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };
    return (
    <section className="OrderManagement-page">
      <div className="project-title">用户反馈</div>
      <TableExpand
        {...config}
        path={`${this.props.match.path}`}
        replace={this.props.replace}
        refresh={this.state.refreshTable}
        onRefreshEnd={() => {
          this.setState({refreshTable: false});
        }}
      />
      <Modal
        visible={this.state.visible}
        title="反馈详情"
        okText="保存"
        cancelText="取消"
        onOk={this.reply}
        onCancel={() => {
          this.setState({ visible: false });
        }}
      >
        <FormItem {...formItemLayout} label="反馈内容">
          {getFieldDecorator("content", {
            rules: [{
              required: true, message: '必填项',
            }],
            initialValue: feedback.content
          })(
            <TextArea rows={6} disabled  />

          )}
        </FormItem>
        <FormItem {...formItemLayout} label="联系方式">
          {getFieldDecorator("contact", {
            rules: [{
              required: true, message: '必填项',
            }],
            initialValue: feedback.contact
          })(
            <TextArea rows={2} disabled  />

          )}
        </FormItem>
        <FormItem {...formItemLayout} label="回复">
          {getFieldDecorator("reply", {
            rules: [{
              required: true, message: '必填项',
            }],
            initialValue: feedback.reply
          })(
            <TextArea rows={6} disabled={feedback.reply?true:false}  />

          )}


        </FormItem>
      </Modal>
    </section>
  )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});

const WrappedCustomerFeedback = Form.create()(CustomerFeedback);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedCustomerFeedback);
