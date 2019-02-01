import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Panel, Tabs, Tab } from "react-bootstrap";
import { Row, Col,Icon, Form, Select, Button, Input, InputNumber, Switch, Modal, Card,Alert } from "antd";
import moment from "moment";
import DetailTemplate from "../../components/DetailTemplate";
import uuid from "uuid";
// import styles from "./Index.scss";
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class PaymentConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    const { params } =  this.props.match;
    const {id} = params;

    if (id && id !== "add") {
      this.state.disabled = true;
      this.getOne();
    }

  }

  componentWillReceiveProps(nextProps) {}

  getOne = (id = this.props.match.params.id) => {
    id &&
    this.props.rts(
      {
        method: "get",
        url: `/CutdownConfigs/${id}`
      },
      this.uuid,
      "pageInfo"
    );
  };

  submitNew = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
        // if (!err) {
        //   this.props.rts(
        //     {
        //       method: "post",
        //       url: `/CutdownConfigs`,
        //       data: val
        //     },
        //     this.uuid,
        //     "newPage",
        //     () => {
        //       this.props.goBack();
        //     }
        //   );
        // }

    })

  };




  render() {
    const { getFieldDecorator } = this.props.form;
    const { pageInfo } = this.props;
    const { disabled } = this.state;

    let page = {};

    if (pageInfo && pageInfo[this.uuid]) {
      page = pageInfo[this.uuid];
    }
		const child = (
			<Panel>
         <Row type="flex" justify="space-around" align="middle">
           {/*微信卡片*/}
           <div style={{width:"80%" ,margin:"0 auto"}}>
             <Card title="微信支付"  hoverable>
               <Row type="flex" justify="space-around" align="middle">
                  <Col span={4}>
                    <div style={{ width: "50%" ,margin:"0 auto" }}>
                      <img
                        style={{ width: "100%" }}
                        src="assets/img/wechat.png"
                      />
                    </div>
                  </Col>
                  <Col span={20} style={{borderLeft: "2px dashed #e6e6e6"}}>
                    <FormItem
                      {...formItemLayout}
                      label="公众号APPID（可选）"
                    >
                      {getFieldDecorator("APPID", {
                        //rules: [{
                        //  required: true, message: '必填项',
                        //}],
                        initialValue: page.appid
                      })(
                        <Input placeholder="可选"/>
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="支付子商户ID）"
                      extra="提示:不填写表示不开启微信支付"
                    >
                      {getFieldDecorator("wechatPay", {
                         rules: [{
                           required: true, message: '必填项',
                         }],
                        initialValue: page.wechatPay
                      })(
                        <Input placeholder="必填"/>
                      )}
                    </FormItem>
                  </Col>
               </Row>
             </Card>
           </div>

           {/*支付宝卡片*/}
           <div style={{width:"80%",margin:"10px auto"}}>
             <Card title="支付宝支付"  hoverable>
               <Row type="flex" justify="space-around" align="middle">
                  <Col span={4}>
                    <div style={{ width: "50%" ,margin:"0 auto" }}>
                      <img
                        style={{ width: "100%" }}
                        src="assets/img/alipay.png"
                      />
                    </div>
                  </Col>
                  <Col span={20} style={{borderLeft: "2px dashed #e6e6e6"}}>
                    <FormItem
                      {...formItemLayout}
                      label="第一步："
                    >
                      <Alert message={<p style={{margin:"0px"}}>签约支付宝产品 <a href="https://openhome.alipay.com/isv/settling/inviteSign.htm?appId=2017050407114561&sign=XabARqQY9GbHashoVNKTwwMYL%2Fssdr1QlGOlI80VWxo%3D#/guide">点击这里签约</a></p>} type="info" />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="授权Token"
                      extra={
                        <p style={{margin:"0px"}}> 提示：<a
                            href="https://auth.alipay.com/login/index.htm?goto=https%3A%2F%2Fopenauth.alipay.com%3A443%2Foauth2%2FappToAppAuth.htm%3Fapp_id%3D2017050407114561%26redirect_uri%3Dhttps%253A%252F%252Fc.yopoint.com%252Falipay%252Fgateway%252Fapp_auth%253FOID%253D5ab8924196eee5000f2cf912">点击这里授权</a></p>}
                    >
                      {getFieldDecorator("name", {
                        rules: [{
                          required: true, message: '必填项',
                        }],
                        initialValue: page.name
                      })(
                        <Input placeholder="必填"/>
                      )}
                    </FormItem>
                  </Col>
               </Row>
             </Card>
           </div>
           {/*保存按钮*/}
           <Col span={24}>
              <div style={{textAlign: 'center'}} className="mt-20">
                <Button type="primary" htmlType="submit"
                        onSubmit={values => {
                          this.submitNew(values)
                        }}>
                  保存
                </Button>
              </div>
           </Col>
         </Row>
        </Panel>
		)
    return (
      <section className="PaymentConfiguration-page">
        <DetailTemplate
	      	config = {this.props.config}
	      	title = {this.props.title}
	      	child={child}
	      	removeAllButton
	    />
        
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const pageInfo = state => state.get("rts").get("pageInfo");
const mapStateToProps = createStructuredSelector({
  UUid,
  pageInfo
});
const  WrappedPaymentConfiguration = Form.create()(PaymentConfiguration);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedPaymentConfiguration);
