import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button, Table, Modal, Cascader } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand";
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
// import styles from "./Index.scss";

export class StockStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const options = [{
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
          value: 'xihu',
          label: 'West Lake',
        }],
      }],
    }, {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
          value: 'zhonghuamen',
          label: 'Zhong Hua Men',
        }],
      }],
    }];
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Orders",
        total: "/Orders/count"
      },
      columns: [
        {
          title: "商品名称",
          dataIndex: "createdAt1",
          key: "createdAt1",
          type: "date"
        },
        {
          title: "商品条码",
          dataIndex: "buyerNick",
          key: "buyerNick",
        },
        {
          title: "仓库库存",
          dataIndex: "productName",
          key: "productName",
        },
        {
          title: "补货员个人库存",
          dataIndex: "orderTotalPrice1",
          key: "orderTotalPrice1",

        },
        {
          title: "总数",
          dataIndex: "receiverName",
          key: "receiverName",
          sort: true
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };
    return <section className="StockStatistics-page">
      <Form>
        <div className="project-title">配置</div>
        <div style={{backgroundColor: '#fff', padding: '20px'}}>
          <Card title="基本配置">
            <Row gutter={24}>
              <Col sm={8}>
                <FormItem label={`商品分类`}>
                  {getFieldDecorator(`a`, {
                    rules: [{
                      message: 'Input something!',
                    }],
                  })(
                    <Cascader
                      style={{display:'inlineBlock'}}
                      options={options}/>
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label={`商品名称`}>
                  {getFieldDecorator(`b`, {
                    rules: [{
                      message: 'Input something!',
                    }],
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label={`商品条码`}>
                  {getFieldDecorator(`c`, {
                    rules: [{
                      message: 'Input something!',
                    }],
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col sm={8}>
                <FormItem label={`生产厂商`}>
                  {getFieldDecorator(`d`, {
                    rules: [{
                      message: 'Input something!',
                    }],
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label={`建议弹簧`}>
                  {getFieldDecorator(`e`, {
                    rules: [{
                      message: 'Input something!',
                    }],
                  })(
                    <Select>
                      <Option value="china">China</Option>
                      <Option value="use">U.S.A</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col sm={8}>
                <FormItem label={`批发价格`}>
                  {getFieldDecorator(`f`, {
                    rules: [{
                      message: 'Input something!',
                    }],
                  })(
                    <Input/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </div>
      </Form>
      <TableExpand
        {...config}
        path={`${this.props.match.path}`}
        replace={this.props.replace}
        refresh={this.state.refreshTable}
        onRefreshEnd={() => {
          this.setState({refreshTable: false});
        }}
      />
    </section>;
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});

const StockStatisticsForm = Form.create()(StockStatistics)
export default connect(mapStateToProps, mapDispatchToProps)(StockStatisticsForm);
