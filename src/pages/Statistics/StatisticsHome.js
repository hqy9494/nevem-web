import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, DatePicker, Table,message  } from "antd";
import moment from "moment";
import uuid from "uuid";
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import StatisticsTable from "../../components/StatisticsTable";
import HeaderNav from "../../components/HeaderNav";
import OutPutExcel from "../../components/OutPutExcel";
import { getParameterByName } from '../../utils/utils';
const { RangePicker } = DatePicker;

export class StatisticsHome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      StatisticsData: null,
      params: null,
      dataSource: {},
      outPut:new OutPutExcel(props,uuid.v1()),
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  	const qParams = getParameterByName('q')? JSON.parse(decodeURIComponent(getParameterByName('q'))) : {};
    const params = qParams && qParams.endTime && qParams.startTime ?
	  {endTime:qParams.endTime,startTime:qParams.startTime}:
	  qParams.limit?{}:{endTime:moment().format('YYYY-MM-DD 23:59:59:999'),startTime:moment().format('YYYY-MM-DD 00:00:00:000')};
    this.getStatistics(params);
    this.setState({params});
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { getStatistics, getPositionSimple } = nextProps
    if (getStatistics && getStatistics[this.uuid]) {
    	this.setState({
    	  StatisticsData: getStatistics[this.uuid],
    	})
    }
  }

  onDateChange = (e,t) => {
  	const qParams = getParameterByName('q')? JSON.parse(decodeURIComponent(getParameterByName('q'))) : {};
  	const { path } = this.props.match;
  	let params = {};
    if(e.length){
    	params = Object.assign({},...qParams,
    		{
    			startTime: moment(e[0]).format('YYYY-MM-DD 00:00:00:000'),
    			endTime: moment(e[1]).format('YYYY-MM-DD 23:59:59:999')
    		});
    }
    this.setState({
      params,
      refreshTable: true
    },() => {
      this.getStatistics(params);
    })
  }

  getStatistics = (params = {}) => {
		params = JSON.parse(JSON.stringify(params));
		const newParams = {
			endTime:params.endTime?params.endTime+'+08:00':null,
			startTime:params.startTime?params.startTime+'+08:00':null
		}
    this.props.rts({
      method: 'get',
      url: '/Statistics/position/all',
      params: newParams
    }, this.uuid, 'getStatistics',() => {

    })
  }

  getPositionSimple = (params = {}) => {
    this.props.rts({
      method: 'get',
      url: '/Statistics/position/simple',
      params: params
    }, this.uuid, 'getPositionSimple',() => {
    })
  }
  toExcelData = ()=>{
  	const {outPut} = this.state;
    const qParams = getParameterByName('q')? JSON.parse(decodeURIComponent(getParameterByName('q'))) : {};
    let	timeParams = {limit:10000}
    qParams.endTime?timeParams.endTime = qParams.endTime+'+08:00':'';
    qParams.startTime?timeParams.startTime = qParams.startTime+'+08:00':'';
    let _headers = ['设备名称','属性','点位名称','设备编号','区域','购买盒数', '销售金额', '最后订单时间'];
    let excelObj = {path:'/Statistics/position/simple',params:timeParams};
    outPut.toExcelData(excelObj,res=>{
      let _data = [];
      res = res.data;
      for(let i in res){
        _data.push({'设备名称':res[i].terminal&&res[i].terminal.name || '','属性':res[i].agent.direct?'直营':'一般','点位名称':res[i].name||'','设备编号':res[i].terminal && res[i].terminal.code||'',
          '区域':res[i].place && (res[i].place.province + res[i].place.city||'' + res[i].place.district||''),
          '购买盒数':res[i].statistics&&res[i].statistics.totalCount,'销售金额':res[i].statistics&&res[i].statistics.totalPrice,
          '最后订单时间':res[i].statistics && res[i].statistics.lastOrderTime && moment(res[i].statistics.lastOrderTime).format('YYYY-MM-DD HH:mm:ss') || ''});
      }
      outPut.toExcelFile(_headers,_data,'统计列表.xlsx');
    })
  }
  render() {
    const { StatisticsData, params, dataSource } = this.state;
    
    const headerConfig = {
    	buttons: [
        {
          title: "导出EXCEL",
          onClick: () => {
            this.toExcelData();
          }
        }
      ],
    	config:this.props.config,
	    title:this.props.title
    }
    const config = {
      hasParams:params,
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Statistics/position/simple",
      },
      columns: [
        {
          title: "设备名称",
          dataIndex: "terminal.name",
          key: "terminal",
        },
        {
          title: "属性",
          dataIndex: "agent.direct",
          key: "agent.direct",
          render: (text, record, index) => record.agent && (record.agent.direct ? <span>直营</span> : <span>一般</span>)
        },
        {
          title: "点位名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "购买盒数",
          dataIndex: "statistics.totalCount",
          key: "totalCount",
          align:'right'
        },
        {
          title: "销售金额",
          dataIndex: "statistics.totalPrice",
          key: "totalPrice",
          align:'right'
        },
        {
          title: "最后订单时间",
          dataIndex: "statistics.lastOrderTime",
          key: "statistics.lastOrderTime",
          render: (text, record ,index) => <span>{ record.statistics.lastOrderTime && moment(record.statistics.lastOrderTime).format('YYYY-MM-DD HH:mm:ss') }</span>
        },
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      params: this.state.params,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      removeHeader:true
    };
    const child = (
    	<div className="AsyncContentPaddingBox">
    		<div style={{margin:'10px 0'}}>
            <RangePicker
              dateRender={(current) => {
                const style = {};
                if (current.date() === 1) {
                  style.border = '1px solid #1890ff';
                  style.borderRadius = '50%';
                }
                return (
                  <div className="ant-calendar-date" style={style}>
                    {current.date()}
                  </div>
                );
              }}
              value={Object.keys(params).length&&params.startTime&&params.endTime?[moment(params.startTime,'YYYY-MM-DD HH:mm:ss'),moment(params.endTime,'YYYY-MM-DD HH:mm:ss')]:false}
              locale={locale}
              renderExtraFooter={() => {}}
              onChange={this.onDateChange}
            />
          </div>
        <div className="statistics-header">
          <Row gutter={48} align="middle" justify="center" type="flex" style={{ height: '100%' }}>
            <Col span={8}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{StatisticsData && StatisticsData.positionCount}</div>
              <div>全部点位数量</div>
            </Col>
            <Col span={8}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{StatisticsData && StatisticsData.totalCount}</div>
              <div>购买盒数</div>
            </Col>
            <Col span={8}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{StatisticsData && StatisticsData.totalPrice}</div>
              <div>销售金额</div>
            </Col>
          </Row>
        </div> 
      </div> 
    )
    return (
      <section className="StatisticsHome-page">
      	<HeaderNav {...headerConfig}/>
      	{child}
      	<StatisticsTable
          {...config}
        />
      </section>
    )
  }
}
const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const getStatistics = state => state.get("rts").get("getStatistics");
const getPositionSimple = state => state.get("rts").get("getPositionSimple");

const mapStateToProps = createStructuredSelector({
  getStatistics,
  UUid,
  getPositionSimple
});

export default connect(mapStateToProps, mapDispatchToProps)(StatisticsHome);
