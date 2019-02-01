import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,  Divider, Popconfirm,Button,Modal,Form,Input,message,InputNumber,Select } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import checkInput from "../../components/CheckInput";
import "./AgencyList.scss";
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const FormItem = Form.Item;
export class AgencyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {visible:false,isPriceSet:false,getId:'',refreshTable:false,isMoneySet:false,listDetail:{},batchList:{}};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  	this.getBatchList();
  }

  componentWillReceiveProps(nextProps) {}
	getBatchList = ()=>{
		this.props.rts(
         {
           method: "get",
           url: `/Batches`,
         },
         this.uuid,
         'batchList', (res) => {
         		for(let i in res.data){
         			if(res.data[i].active){
         				return this.setState({refresh: true,batchList:res.data[i]});
         			}
         		}
           
         }
       );
	}

  // 启禁用
  confirm(id, bool) {
    this.props.rts(
      {
        method: "put",
        url: `/accounts/${id}/${bool}`
      },
      this.uuid,
      'pageInfo', () => {
        this.setState({refreshTable: true})
      }
    );
  }
  
  
	check=(id)=>{
		this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      	let postData = {};
      	let postPath = '';
      	if(this.state.isMoneySet){
      		if(!checkInput({value:values.phone,type:'mobile-phone',msg:'手机号格式不正确！'})){
      			return;
      		}
					postData = {phone:values.phone};   		
					postPath = `/Agents/${id}/phone`;  		
      	}else{
      		postData = {...values,agentId:id};
      		postPath = `/AgentBatchPrices`; 
      	}
					this.props.rts(
	          {
	            method: "post",
	            url: postPath,
	            data:postData
	          },
	          this.uuid,
	          "getCheckId",
	          () => {
	            this.setState({ visible: false,refreshTable:true,isPriceSet:false,isMoneySet:false});
	            message.success("修改成功！");
						}
	       );
      }
    });
	}
  // 删除
  // remove(id) {
  //   this.props.rts(
  //     {
  //       method: "delete",
  //       url: `/HomePages/${id}`
  //     },
  //     this.uuid,
  //     "removeHome",()=>{
  //       this.setState({refreshTable:true})
  //     }
  //   );
  // }

  render() {
  	const { getFieldDecorator } = this.props.form;
  	const { isMoneySet,listDetail,batchList,isPriceSet } = this.state;
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Agents",
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to(`${this.props.match.path}/detail/add`);
          }
        }
      ],
      search: [
      	{
      	 	title: "代理商名称",	
      		type:'field',
      		field:'name'
      	},
      	{
      	 	title: "创建时间",	
      		type:'date',
      		field:'createdAt'
      	},
      	{
      	 	title: "代理商类型",	
      		type:'option',
      		field:'direct',
      		options:[
      			{title: "直属代理", value: true},
      			{title: "一般代理", value: false}
      		]
      	},
      
      ],
      columns: [
        {
          title: "代理商名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "代理商类型",
          dataIndex: "direct",
          key: "direct",
          render: text => {
             if (text) {
               return <span className="statusBlueOne">直属代理</span>;
             } else {
               return <span className="statusBlueTwo">一般代理</span>;
             }
           }
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          render: text => {
            switch(text) {
              case 'enabled':
                return <span className="statusGreenTwo">启用</span>
              case 'disable':
                return <span className="statusRedOne">禁用</span>
              default:
                return;
            }
           }
        },
        {
          title: "基础操作",
          // key: "handle",
          render: (text, record) => (
            <div>
               <Button
                 className="buttonListFirst"
                 size="small"
                 style={{marginRight: '5px'}}
                 onClick={() => {
                   this.props.to(`${this.props.match.path}/detail/${record.id}`);
                 }}
               >
                详情
              </Button>
							<Button
                 className="buttonListSecond"
                 size="small"
                 style={{marginRight: '5px'}}
                 onClick={() => {
                 		this.setState({visible: true,listDetail:record,isMoneySet:true,isPriceSet:false});
                 		this.props.form.resetFields();
                 }}
               >
                代理验证设置
              </Button>
              <Button
                 className="buttonListThird"
                 size="small"
                 style={{marginRight: '5px'}}
                 onClick={() => {
                 		this.setState({visible: true,isMoneySet:false,listDetail:record,isPriceSet:true});
                 		this.props.form.resetFields();
                 }}
               >
                进货价格
              </Button>
              {/*record.status === 'enabled' ? (
                <Popconfirm
                  title="确认禁用该用户?"
                  onConfirm={() => {
                    this.confirm(record.id, 'disable');
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
              ) : record.status === 'disable' ? (
                <Popconfirm
                  title="确认启用该用户?"
                  onConfirm={() => {
                    this.confirm(record.id, 'enabled');
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <Button className="buttonListSecond" size="small">启用</Button>
                </Popconfirm>
              ) : null*/}
            </div>
          )
        },
        {
          title: "点位操作",
          // key: "handle",
          render: (text, record) => (
            <span>
               <Button
                 className="buttonListFirst"
                 size="small"
                 style={{marginRight: '5px'}}
                 onClick={() => {
                   this.props.to(`/Site/SiteManagement?id=${record.id}`);
                 }}
               >
              场地管理
              </Button>
              <Button
                 className="buttonListSecond"
                 size="small"
                 style={{marginRight: '5px'}}
                 onClick={() => {
                    this.props.to(`/Site/PointManagement?id=${record.id}`);
                 }}
               >
                点位管理
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

    return (
      <section>
        <TableExpand
          {...config}
        />
        <Modal
        	className="AgencyListContainer"
          visible={this.state.visible}
          title={isMoneySet?"代理验证设置":'进货价格'}
          okText="确定"
          cancelText="取消"
          onOk={() => {
            this.check(listDetail.id);
          }}
          onCancel={() => {
          	this.props.form.resetFields();
            this.setState({visible: false});
          }}

        >
          <Form layout="vertical">
	          {isMoneySet?
          		<FormItem {...formItemLayout} label="代理验证设置号码："  >
	              {getFieldDecorator("phone", {
	                rules: [{
	                  required: isMoneySet?true:false, message: '必填项',
	                }],
	                initialValue: listDetail?listDetail.paymentPhone:''
	              })(
	                <Input placeholder="请输入代理验证设置号码"/>
	              )}
	            </FormItem> 
	            :
	            <div>
			          	<FormItem label={`批次名称`} {...formItemLayout} >
                    {getFieldDecorator(`batchId`, {
                      rules: [{ required: isPriceSet?true:false, message: '请选择批次名称' }],
                      initialValue: batchList && batchList.id
                    })(
                      <Select style={{width: '100%'}}>
                      	<Option value={batchList && batchList.id}>{batchList && batchList.name}</Option>
                      </Select>
                    )}
                  </FormItem>
			            <FormItem {...formItemLayout} label="进货价格："  >
			              {getFieldDecorator("price", {
			                rules: [{
			                  required: isPriceSet?true:false, message: '必填项',
			                }],
			                initialValue: listDetail.batchPrice && listDetail.batchPrice[0] && listDetail.batchPrice[0].price
			              })(
			                <InputNumber style={{width: '100%'}} placeholder="请输入进货价格" formatter={value=>`${value}`.replace(/[^\d^\.?]+/g,'')}/>
			              )}
		            </FormItem>
            </div>
	          }  
          </Form> 
        </Modal>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});
const WrappeAgencyList = Form.create()(AgencyList);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeAgencyList);
