import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Transfer, Modal, Popconfirm,Form,Input,Select,message  } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable"

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const FormItem = Form.Item;
const Option = Select.Option;
export class StrategyManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      targetKeys: [],
      priceRulesTotal: 0,
      refreshTable: false,
      productList:[],
      productId:'',
      bindId: '',
      forbitTermianls: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {
//  this.getTerminals()
		this.getProductId();
  }
  componentWillReceiveProps(nextProps) {

  }
  check = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
    	if(err){
    		return;
    	}else{
				let postData = {name:values.name,items:[{productId:this.state.productId,count:values.style}]};
				this.props.rts({
					method:'post',
					url:'/BatchStandards',
					data:postData
				},this.uuid,'postData',res=>{
					this.setState({ visible: false,refreshTable:true});
          message.success("新建成功");
				});
    	}
    });
  }
  getProductId = () =>{
  	this.props.rts({
  		method:'get',
  		url:'/Products'
  	},this.uuid,'getProductId',res=>{
  		this.setState({productList:res.data,productId:res.data[0].id});
  	})
  }
  render() {
    const { terminalsData, terminalsByIdData } = this.state
    const { getFieldDecorator, getFieldValue } = this.props.form;
//  const formatData = this.handleFormat(terminalsData)
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/BatchStandards",
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
          	this.props.form.resetFields();
          	this.setState({ visible: true});
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "规格名称"
        },
        {
          type: "option",
          field: "total",
          title: "规格数",
          options: [
            {title: "64", value: 64},
            {title: "80", value: 80}
          ]
        }
      ],
      columns: [
        {
          title: "规格名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "规格数",
          dataIndex: "total",
          key: "terminalCount",
          align:'right',
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
    }
    return (
      <section className="StrategyManagement-page">
        <TableExpand
          {...config}
        />
        <Modal
          //width="80%"
          visible={this.state.visible}
          title={"新建批次"}
          okText="确定"
          cancelText="取消"
          loading={this.state.loading}
          // style={{display:"flex"}}
          onOk={this.check.bind(this)}
          onCancel={() => {
            this.setState({
              visible: false
            }, () => {
            });
          }}

        >
          <Form layout="vertical">
            {/*<div className="project-title">批次详情</div>*/}
            <FormItem {...formItemLayout} label="规格名称："  >
            	{getFieldDecorator('name', {
		            rules: [{
		              required: true, message: '请输入批次名称!',
		            }],
		          })(
		            <Input placeholder="请输入批次名称"/>
		          )}
            </FormItem>
            <FormItem {...formItemLayout} label="规格："  >
            	{getFieldDecorator("style", {
                rules: [{
                  required: true, message: '必填项',
                }],
                initialValue:80
              })(
	              <Select
	                  style={{ width: "100%" }}
	                >
	              	<Option  value={80}>80</Option>
	              	<Option  value={64}>64</Option>
								</Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const mapStateToProps = createStructuredSelector({
  /*UUid: state => state.get("rts").get("uuid"),
  getTerminals: state => state.get("rts").get("getTerminals"),
  getTerminalsById: state => state.get("rts").get("getTerminalsById"),*/
  // getNotTerminalsById: state => state.get("rts").get("getNotTerminalsById"),
});
const specificationsManagement = Form.create()(StrategyManagement);
export default connect(mapStateToProps, mapDispatchToProps)(specificationsManagement);
