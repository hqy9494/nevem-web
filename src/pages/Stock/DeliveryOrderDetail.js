import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import moment from "../../components/Moment";
import DetailTemplate from "../../components/DetailTemplate";
import { Row, Col, Panel, Tabs, Tab } from "react-bootstrap";
import {
  Form,
  Select,
  Button,
  InputNumber,
  message,
  Divider,
  Steps,
  Table,
  Modal,
  notification,
  Card,
  Input
} from "antd";
import DescriptionList from "../../components/DescriptionList";
const { Description } = DescriptionList;
const Step = Steps.Step;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class DeliveryOrderDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryItems: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {

  }
  componentDidMount() {
    const { match } = this.props
    const { DepotPickupData, deliveryItems } = this.state

    const id = this.getSubStr(match.params.id,'=','&')
    const status = match.params.id.substr(-1)
    if (id) {
      this.getDepotPickup(id);
      this.setState({
        depotPickupId: id,
        PickupStatus : Number(status)
      })
    }
    if(DepotPickupData && deliveryItems) {
      deliveryItems.map((v,i) => {
        this.getDepotStock(DepotPickupData.depotId, v.batch.id)
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    const { getDepotPickup } = nextProps
    if (getDepotPickup && getDepotPickup[this.uuid]) {
      this.setState({
        DepotPickupData: getDepotPickup[this.uuid],
        deliveryItems: getDepotPickup[this.uuid].items
      })
    }
  }
  getSubStr = (str, left, right) => str.substring(str.indexOf(left)+1,str.lastIndexOf(right))
  
  getDepotPickup = id => {
    this.props.rts({
      method: 'get',
      url: `/DepotPickups/${id}`
    }, this.uuid, 'getDepotPickup', () => {
      this.setState({
        refreshTable: true
      })
    })
  }
  postDepotPickupPass = (id) => {
    const { deliveryItems }  = this.state;
    let params = [];
    deliveryItems && deliveryItems.forEach((v,i) => {
      params.push({
        'batchId' : v['batchId'],
        'qty' : v['realQty']
      })
    })
    this.props.rts({
      method: 'post',
      url: `/DepotPickups/${id}/pass`,
      data: params
    }, this.uuid, 'postDepotPickupPass', () => {
      this.setState({
        refreshTable: true
      })
      this.props.goBack();
    })
  }

  postDepotPickupRefuse = id => {
    this.props.rts({
      method: 'post',
      url: `/DepotPickups/${id}/refuse`,
    }, this.uuid, 'postDepotPickupRefuse', () => {
      this.setState({
        refreshTable: true
      })
      this.props.goBack();
    })
  }

  onInputChange = (e, index) => {
    let newData = [...this.state.deliveryItems];
    // const max = Math.max(Number(this.state.value) - 1, 0)
    // const min = data.qty ? Math.min(Number(this.state.value) + 1, data.qty) : Number(this.state.value) + 1
    newData = newData.map((v,i) => {
      if(index === v.key) {
        return {
          ...v,
          realQty: Number(e)
        }
      }else {
        return {
          ...v
        }
      }
    })
    
    this.setState({ deliveryItems: newData});
  }

  render() {
    const { DepotPickupData, PickupStatus, deliveryItems } = this.state;
    let sum = 0;
    DepotPickupData && DepotPickupData.items.forEach(r => sum += r.qty)
    deliveryItems && deliveryItems.forEach((item,index) => { item['key'] = index;})
    const config = {
      data: deliveryItems && deliveryItems.map((v, i) => {
        return {
          ...v,
          key: i
        }
      }),
      columns:[
        {
          title: '批次编号',
          dataIndex: 'batch.id',
          key: 'id',
        },
        {
          title: '批次名称',
          dataIndex: 'batch.name',
          key: 'batch',
        },
        {
          title: '申请数量',
          dataIndex: 'qty',
          key: 'qty',
        },
        {
          title: '当前库存',
          dataIndex: 'batch.depotQty',
          key: 'depotQty'
        },
        {
          title: '实际数量',
          dataIndex: 'realQty',
          render: (text, record, index) => (
            <span>
             {!PickupStatus ? (
                 <InputNumber min={0} defaultValue={record.realQty} max={record.qty} onChange={(e)=> { this.onInputChange(e, index)}} />
               ):(
                 <span>{record.realQty}</span>
               )}
            </span>
          )
        },
      ]
    };
		const child = (
			<Panel>
        <Card>
            <p>仓库:<span style={{marginLeft: 10}}>{DepotPickupData && DepotPickupData.depot.name}</span></p>
            <p>补货员:<span style={{marginLeft: 10}}>{DepotPickupData && DepotPickupData.account.username}</span></p>
        </Card>

        <Table
          columns={config.columns}
          dataSource={config.data}
          bordered
          className="mt-20"
          title={() =><div className="project-title">批次明细</div>}
          footer={() => `申请总数: ${sum}`}
        />

        <Card>
          <Row>
            <Col span={4}>备注:</Col>
            <Col span={20}><Input placeholder="请输入备注信息" /></Col>
          </Row>
        </Card>

        {/*保存按钮*/}
        {/*<FormItem wrapperCol={{ span: 12, offset: 6 }} className="mt-20" style={{textAlign: 'center'}}>
          <ButtonGroup>
            
          </ButtonGroup>
        </FormItem>*/}
      </Panel>
		)
		const buttonGrop = (
			<div>
				<Button
		      type="danger"
		      style={{marginRight: '10px', display: !PickupStatus ? 'inlineBlock' : 'none'}}
		      onClick={() => {
		        this.state.depotPickupId && this.postDepotPickupRefuse(this.state.depotPickupId)
		      }}
		    >
		      审批拒绝
		    </Button>
		    <Button
		      type="primary"
		      style={{marginRight: '10px', display: !PickupStatus ? 'inlineBlock' : 'none'}}
		      onClick={() => {
		        this.state.depotPickupId && this.postDepotPickupPass(this.state.depotPickupId)
		      }}
		    >
		      审批通过
		    </Button>
		    <Button
		    	className={!PickupStatus?'DeLiveryButton':'DeLiveryButton ButtonRadius'}
		      onClick={() => {
		        this.props.goBack();
		      }}
		    >
		      取消返回
		    </Button>
	    </div>
		)
    return (
     <section className="OperatorList-page">
      	<DetailTemplate
	      	config = {this.props.config}
	      	title = {this.props.title}
	      	child={child}
	      	onCancle={this.props.goBack}
	      	onOk={this.handleSubmit}
	      	definedButton={buttonGrop}
	      />
     </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const StaffManageruuid = state => state.get("rts").get("uuid");
const getDepotPickup = state => state.get("rts").get("getDepotPickup");
const postDepotPickupPass = state => state.get("rts").get("postDepotPickupPass");
const postDepotPickupRefuse = state => state.get("rts").get("postDepotPickupRefuse");

const DeliveryOrderDetailDetailForm = Form.create()(DeliveryOrderDetail)

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  getDepotPickup,
  postDepotPickupPass,
  postDepotPickupRefuse,
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryOrderDetailDetailForm);
