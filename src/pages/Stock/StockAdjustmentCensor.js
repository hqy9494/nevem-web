import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { ButtonGroup, ButtonToolbar} from "react-bootstrap";
import { Button, Col, Row, Icon, Modal, Input, Card, Form, DatePicker, Radio, Select, Cascader, Table,message} from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
// import styles from "./Index.scss";

export class WarehousePurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible:false,refreshTable:false,dstaData:{}};
    this.uuid = uuid.v1();
  }
  componentDidMount() {

  }
  DepotStockTerminalAdjustsDetail = id=>{
  	this.props.rts({
      method: 'get',
      url: `/DepotStockTerminalAdjusts/${id}`,
    }, this.uuid, 'DepotStockTerminalAdjusts',(res) => {
    	//console.log(res);
      this.setState({
        visible : true,
        refreshTable: true,
        dstaData:res
      })
    })
  }
  adjustsFn = (id)=>{
  	this.props.form.validateFieldsAndScroll((err, values) => {
    	if(err){
    		return;
    	}else{
				this.props.rts({
					method:'post',
					url:`/DepotStockTerminalAdjusts/${id}/${values.dstaData.status}`,
				},this.uuid,'postData',res=>{
					//console.log(res);
					this.setState({ visible: false,refreshTable:true});
          message.success("审核成功");
				});
    	}
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { AgentOrderItemData,dstaData } = this.state
		const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/DepotStockTerminalAdjusts",
        include: ['opAccount']
      },
      search: [
        {
          type: "option",
          title: "订单状态",
          field: "status",
          options: [
            { title: "新建", value: "created" },
            { title: "同意", value: "pass" },
            { title: "拒绝", value: "refuse" }
          ]
        },
        {
          type: "relevance",
          field: "terminalId",
          title: "设备编号",
          model: {
            api: "/Terminals",
            field: "code",
          }
        },
        {
          type: "relevance",
          field: "opAccountId",
          title: "申请补货员",
          model: {
            api: "/accounts",
            field: "fullname"
          }
        },
        {
          title: "申请时间",
          field: "createdAt",
      		type:'date'
        },
      ],
      columns: [
        {
          title: "申请补货员",
          dataIndex: "opAccount.fullname",
          key: "opAccount.fullname",
        },
        {
          title: "设备编号",
          dataIndex: "terminal.code",
          key: "terminal.code",
        },
        {
          title: "设备点位",
          dataIndex: "position.name",
          key: "position.name",
        },
        {
          title: "申请时间",
          dataIndex: "createdAt",
          key: "createdAt",
      		type:'date'
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          render: text => {
            if (text == 'created') {
              return <span className="statusBlueTree">新 建 </span>
            } else if(text == 'pass') {
              return <span className="statusBlueFour">同 意</span>
            } else if(text == 'refuse') {
              return <span className="statusRedOne">拒 绝</span>
            }
          }
        },
        {
          title: "审核",
          key: "handle",
          render: (text, record) => (
            <div>
              <Button
                className="buttonListFirst"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.DepotStockTerminalAdjustsDetail(record.id)
                }}
              >
                {record.status==='created'?'审核':'查看'}
              </Button>
              <Button
                style={{display: record.status == 'SHIPPING' ? 'inlineBlock' : 'none'}}
                className="buttonListSecond"
                size="small"
                onClick={() => {
                  this.postAgentOrderReceive(record.id)
                }}
              >确认收货</Button>
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
    return <section className="WarehousePurchase-page">
      <TableExpand
        {...config}
      />
      <Modal
        width="70%"
        height="80%"
        visible={this.state.visible}
        title="库存调整详情"
        okText="确定"
        cancelText="关闭"
        onOk={()=>this.adjustsFn(dstaData.id)}
        onCancel={(e) => {
          this.setState({ visible: false });
        }}
      >
      <div>
          <Row
            gutter={24}
            type="flex"
            justify="start"
            style={{margin: '10px 0px'}}
          >
          	<Col sm={8}>
              <span><b>原库存：</b> {dstaData.items && dstaData.items[0].beforeQty}</span>
            </Col>
            <Col sm={8}>
              <span><b>修改后库存：</b> {dstaData.items && dstaData.items[0].afterQty}</span>
            </Col>
            <Col sm={24} style={{marginTop: '30px'}}>
              <span><b>申请原因：</b>{dstaData.reason}</span>
            </Col>
             <Col sm={24} style={{marginTop: '30px'}}>
              <span><b>备注：</b>{dstaData.remarks}</span>
            </Col>
            <Col sm={24} style={{marginTop: '30px'}}>
            		<FormItem label={`审核是否同意:`}>
            				{getFieldDecorator(`dstaData.status`, {
            					initialValue:dstaData.status==='created'?'pass':dstaData.status,
	                    rules: [{
	                      message: '必选项!',
	                      required: true
	                    }],
	                  	})(
                  	<Select
                  			disabled={dstaData.status==='created'?false:true}
                  			placeholder="请选择"
                  	    style={{width:'30%'}}
                  	  >
		                  	<Option value="pass">同意</Option>
		                  	<Option value="refuse">拒绝</Option>
                  	</Select>
                  	)}
                </FormItem>
            </Col>

          </Row>
        </div>
      </Modal>
    </section>
  }
}


const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const getAgentOrderItem = state => state.get("rts").get("getAgentOrderItem");
const postAgentOrderReceive = state => state.get("rts").get("postAgentOrderReceive");

const mapStateToProps = createStructuredSelector({
  UUid,
  getAgentOrderItem,
  postAgentOrderReceive
});

const WarehousePurchaseForm = Form.create()(WarehousePurchase);
export default connect(mapStateToProps, mapDispatchToProps)(WarehousePurchaseForm);
