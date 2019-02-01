import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,Tabs,Table,Popconfirm,Button } from "antd";
import {Panel} from "react-bootstrap";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import { getParameterByName } from '../../utils/utils';
// import styles from "./Index.scss";
const TabPane = Tabs.TabPane;

export class OrderManagement extends React.Component {

  constructor(props) {
    super(props);
    // neq：排除，inq：等于
    this.state = {
      screening: '',
      tabsKey:''
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  	const params = getParameterByName('q')? JSON.parse(decodeURIComponent(getParameterByName('q'))) : {};
    this.setState({screening:this.callback(params.tabsKey)});
  	/*if(Object.keys(this.props.params).length===0)	localStorage.removeItem('AgentWithdraws');
  	let obj = localStorage.AgentWithdraws?JSON.parse(localStorage.AgentWithdraws):{};
  	//console.log(obj.type,'obj.type');
  	let screening = obj.type?obj.type:'created';
  	let tabsKey = obj.type === 'created' || obj.type == undefined?"notAudit":"approved";
  	this.setState({screening,tabsKey});*/
  }

  componentWillReceiveProps(nextProps) {}
 	callback = (key = "notAudit") =>	key === "notAudit"?'created':{"neq":"created"};
  confirm(id, bool) {
   this.props.rts(
     {
       method: "post",
       url: `/AgentWithdraws/${id}/${bool ? 'pass' : 'refuse'}`,
     },
     this.uuid,
     'AgentWithdraws', () => {
       this.setState({refreshTable: true})
     }
   );
  }


  render() {
    const {screening} = this.state;
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/AgentWithdraws",
        // total: "/Orders/count"
        include: "agent",
        where:{"agent":true,"status":screening}
      },
      // buttons: [
      //   {
      //     title: "批量导出"
      //   }
      // ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      config:this.props.config,
	    title:this.props.title
    };
    const tabsConfig = {
    	search: [
        {
          type: "field",
          field: "name",
          title: "真实姓名"
        },
        {
          type: "field",
          field: "card",
          title: "支付宝/微信账号"
        },
        {
          type: "date",
          field: "createdAt",
          title: "申请时间"
        },
        {
        	type: "number",
          field: "count",
          title: "提现金额"
        },
        {
          type: "relevance",
          field: "agentId",
          title: "代理商名称",
          model: {
            api: "/Agents",
            field: "name"
          }
        },
      ],
      columns: [
        {
          title: "代理商名称",
          dataIndex: "agent.name",
          key: "agent.name"
        },
        {
          title: "真实姓名",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "支付宝/微信账号",
          dataIndex: "card",
          key: "card"
        },
        {
          title: "申请时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "提现金额",
          dataIndex: "count",
          key: "count",
          align:'right'
        },
        /*{
          title: "提现前金额",
          dataIndex: "price",
          key: "2",
          align: "right",
          sort: true

        },*/

        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          render: (text, record) => {
            switch (text) {
              case "created":
                return <span className="statusBlueTree">待审核 </span>
              case "passed":
                return <span className="statusGreenOne">同 意</span>
              case "refused":
              	return <span className="statusRedOne">拒 绝</span>
              default:
                break;
            }
          }
        },
        {
          title: "审核操作",
          key: "handle",
          render: (text, record) =>
          	{if(record.status==='created'){
          		return <span>
			          <Popconfirm
			          title="确定同意本次审核?"
			          onConfirm={() => {
			            this.confirm(record.id, true);
			          }}
			          okText="是"
			          cancelText="否"
			            >
			            <Button className="buttonListFirst" size="small" style={{marginRight: '5px'}}>同意</Button>
			          </Popconfirm>
	             <Popconfirm
	               title="确定拒绝本次审核?"
	               onConfirm={() => {
	                 this.confirm(record.id, false);
	               }}
	               okText="是"
	               cancelText="否"
	             >
	                    <Button className="buttonListDanger" size="small" style={{marginRight: '5px'}}>拒绝</Button>
	            </Popconfirm>

	           </span>
          	}else{
          		return	<Button disabled={true} className="unUseButton" size="small" style={{marginRight: '5px'}}>无操作</Button>
          	}}
        }
      ]
    }
    const searchApproved = [
    	...tabsConfig.search,
    	{
	      type: "option",
	      title: "账单状态",
	      field: "status",
	      options: [
	        { title: "同 意", value: "passed" },
	        { title: "拒 绝", value: "refused" },
	      ]
	    }
    ]
    return (
      <section className="OrderManagement-page">
        {/*<div className="project-title">账单审核</div>
        <Panel>
          <Tabs defaultActiveKey={this.state.tabsKey} onChange={this.callback}>
            <TabPane tab="待审核" key="notAudit">*/}
              <TableExpand
                {...config}
                isTabs={true}
			          defaultKey="notAudit"
			          onTabsClick={(key)=>{
			          	this.setState({screening:this.callback(key),refreshTable:true});
			          }}
			          TabsData={[{key:"notAudit",title:'待审核',data:tabsConfig},{key:"approved",title:'已审核',data:{columns:tabsConfig.columns,search:searchApproved}}]}
              />
            {/*</TabPane>
            <TabPane tab="已审核" key="approved">
              <TableExpand
                {...config}
                path={`${this.props.match.path}`}
                replace={this.props.replace}
                refresh={this.state.refreshTable}
                onRefreshEnd={() => {
                  this.setState({refreshTable: false});
                }}
              />
            </TabPane>
          </Tabs>
        </Panel>*/}


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

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagement);
