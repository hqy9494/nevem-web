import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button, Table, Modal } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand";
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

export class PurchaseInventoryDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Orders",
        total: "/Orders/count"
      },
      columns: [
        {
          title: "商品",
          dataIndex: 'a',
          key: 'a'
        },
        {
          title: "系统数量",
          dataIndex: "createdAt1",
          key: "createdAt1",
          type: "date"
        },
        {
          title: "盘点数量",
          key: "buyerNick",
          render: (text, record) => (
            <Input/>
          )
        },
        {
          title: "采购均价",
          dataIndex: "productName",
          key: "productName",
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <Button
              type="danger"
              icon="delete"
              onClick={() => {
                //console.log("delete")
              }}
            >
              删除
            </Button>
          )
        },
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };

    const { getFieldDecorator } = this.props.form
    return (
      <section className="PurchaseInventoryDetail-page">
        <Form>
        <div className="project-title">新增采购退货</div>
        <div style={{backgroundColor: '#fff', padding: '20px'}}>
            <Row gutter={24}>
              <Col sm={12}>
                <FormItem label={`仓库:`}>
                  {getFieldDecorator(`b`, {
                    rules: [{
                      message: 'Input something!',
                    }],
                  })(
                    <Select
                      style={{width:'100%'}}
                    >
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Card title="商品明细" className="mt-20">
              <Row gutter={24}>
                <Col sm={24}>
                  <TableExpand
                    {...config}
                    path={`${this.props.match.path}`}
                    replace={this.props.replace}
                    refresh={this.state.refreshTable}
                    onRefreshEnd={() => {
                      this.setState({refreshTable: false});
                    }}
                  />
                </Col>
              </Row>
              <Row gutter={24}>
                <Col sm={12}>
                  <FormItem label={`备注`}>
                    {getFieldDecorator(`e`, {
                      rules: [{
                        message: 'Input something!',
                      }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <div className="ta-c mt-20">
              <Button style={{ marginRight: 8 }} onClick={() => {
                this.props.goBack()
              }}>
                返回
              </Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </div>
          </div>
        </Form>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const PurchaseInventoryDetailForm = Form.create()(PurchaseInventoryDetail)

const mapStateToProps = createStructuredSelector({
  UUid
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseInventoryDetailForm);
