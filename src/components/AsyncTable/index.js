import React from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import classNames from 'classnames';
import { Table, Button,Spin,Icon,Tabs } from 'antd';
import moment from '../Moment';
import AsyncSearch from '../AsyncSearch';
import './style.scss';
import locale from 'antd/lib/locale-provider/zh_CN';
import HeaderNav from "../../components/HeaderNav";
import { getRegular } from '../CheckInput';
import { getParameterByName } from '../../utils/utils';
const ButtonGroup = Button.Group;
const TabPane = Tabs.TabPane;
const $changeTableWidth = 1300;//屏幕为1300以下切换成overflow-x：auto

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
      loading:false,
      $width:document.querySelector('body').offsetWidth//获取屏幕宽度
    };
    this.getAll = props.getAll ? true : false;
  }

  componentWillMount() {
		this.forSearchList();
    this.getData();
    this.addResize();
  }
	addResize = () =>{
		let that = this;
		window.addEventListener("resize",null);
		window.addEventListener("resize", function(){
			let {$width} = that.state;
			let $nextWidth =  document.querySelector('body').offsetWidth;
			if( $width <= $changeTableWidth && $nextWidth > $changeTableWidth){
				that.updateState({$width:$nextWidth,isRender:true});
			}else if($width > $changeTableWidth && $nextWidth <= $changeTableWidth){
				that.updateState({$width:$nextWidth,isRender:true});
			}else{
				that.updateState({$width:$nextWidth,isRender:true});				
			}
		});
	}
  componentWillReceiveProps(nextProps) {
    if (!this.props.refresh && nextProps.refresh === true) {
      this.getData(() => {
        this.props.onRefreshEnd && this.props.onRefreshEnd();
      }, nextProps || this.props);
    }else if(this.props.rowSelection){
    	this.setState({isRender:true});
    }
  }
  shouldComponentUpdate(nextProps, nextState){
		const {isRender} = nextState;
  	return isRender;
  	
  }
  componentDidUpdate(){
  	this.updateState({isRender:false})
  }
  componentWillUnmount() {
    this._isUnmounted = true;
  }
  componentDidMount(){
  	this.searchList = {};
  	this.updateState({isRender:false})
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
  //判断用哪里的search
  getSearchWhere = (params) =>{
  	const {  isTabs,TabsData,search,defaultKey } = this.props;
  	const { tabsKey = defaultKey } = params;
  	let searchList = [];
  	if(isTabs){
  		for(let i in TabsData){
  			if(TabsData[i].key===tabsKey){
  				searchList = TabsData[i].data.search;
  				break;
  			}
  		}
  	}else{
  		searchList = search;
  	}
  	return searchList;
  }
  //遍历search，找出search中存在value的值
  forSearchList = () =>{
		const { hasInitValue } = this.props;
  	if(!hasInitValue)return;
  	const params = getParameterByName('q')? JSON.parse(getParameterByName('q')) : {};
  	let { searchs=[] } = params;
  	let getSearch = this.getSearchWhere(params);
  	let isChange = false;
  	const paramsRturn = this.jdHasParams();
  	
  	for(let i in getSearch){
  		if(getSearch[i].values){
  			if(searchs.every((element)=>element.field!==getSearch[i].field)){
  				searchs.push(getSearch[i])
  				isChange = true;
  			}
  		}
		}
  	if(isChange){
  		params.searchs = searchs;
  		const toStringParams = `?q=${encodeURIComponent(JSON.stringify(params))}`;
  		if (paramsRturn) {
  			history.replaceState(null,null,'#'+this.props.path+toStringParams + paramsRturn);
  		} else {
  		  history.replaceState(null,null,'#'+this.props.path+toStringParams);
  		}
  	}
  }
  //返回的数据生成所需的数组
	getResultToArray = (typeProps = 'data',res,isEditId) =>{
		let data = [];
		if(!this.isArray(res)){
			if(this.isArray(typeProps)){
				for(let i in typeProps){
					res = res[typeProps[i]]
				}
				data = res;
			}else{
				data = res[typeProps]
			}
		}else{
			data = res;
		}	
		if(isEditId){
			data = data.map((v,i)=>{return {...v,id:i}})
		}
		return data || res;
	}
	//根据头部详情获取数据
  getData = (cb, props) => {
		this.params = getParameterByName('q')? JSON.parse(getParameterByName('q')) : {};
  	const {skip,order,searchs,limit = 10} = this.params;
		this.updateState({ loading: true,skip,pageSize:limit,searchWhere:searchs||[],isRender:true},()=>{
		const { api } = props || this.props;
		const { skip, pageSize,searchWhere } = this.state;
		let filter = null;
		/*if(hasParams){
			//判断是否有参数并且需要分页请求接口
			params = Object.assign({},hasParams,needParamsPage?{limit:pageSize,skip:skip || 0}:{});
		}else{
		}*/
		filter = {
			where:Object.assign({},api.where,this.searchsToWhere(searchWhere)),
			limit: pageSize,
		  skip,
			order:order || 'createdAt DESC',
			include: api.include ||''
		}			
		if(this.getAll){
			filter.limit = 10000;
			filter.skip = 0;
		}
		if(api.noFilter){
			api.params = api.params || {};
			api.params.skip = skip || 0;
			api.params.limit = pageSize;
			api.params.order = order || 'createdAt DESC';
		}
		//判断有无分页
		api.rts(
		  {
		    method: 'get',
		    url: api.data,
				params:Object.assign({},api.noFilter?{}:{filter},api.params?api.params:{}),
				error:(error)=>{
					if(api.error && typeof api.error === "function"){
						api.error(error);
					}
					this.updateState({
						isRender:true,
						loading:false
					});
				}
		  },
		  api.uuid,
		  'data',
		  (result = {}) => {
		  	let totalObj = Object.assign({},{where:filter["where"]} ||{})
		  	if(api.total){
		  		api.rts(
		  			{
					    method: 'get',
					    url: api.total,
					    params: totalObj
					  },
					  api.uuid,
					  'total',
					  (total = {}) => {
					  	this.updateState({
					  	  data: this.getResultToArray(api.typeProps,result,api.isEditId),
					  	  total: total.total || total.count || total,
					  	  isRender:true,
					  	  loading:false
					  	});
					  	cb && cb();
					  }
		  		)
		  	}else{
			  	this.updateState({
			  	  data: this.getResultToArray(api.typeProps,result,api.isEditId),
			  	  total: result.total || result.count,
			  	  isRender:true,
			  	  loading:false
			  	});
			    cb && cb();
		  	}
		  });
		});
  }
  //解析字符串以逗号转换成数组
  stringToArray(str){
  	const arr = str.split(',');
		for(let i in arr){
			if(arr[i]==='null'){
				arr[i] = null;
			}else if(getRegular('number').test(arr[i])){
				arr[i] = Number(arr[i]);
			}
		}
		return arr;
  }
 	getIntersect(arr1 = [],arr2 = []){
 		let set1 = new Set([...arr1]);
		let set2 = new Set([...arr2]);
		let intData = new Set([...set1].filter( x => set2.has(x)));
		return  intData;
 	}
	//解析search的信息
  searchsToWhere = (searchs = []) => {
		let where = {};
		let hasOr = false;
		searchs.map(s => {
			if(s.values===undefined || s.values==='')return;
			if(s.add){
				for(let x in s.add){
					where[x] = s.add[x];
				}
			}
			switch (s.type){
				case 'field':
					for(let i in s.change){
						if(s.change[i].name === s.values){
							s.values = s.change[i].to;
						}
					}
					where[s.field] = s.like?{like: `%${s.values}%`}:s.values;
				break;
				case 'relevance':
					where[s.fieldName || s.field] = s.values;
					/*if(where[s.fieldName]){
						where[s.fieldName] = {
							inq: [...this.getIntersect(s.values.value,where[s.fieldName].inq)]
						}
					}else{
						where[s.fieldName?s.fieldName:s.field] = {
							inq: [...s.values.value]
						}						
					}*/
					/*if(where[s.fieldName]){
						where[s.fieldName] = {
							inq: [...this.getIntersect(s.values.value,where[s.fieldName].inq)]
						}
					}else{
						where[s.fieldName?s.fieldName:s.field] = {
							inq: [...s.values.value]
						}						
					}
					if(s.changeType==='field'){
						for(let i in s.change){
							if(s.change[i].name === s.values.title){
								where[s.fieldName?s.fieldName:s.field] = s.like?{like: `%${s.change[i].to}%`}:s.change[i].to;
							}
						}
					}*/
					
				break;
				case 'unrelevance':
					if(where[s.fieldName]){
						where[s.fieldName] = {
							inq: [...this.getIntersect(s.values.value,where[s.fieldName].inq || [where[s.fieldName]])]
						}
					}else{
						where[s.fieldName] = {
							inq: [...s.values.value]
						}						
					}
				break;
				case 'optionRelevance':
					if(where[s.fieldName]){
						where[s.fieldName] = {
							inq: [...this.getIntersect(s.values.value,where[s.fieldName].inq || [where[s.fieldName]])]
						}
					}else{
						where[s.fieldName?s.fieldName:s.field] = {
							inq: [...s.values.value]
						}						
					}
				break;
				case 'numberRelevance':
					if(where[s.fieldName]){
						where[s.fieldName] = {
							inq: [...this.getIntersect(s.values.value,where[s.fieldName].inq  || [where[s.fieldName]])]
						}
					}else{
						where[s.fieldName?s.fieldName:s.field] = {
							inq: [...s.values.value]
						}						
					}
				break;
				case 'areaRelevance':
					if(where[s.fieldName]){
						where[s.fieldName] = {
							inq: [...this.getIntersect(s.values.value,where[s.fieldName].inq  || [where[s.fieldName]])]
						}
					}else{
						where[s.fieldName?s.fieldName:s.field] = {
							inq: [...s.values.value]
						}						
					}
				break;
				case 'area':
					if(s.values.length){
						for(let j in s.values){
							where[s.fieldName[j]] = s.values[j];
						}
					}
				break;
				case 'option':
					if(s.values.inq){
						where[s.field] ={inq:this.stringToArray(s.values.value)};
					}else if(s.values.or){
						hasOr = true;
						const arr = this.stringToArray(s.values.value);
						if(s.values.fieldName){
							const	field = s.values.fieldName.split(',');
							where.or = [];
							for(let i in arr){
								where.or.push({[field[i]]:arr[i]});
							}
						}else{
							where.or = [];
							for(let i in arr){
								where.or.push({[s.field]:arr[i]});
							}
						}
					}else if(s.isValueArray){
						where[s.field] = [s.values.value];					
					}else{
						where[s.field] = s.values.value;	
					}
				break;	
				case 'number':
					if(this.isArray(s.values)) {
						if(s.values[0]!==null && s.values[1]!==null) {
							where[s.field] = {
								between: [s.values[0], s.values[1]]
							};
						} else if(s.values[0]!==null) {
							where[s.field] = {
								gt: s.values[0]
							};
						} else if(s.values[1]!=null) {
							where[s.field] = {
								lt: s.values[1]
							};
						}
					}
				break;
				case 'date':
					if(s.values && s.values.constructor === Object) {
						if(s.values.startDate && s.values.endDate) {
							where[s.field] = {
								between: [s.values.startDate+' 00:00+08:00', s.values.endDate+' 23:59+08:00']
							};
						} else if(s.values.startDate) {
							where[s.field] = {
								gt: s.values.startDate+' 00:00+08:00'
							};
						} else if(s.values.endDate) {
							where[s.field] = {
								lt: s.values.endDate+' 23:59+08:00'
							};
						}
					}
				break;
				default:
					break;
			}
		});
		if(hasOr){
			let obj = [];
			for(let i in where){
				obj.push({[i]:where[i]});
			}
			let result = {and:[...obj]};
			return	result;
		}
		return where;
	};
	//监听底部page事件
  onChange = (page, pageSize) => {
    this.jumpUrl({
      skip: (page - 1) * pageSize
    });
  };
  //改变数据数量
  onShowSizeChange = (page, pageSize) =>{
  	this.jumpUrl({
			limit:pageSize,
			skip:0
   	});
  }
	//sort排序，时间和价格有效
  dealColumns = columns => {
  	const { order = '' } = this.params;
    const orderArr = order.split(' '); 
    return columns.map(c => {
      if (c.type) {
        c.render = (text, record) => (
          <span> {this.formatValue(c.type, text)} </span>
        );
      }
      if (c.sort) {
        c.title = (
          <div
            className={classNames('tableExpand-sort-th', {
              'tableExpand-sort-th-no': orderArr[0] !== c.dataIndex,
              'tableExpand-sort-th-asc':
                orderArr.length === 2 &&
                orderArr[0] === c.dataIndex &&
                orderArr[1] === 'ASC',
              'tableExpand-sort-th-desc':
                orderArr.length === 2 &&
                orderArr[0] === c.dataIndex &&
                orderArr[1] === 'DESC'
            })}
            onClick={() => {
              let newOrder = '';
              if (orderArr.length === 2 && orderArr[0] === c.dataIndex) {
                if (orderArr[1] === 'ASC') {
                  newOrder = `${c.dataIndex} DESC`;
                }
              } else {
                newOrder = `${c.dataIndex} ASC`;
              }
              this.jumpUrl({
                order: newOrder
              });
            }}
          >
            {c.title}
          </div>
        );
      }
      return c;
    });
  };
	//更改头部地址栏信息（无跳转）
  jumpUrl = (newParams = {}) => {

  	const { path } = this.props;
    if(newParams.searchs){
    	this.params.skip = 0;  	
    }else if(newParams.tabsKey || newParams.tabsKey===0){
    	this.params.skip = 0;
    	this.params.searchs = [];
    	const params = Object.assign({}, this.params,newParams);
    	history.replaceState(null,null,'#'+path+`?q=${encodeURIComponent(JSON.stringify(params))}`);
    	this.forSearchList()
    	return;
    }
    
    const params = Object.assign({}, this.params, newParams);
    const paramsRturn = this.jdHasParams();
		const toStringParams = `?q=${encodeURIComponent(JSON.stringify(params))}`;
    if (paramsRturn) {
    	history.replaceState(null,null,'#'+path+toStringParams + paramsRturn);
    } else {
      history.replaceState(null,null,'#'+path+toStringParams);
		}
    this.getData();
  };
  //重置
	searchReset = () => {
		const { path } = this.props;
		let  params  = this.params;
		params.skip = 0;
		params.limit = 10;
		params.searchs = [];
		const paramsRturn = this.jdHasParams();
		const toStringParams = `?q=${encodeURIComponent(JSON.stringify(params))}`;
		if(paramsRturn){
		 	this.props.replace(path,toStringParams+paramsRturn);
		}else{
			this.props.replace(path,toStringParams);
		}
	}
	//判断头部是否带上参数hasParams并且头部参数不为空返回
	jdHasParams = () => {
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
	}
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
		const { api,uuid, buttons, pages ,isTabs,defaultKey,TabsData,path,expandedRowRender,resetFresh,getArea } = this.props;
		const { data, total, pageSize,skip,$width } = this.state;
		let {  rowSelection = null } = this.props;
		columns = this.dealColumns(columns);
    let pagination = {
    	pageSize,pageSizeOptions:['10','30','50','100'],total,showSizeChanger:true,current:Math.ceil(skip / pageSize + 1),onChange:this.onChange,
    	onShowSizeChange:this.onShowSizeChange,showQuickJumper:true,locale:locale.Pagination
    };
		return(
			<div>
        <Spin tip="加载中..." spinning={this.state.loading} size="large" >
					<Row>
			      <Col span={24}>
			          {search &&
			              search.length > 0 && (
			                <AsyncSearch
			                	listDetail={data}
			                  defaultSearchs={this.params.searchs || []}
			                  search={search}
			                  api={api}
			                  uuid={uuid || api.uuid}
			                  getArea={getArea}
			                  loading={this.state.loading}
			                  onSearchReset={this.searchReset}
			                  onSearchChange={searchs => {
			                    this.jumpUrl({
			                      searchs
			                    });
			                  }}
			                  changeLoading={
			                  	(val)=>{
			                  		this.updateState({ loading:val,isRender:true});
			                  	}
			                  }
			                  resetFresh={resetFresh}
			                />
			              )
			            }
			      </Col>
			    </Row>
	    		<Table
	    		  rowKey="id"
	    		  bordered
	    		  scroll={{ x: $width>$changeTableWidth?false:$changeTableWidth }}
	    		  columns={columns}
	    		  rowSelection={rowSelection}
	    		  expandedRowRender={expandedRowRender}
	    		  dataSource={this.isArray(data) ? data : [].concat(data)}
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
	tabsChange = (key) => {
		const { onTabsClick } = this.props;
		this.jumpUrl({
	    tabsKey: key
	  });
	  onTabsClick(key);
  };
  render() {

    const { config,title,buttons,isTabs,defaultKey,TabsData,columns,search,removeHeader,child,boxStyle } = this.props;
		const { data } = this.state;
		const { tabsKey = defaultKey } = this.params;
    return (
    	<div className="AsyncTableContainer">
	      <div className="AsyncTable" style={boxStyle}>
	    		{removeHeader?'':<HeaderNav
	      		buttons={buttons}
	      		config={config}
	          title={title}
	          data={data}
	          className={isTabs?'noneBottomLine':''}
	      	/>}
	    		{child?child:''}
			    {isTabs?
			    	(<Tabs defaultActiveKey={ tabsKey } onChange={this.tabsChange} type="card">
			    		{TabsData.map((item,i)=>
			    			<TabPane tab={item.title} key={item.key}>
				    			{this.returnRender(item.data.columns,item.data.search)}
				    		</TabPane>			    			
			    		)}
			    	</Tabs>)
			    	:this.returnRender(columns,search)}
	      </div>
	    </div> 
    );
  }
}
