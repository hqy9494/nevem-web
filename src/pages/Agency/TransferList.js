import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,Button,Modal,Table,Form,Input } from "antd";
import moment from "moment";
import uuid from "uuid";
import AsyncTable from "../../components/AsyncTable";
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const FormItem = Form.Item;
// import styles from "./Index.scss";
export class TransferList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	visible:false,
    	TransferDetail:[]
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }
	componentDidMount(){
	}
  componentWillReceiveProps(nextProps) {}
	getTransferDetail = (id) => {
		this.props.rts(
  	  {
  	    method: "get",
  	    url: `/PositionTransfers/${id}`,
  	  },
  	  this.uuid,
  	  "getTransferData",
  	  (res) => {
  	  	this.setState({visible:true,TransferDetail:res.item || [],searchList:res.item || []});
  	  }
  	);
	}
	searchClick = () =>{
		this.props.form.validateFields((err, values) => {
			const { TransferDetail,searchList } = this.state;
			values.name = values.name || "";
			values.code = values.code || "";
			let arr = [];
			for(let i in TransferDetail){
				if(!TransferDetail[i].terminal) continue;
				if(TransferDetail[i].terminal.name.indexOf(values.name)>=0 && TransferDetail[i].terminal.code.indexOf(values.code)>=0){
					arr.push(TransferDetail[i]);
				}	
			}
			this.setState({searchList:arr});
		})
	}
	resetSearch = () => {
		const { TransferDetail } = this.state;
		this.props.form.setFieldsValue({'name':"",'code':''},()=>{
    	this.setState({searchList:TransferDetail});
    });
	}
	closeModal = () => {
		this.props.form.setFieldsValue({'name':"",'code':''},()=>{
    	this.setState({visible:false});
    });
	}
  render() {
  	const { TransferDetail,visible,searchList } = this.state;
  	const {getFieldDecorator} = this.props.form;
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/PositionTransfers",
        where:{
          agent: true
        }
      },
      search: [
        {
          type: "relevance",
          field: "outAgentId",
          title: "转出商家",
          model: {
            api: "/Agents",
            field: "name"
          }
        },
        {
          type: "relevance",
          field: "inAgentId",
          title: "接受商家",
          model: {
            api: "/Agents",
            field: "name"
          }
        },
        {
          type: "date",
          field: "createdAt",
          title: "转移时间"
        },
        {
          type: "option",
          title: "类型",
          field: "type",
          options: [
            {title: "转入", value: "in"},
            {title: "转出", value: "out"}
          ]
        },
      ],
      columns: [
	      {
	        title: "转移时间",
	        dataIndex: "createdAt",
	        key: "createdAt",
	        type: "date",
	        sort: true
	      },
        {
          title: "转出商家",
          dataIndex: "outAgent",
          key: "outAgent",
          render:agent=><div>{agent.name}<br/>{agent.paymentPhone}</div>
        },
        {
          title: "接受商家",
          dataIndex: "inAgent",
          key: "inAgent",
          render:agent=>{
          	return <div>{agent.name}<br/>{agent.paymentPhone}</div>
          }
        },
        {
          title: "转移点位数",
          dataIndex: "itemCount",
          key: "itemCount"
        },
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          render: (text, record) => {
            switch (text) {
              case "out":
                return "转出";
              case "in":
                return "转入";
              default:
                break;
            }
          }
        },
        {
         title: "查看详情",
         key: "id",
         render: (text) => (
           <span>
             <Button
             	 size="small"
               className="buttonListFirst"
               onClick={() => {
               		this.getTransferDetail(text.id);
               }}
             >
               详情
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
      },
      config:this.props.config,
      title:this.props.title
    };
    const configDetail = {
    	rowKey:"id",
    	className:"publicTable",
    	locale:{
		    filterTitle: '筛选',
		    filterConfirm: '确定',
		    filterReset: '重置',
		    emptyText: '暂无数据'
		  },
    	dataSource:searchList || [],
    	columns:[
	    	{
	        title: "点位名称",
	        dataIndex: "position",
	        key: "position",
	        render:(text)=>text?text.name : ""
	      },
	      {
	        title: "设备",
	        dataIndex: "terminal",
	        key: "terminal",
	        render:(text)=>{
	        	if(text){
	        		return <div>{text.name}<span style={{color:"#ff6000"}}>（{text.code}）</span></div>
	        	}else{
	        		return <span style={{color:"#ff0000"}}>未绑定设备</span>
	        	}
	        }
	      },
    	],
    	
    }
    return (
      <section className="OrderManagement-page">
        <AsyncTable
          {...config}
        />
        <Modal
          title="转移点位详情"
          visible={visible}
          width={700}
          onOk={this.closeModal}
          onCancel={this.closeModal}
          okText="确认"
          cancelText="取消"
        >	
        	<Row gutter={24} className="AsyncSearchClass" style={{borderBottom:0}}>
	      		<Col span={8}>
	      			<FormItem
                {...formItemLayout}
                label="设备名称"
              >
	      				{getFieldDecorator('name')(<Input placeholder={`请输入设备名称`} onPressEnter={this.searchClick}/>)}
	      			</FormItem>
	      		</Col>
	      		<Col span={8}>
	      			<FormItem
                {...formItemLayout}
                label="设备编号"
              >
		      			{getFieldDecorator('code')(<Input placeholder={`请输入设备编号`} onPressEnter={this.searchClick}/>)}
		      		</FormItem>
	      		</Col>
	      		<Col span={8} style={{textAlign:'right',paddingBottom:'10px',paddingTop:'4px'}}>
		        	<Button type="primary" style={{marginRight:'10px'}} onClick={this.searchClick}>搜索</Button>
		        	<Button onClick={this.resetSearch}>重置</Button>
	        	</Col>
	      	</Row>
          <Table {...configDetail} />
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
const WrappeTransferList = Form.create()(TransferList);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeTransferList);
