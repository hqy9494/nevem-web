import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Transfer, Modal, Popconfirm,message } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable"

export class PointManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshTable: false,
      visible:false
    };
    this.uuid = uuid.v1();
  }
	getPointData = () =>{

    this.props.rts({
      method: 'get',
      url: '/Positions'
    }, this.uuid, 'getPoint',res=>{

    	/*for(let i in res.data){
    		this.props.rts({
		      method: 'get',
		      url: `/Places/${res.data[i].placeId}`
		    }, this.uuid, 'getPlaces',result=>{
		    	 res.data[i].placeName = result.name;
		    });
    	}*/
    });
 	 }
	componentWillMount() {

//	this.getPointData();
  }
  componentDidMount() {
//	this.getPointData();
//  this.getPoint()
  }
  componentWillReceiveProps(nextProps) {

  }
  changeActive=(id,status)=>{
  	this.props.rts({
      method: 'post',
      url: `/Positions/${id}/active`,
      data:{bol:status}
    }, this.uuid, 'getPoint',res=>{
    	this.setState({refreshTable:true});
			message.success('修改成功！');
    });
  }
  render() {
//  const { terminalsData, terminalsByIdData } = this.state
//  const formatData = this.handleFormat(terminalsData)

//		console.log(getPointData,'getPointData');
//		console.log(this.props.rts,'this.props.rts');
		const config = {
			hasParams:{"id":this.props.params.id},
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Positions",
        include:["place", "terminal"],
        where:{"placeId":this.props.params.id}
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to('/Site/PointManagement/0')
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "点位名称"
        },
        {
          type: "relevance",
          field: "placeId",
          title: "所在场地",
          model: {
            api: "/Places",
            field: "name"
          }
        },
        {
          type: "option",
          field: "active",
          title: "点位状态",
          options: [
            { title: "开启中", value: true},
            { title: "关闭中", value: false}
          ]
        },
        {
          type: "relevance",
          field: "terminalId",
          title: "设备名称",
          model: {
            api: "/Terminals",
            field: "name"
          }
        }
      ],
      columns: [
        {
          title: "点位名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "所在场地",
          dataIndex: "place.name",
          key: "terminalCount"
        },
        {
          title: "设备名称",
          dataIndex: "terminal.name",
          key: "terminal.name",
          render: (text, record) => (text ? <span>{text}</span> : <span>--</span>)
        },
        {
          title: "设备编号",
          dataIndex: "terminal.code",
          key: "terminal.code",
          render: (text, record) => (text ? <span>{text}</span> : <span>--</span>)
        },
        {
          title: "状态",
          dataIndex: "active",
          key: "active",
          render: (text, record) => {
          	return text?<span className="statusBlueTree">开启中</span>:<span className="statusRedOne">关闭中</span>;
          }
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <div>
              <Button
                className="buttonListFirst"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`${this.props.match.path}/${text.id}`)
                }}
              >详情
              </Button>
              <Button
                size="small"
                className="buttonListSecond"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`${this.props.match.path}/pic/${record.id}`);
                }}
              >
                点位图片
              </Button>
              <Popconfirm placement="top" title={record.active?'确定要禁用点位吗？':'确定要开启点位吗？'} onConfirm={()=>{this.changeActive(record.id,!record.active)}} okText="确定" cancelText="关闭">
	              <Button
	                size="small"
	                className={record.active?"buttonListDanger":'buttonListThird'}
	                style={{marginRight: '5px'}}
	              >
	              	{record.active?'禁用':'启动'}	              
	              </Button>
        			</Popconfirm>
              
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
    }

    return (
      <section className="StrategyManagement-page">
        <TableExpand
          {...config}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(PointManagement);
