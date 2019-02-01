import React from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import classNames from 'classnames';
import { Table, Button,Spin,Icon,Tabs } from 'antd';
import moment from '../Moment';
import './style.scss';
import locale from 'antd/lib/locale-provider/zh_CN';
import HeaderNav from "../HeaderNav";
const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;
import { getParameterByName } from '../../utils/utils';

export default class TableExpand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      data: [],
      total: 0,
      searchWhere:[],
      skip:0,
      isRender:false,
      loading:false
    };
    this.getAll = props.getAll ? true : false;
  }

  componentWillMount() {
//	this.forSearchList();
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.refresh && nextProps.refresh === true) {
      this.getData(() => {
        this.props.onRefreshEnd && this.props.onRefreshEnd();
      }, nextProps || this.props,true);
    }
  }
  shouldComponentUpdate(nextProps, nextState){

  	const {isRender} = nextState;
  	return isRender?true:false;
  	
  }
  componentDidUpdate(){

  	this.setState({isRender:false});
  }
  componentWillUnmount() {
    this._isUnmounted = true;
  }
  componentDidMount(){
  	this.searchList = {};
		this.setState({isRender:false});
  }
  //包装setState
  updateState(newState, cb) {
    if (this._isUnmounted) {
      return;
    }
    this.setState(newState, cb);
  }
  isArray(obj){ 
		return (typeof obj=='object')&&obj.constructor==Array; 
	}
	//根据头部详情获取数据
  getData = (cb, props,isRefresh) => {
  	this.params = getParameterByName('q')? JSON.parse(decodeURIComponent(getParameterByName('q'))) : {};
  	isRefresh?this.params.skip = 0:'';
  	const {skip,order,searchs} = this.params;
		this.updateState({ loading: true,skip,isRender:true},()=>{
			const { api, uuid,hasParams,path } = props || this.props;
			const {  pageSize } = this.state;
			const params = Object.assign({},hasParams,{limit:pageSize,skip:skip || 0});
			let newParams = JSON.parse(JSON.stringify(params));
			newParams.startTime?newParams.startTime += '+08:00':'';
			newParams.endTime?newParams.endTime += '+08:00':'';
			//判断有无分页
			api.rts(
			  {
			    method: 'get',
			    url: api.data,
			    params: newParams
			  },
			  api.uuid,
			  'data',
			  (result = {}) => {
				  	this.updateState({
				  	  data: result.data ||	result,
				  	  total: result.total || result.count,
				  	  isRender:true,
				  	  loading:false
				  	});
				  	history.replaceState(null,null,'#'+path+`?q=${encodeURI(JSON.stringify(params))}`);
				    cb && cb();
			  });
		});
  }
	//监听底部page事件
  onChange = (page, pageSize) => {
    this.jumpUrl({
      skip: (page - 1) * pageSize
    });
  };
	
	//更改头部地址栏信息（无跳转）
  jumpUrl = (newParams = {}) => {
    const params = Object.assign({}, this.params, newParams);
    history.replaceState(null,null,'#'+this.props.path+`?q=${encodeURI(JSON.stringify(params))}`);
    this.getData();
  };
	//判断头部是否带上参数hasParams并且头部参数不为空返回
	/*jdHasParams = () => {
		const {	hasParams = {}	} = this.props;
		if(Object.keys(hasParams).length){
			let paramsStr = '';
      for (let i in hasParams) {
        if (
          hasParams[i] === undefined ||
          hasParams[i] === null ||
          hasParams[i] === ''
        ) {
        	return false;
        }
        paramsStr += '&' + i + '=' + hasParams[i];
      }
     return paramsStr;
		}else{
			return false;
		}
	}*/
//切换时间显示和金钱显示
	formatValue = (type, value) => {
    switch (type) {
      case 'date':
        return moment(value).format('YYYY-MM-DD HH:mm');
      case 'fromNow':
        return moment(value).fromNow();
      case 'penny':
        return Math.floor(value / 100);
      default:
        return value;
    }
	};
	returnRender = (columns,search)=>{
		const {  buttons, pages ,path,child } = this.props;
		const { data, total, pageSize,skip } = this.state;
    	let pagination = {pageSize,total,current:Math.ceil(skip / pageSize + 1),onChange:this.onChange,showQuickJumper:true,locale:locale.Pagination};
		return(
			<div>
				{child}
		        <Spin tip="加载中..." spinning={this.state.loading} size="large" >
			    		<Table
			    		  rowKey="id"
			    		  bordered
			    		  columns={columns}
			    		  dataSource={data}
			    		  pagination={this.getAll ? false : pages ? false : pagination}
			    		  className="TableExpand publicTable"
			    		  locale={{
			    		    filterTitle: '筛选',
			    		    filterConfirm: '确定',
			    		    filterReset: '重置',
			    		    emptyText: '暂无数据'
			    		  }}
			    		/>
		        </Spin>
			</div>
		)
	}
  render() {

  const { config,title,buttons,columns,removeHeader,boxStyle } = this.props;
	const { data } = this.state;
    return (
    	<div className="AsyncTableContainer">
	      <div className="AsyncTable" style={boxStyle}>
    			{removeHeader?'':<HeaderNav
      			buttons={buttons}
      			config={config}
	          	title={title}
	          	data={data}
	      	/>}
	    		{this.returnRender(columns)}
	      </div>
	    </div> 
    );
  }
}
