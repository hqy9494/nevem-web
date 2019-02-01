import React from "react";
import { Input, Icon, Radio, InputNumber, Button, Row ,Col ,Select ,DatePicker,Form,message ,Cascader,Spin  } from "antd";
import classNames from "classnames";
import moment from "../../components/Moment";
import "./style.scss";
import { getParameterByName } from '../../utils/utils';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const Search = Input.Search;
const formItemLayout = {
  labelCol: {
    xxl:4,
    xl:6,
    lg:8
  },
  wrapperCol: {
    xl:18,
    xxl:20,
    lg:16
  },
};

class AsyncSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	searchList:[],
    	areaData:[],
    	RelaxData:{}
    }
  }

  componentWillMount() {
  	const params = getParameterByName('q')? JSON.parse(getParameterByName('q')) : {};
  	const { searchs } = params;
  	this.getInitData(searchs);
  	this.setState({searchList:params.searchs}); 
  	this.props.getArea?this.getArea():'';
  }
  componentWillUnmount() {
    this._isUnmounted = true;
  }
  getInitData = (searchs) =>{
  	if(this.isArray(searchs)){
  		searchs.map((item,i)=>{
  			if(item.type==='relevance'){
  				this.getSelectData(item,true)  				
  			}else if(item.type==='unrelevance'){
					this.getSelectData(item,true)
  			}
  		})
  	}
  }
  //包装setState
  updateState(newState, cb) {
    if (this._isUnmounted) {
      return;
    }
    this.setState(newState, cb);
  }
  componentWillReceiveProps(nextProps) {}
//option和date的监听事件并数据同步
	handleSelectChange = (value,id) => {
		this.props.form.setFieldsValue({[id]:value},()=>{
    	this.searchClick();
    });
  }
	onFilterOption = (input,options) =>{
		if(options.props.children==='' || options.props.children===undefined ||options.props.children===null){
			return false;
		}else if(this.isArray(options.props.children)){
			return options;
		}
		else{
			try{
				return	options.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0			
			}catch(err){			
				console.log(err,'err');				
			}
		}
	}
	isArray(obj){ 
		return (typeof obj=='object')&&obj.constructor==Array; 
	}
	booleanToNumber(obj){
		if(typeof obj==='boolean'){
			return obj?1:0;
		}
		return obj;
	}
	//初始化initData并封装方法
	initDataCreat(type,value){
		switch(type){
			case "field":return value;
			break;
			case "option":return value.value;
			break;
			case "optionRelevance":return value.title;
			break;
			case "date":return [moment(value.startDate,'YYYY-MM-DD HH:mm:ss'),moment(value.endDate,'YYYY-MM-DD HH:mm:ss')];
			break;
			case "relevance":return value;
			break;
			case "areaRelevance":return value.title;
			break;
			case "area":return value;
			break;
			case "unrelevance":return value.title;
			break;
			case "numberRelevance":return value.title;
			break;
			case "number":return value;
			break;
		}
	}
	getArea = () => {
		const { api, uuid } =  this.props;
    api.rts({
      method: 'get',
      url: api.areaPath
    }, uuid, 'getArea',(res)=>{
    if(res.length > 0) {
    	res =	res.map(v=>{
    		if(v.child.length){
    			let children =	v.child.map(cv=>{
    				if(cv.child.length){
    					let cc = cv.child.map(ccv => {return {value:ccv.name,label:ccv.name}})
    					return {value:cv.name,label:cv.name,children:cc}
    				}else{
    					return {value:cv.name,label:cv.name}
    				}
    			})
    			return {value:v.name,label:v.name,children}
    		}else{
    			return {value:v.name,label:v.name}
    		}
    	})
    }
		this.updateState({areaData:res});
    })
  };
  selectArea = (value, id) => {
    if(value.length===3 || !value.length){
    	this.handleSelectChange(value,id)
    }
  }
  getSelectData = async (val,show) =>{
  		if(!show) return;
  		const { RelaxData } = this.state;
  		if(RelaxData[val.field] && RelaxData[val.field].length){
  			return false;
  		}
  		const { api,changeLoading } = this.props;
  		const { model } = val;
//		changeLoading(true);
  		let obj = {
  			params:{
					filter:{
						where:Object.assign(
							{},
							api.where),
					}},
  			path:model.api
  		}
  		let	res = await	this.relevanceGetData(obj);
  		res = this.getResultToArray(model.typeProps,res,model.isEditId);
  		RelaxData[val.field] = res;
  		this.updateState(RelaxData);
  }
	//初始化并渲染数据
	returnInput = (val,i) => {
		let reactHtml,initData = "";
		const { searchList,areaData,RelaxData } = this.state;
		const { loading } = this.props;
		const {getFieldDecorator} = this.props.form;
		//查找是否有默认寻找数据
		if(val.values){
			initData =	this.initDataCreat(val.type,val.values);
		}
		//渲染
		for(let j in searchList){
			if(val.type===searchList[j].type && val.field===searchList[j].field){
				initData =	this.initDataCreat(searchList[j].type,searchList[j].values);
				break;
			}
		}
		//初始化
		switch(val.type){
			case "field":
				reactHtml = (<Input placeholder={`请输入${val.title}`} disabled={loading} onPressEnter={this.searchClick}/>)
			break;
			case "option":
				reactHtml = (
					<Select 
						style={{width:'100%'}}
						placeholder={`请选择${val.title}`}
						getPopupContainer={triggerNode => triggerNode.parentNode}
						disabled={loading}
						onChange={(value)=>this.handleSelectChange(value,val.field)}>
						{this.isArray(val.options) && val.options.map((item,j)=><Option value={this.booleanToNumber(item.value)} key={'Option'+j}>{item.title}</Option>)}
						<Option value='' key={'OptionAll'}>搜索所有{val.title}</Option>
					</Select>
				)
			break;
			case "optionRelevance":
				reactHtml = (
					<Select
						style={{width:'100%'}}
						placeholder={`请选择${val.title}`}
						getPopupContainer={triggerNode => triggerNode.parentNode}
						disabled={loading}
						onChange={(value)=>this.handleSelectChange(value,val.field)}
					>
						{this.isArray(val.options) && val.options.map((item,j)=>
							<Option value={this.booleanToNumber(item.value)} key={'Option'+j}>
								{item.title}
							</Option>)
						}
						<Option value='' key={'OptionAll'}>搜索所有{val.title}</Option>
					</Select>
				)
			break;
			case "date":
				reactHtml = (<RangePicker style={{width:'100%'}} placeholder={['开始时间','结束时间']} disabled={loading} onChange={(value)=>this.handleSelectChange(value,val.field)}/>)
			break;
			case "relevance":
				reactHtml = (
					<Select 
						showSearch
						notFoundContent={this.isArray(RelaxData[val.field] ) && RelaxData[val.field].length>0?null:<Spin size="small" />}
						getPopupContainer={triggerNode => triggerNode.parentNode}
						onDropdownVisibleChange={(value)=>this.getSelectData(val,value)}
						style={{width:'100%'}}
						placeholder={`请选择${val.title}`}
						disabled={loading}
						optionFilterProp="children"
						onChange={(value)=>{this.handleSelectChange(value,val.field)}}
						filterOption={this.onFilterOption}
					>
					{this.isArray(RelaxData[val.field]) && RelaxData[val.field].map((item,j)=>
						<Option value={item.id} key={'Option'+j}>{item[val.model.field]}</Option>)
					}
					{this.isArray(val.addOptions) && val.addOptions.map((item,j)=>
						<Option value={this.booleanToNumber(item.value)} key={'addOption'+j}>{item.name}</Option>)
					}
					{this.isArray(RelaxData[val.field]) && <Option value='' key={'OptionAll'}>搜索所有{val.title}</Option>}
					</Select>
				)
			
//				addonAfter={<Icon type="search" onClick={this.searchClick}/>}
//				reactHtml = (<Input onPressEnter={this.searchClick} placeholder={`请输入${val.title}`} disabled={loading}/>)
				break;
			case "unrelevance":
//				reactHtml = (<Input onPressEnter={this.searchClick} placeholder={`请输入${val.title}`} disabled={loading}/>)
				reactHtml = (
					<Select 
						showSearch
						notFoundContent={this.isArray(RelaxData[val.field] ) && RelaxData[val.field].length>0?<Spin size="small" /> : "找不到该选项"}
						getPopupContainer={triggerNode => triggerNode.parentNode}
						onDropdownVisibleChange={(value)=>this.getSelectData(val,value)}
						style={{width:'100%'}}
						placeholder={`请选择${val.title}`}
						disabled={loading}
						optionFilterProp="children"
						onChange={(value)=>{this.handleSelectChange(value,val.field)}}
						filterOption={this.onFilterOption}
					>
					{this.isArray(RelaxData[val.field] ) && RelaxData[val.field].map((item,j)=>
						<Option value={item.id} key={'Option'+j}>{item[val.model.child.field]}</Option>)
					}
					{this.isArray(val.addOptions) && val.addOptions.map((item,j)=>
						<Option value={this.booleanToNumber(item.value)} key={'Option'+j}>{item.name}</Option>)
					}
					{this.isArray(RelaxData[val.field]) && <Option value='' key={'OptionAll'}>搜索所有{val.title}</Option>}
					</Select>
				)
			break;
			case "number":
			const min =	getFieldDecorator(val.field+'min',{initialValue:initData[0]})(<InputNumber className="minInput" placeholder={`最小${val.title}数值`} formatter={value=>`${value}`.replace(/[^-?\d^\.?]+/g,'')}/>);
			const max =	 getFieldDecorator(val.field+'max',{initialValue:initData[1]})(<InputNumber placeholder={`最大${val.title}数值`} className="maxInput" formatter={value=>`${value}`.replace(/[^-?\d^\.?]+/g,'')}/>);
				reactHtml = (
					<div className="numberInputBox">
						{min}
		        <Input className="centerInput" placeholder="~" disabled/>
		        {max}
        	</div>)
			break;
			case "numberRelevance":
			const minRelevance =	getFieldDecorator(val.field+'min',{initialValue:initData[0]})(<InputNumber className="minInput" placeholder={`最小${val.title}数值`} formatter={value=>`${value}`.replace(/[^-?\d^\.?]+/g,'')}/>);
			const maxRelevance =	 getFieldDecorator(val.field+'max',{initialValue:initData[1]})(<InputNumber placeholder={`最大${val.title}数值`} className="maxInput" formatter={value=>`${value}`.replace(/[^-?\d^\.?]+/g,'')}/>);
				reactHtml = (
					<div className="numberInputBox">
						{minRelevance}
		        <Input className="centerInput" placeholder="~" disabled/>
		        {maxRelevance}
        	</div>)
			break;
			case "area":
				reactHtml = (
					<Cascader
						placeholder={`请选择${val.title}`}
						disabled={loading}
		        options={areaData}
		        onChange={(value)=>this.selectArea(value,val.field)}
		        changeOnSelect
		        notFoundContent="没有地址数据！"
		        showSearch
	      />)
			break;
			case "areaRelevance":
			reactHtml = (
					<Cascader
						placeholder={`请选择${val.title}`}
						disabled={loading}
		        options={areaData}
		        onChange={(value)=>this.selectArea(value,val.field)}
		        changeOnSelect
		        notFoundContent="没有地址数据！"
		        showSearch
		      />)
				
			break;
			default:
        break;
		}
			return	(
			<FormItem
	      {...formItemLayout}
	      label={val.title}
	    >
				{initData!=='' && initData!==undefined ?getFieldDecorator(val.field,{initialValue:initData})(reactHtml):getFieldDecorator(val.field)(reactHtml)}
			</FormItem>
	  	)
	}
	//重置不刷新页面
	reSetSearch = () =>{
		const { search,onSearchChange,changeLoading } = this.props;
		changeLoading(true);
		let resetObj = {};
		for(let i in search){
			resetObj[search[i].field] = undefined;
			if(search[i].type ==='number' || search[i].type ==='numberRelevance' ){
				resetObj[search[i].field+'min'] = undefined;
				resetObj[search[i].field+'max'] = undefined;
			}
		}
		onSearchChange([]);
		this.props.form.setFieldsValue(resetObj);	
	}
	//type = relevance 请求关联数据
	relevanceGetData = (obj) =>{
		return new Promise((resolve, reject) => {
			const { api, uuid } =  this.props;
			api.rts(
		  {
		    method: 'get',
		    url: obj.path,
		    params: obj.params || {}
		  },
		  api.uuid,
		  'searchData',
		  (res = {}) => {
		  	resolve(res);
		  });
    })
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
	//合并返回数据
	mixResult = (title,search,res) => {
		let relevanceData = {value:[],title}
		let data = this.getResultToArray(search.model.typeProps,res,search.model.isEditId);
	  if(this.isArray(data)){
	  	data = data.map((item)=>search.model.fieldName?item[search.model.fieldName]:item.id);
	  	relevanceData.value = data;      	
	  }else{
	  	return undefined;
	  }
	  return relevanceData;
	}
	
	//生成data返回给table查询数据
	//field字段搜索，option选择器搜索，date时间搜索，number数量搜索，relevance，字段关联表搜索，主要关联,默认为id,用fieldName可以改变关联值，
	//unrelevance字段在表中的对象中关联查询表,默认为id,用fieldName可以改变关联值,
	searchClick =()=>{
		const {api} = this.props;
		let search  =	JSON.parse(JSON.stringify(this.props.search));
		let searchArr = [];
		this.props.form.validateFields(async (err, values) => {
			this.props.changeLoading(true);
			for(let i in search){
				delete	search[i].values;
				switch(search[i].type){
					case "field":
						values[search[i].field]?search[i].values = values[search[i].field]:'';
					break;
					case "option":
						if(search[i].field && values[search[i].field] !==undefined && values[search[i].field] !==''){
							for(let j in search[i].options){
								search[i].options[j]['value'] = this.booleanToNumber(search[i].options[j]['value']);
								if(search[i].options[j]	&& search[i].options[j]['value']!==undefined && search[i].options[j]['value'] === values[search[i].field]){
									search[i].values = search[i].options[j];
								}
							}	
						}
						delete	search[i].options;
					break;
					case "date":
						values[search[i].field] && values[search[i].field].length?search[i].values = {startDate:moment(values[search[i].field][0]).format("YYYY-MM-DD"),endDate:moment(values[search[i].field][1]).format("YYYY-MM-DD")}:'';
					break;
					case "relevance":
					//add额外添加的params搜索值，但是会被field替换
					if(search[i].field && values[search[i].field]!==undefined){
//						let replaceString = "";
						/*for(let c in search[i].change){
							if(search[i].change[c].name === values[search[i].field]){
								if(!search[i].changeType){
									replaceString = search[i].change[c].to
								}
							}
						}*/
						/*const obj = {params:{filter:{where:Object.assign({},search[i].model.removeWhere?{}:api.where,search[i].model.add,{[search[i].model.field]:search[i].model.like?{ like: `%${replaceString || values[search[i].field]}%` }:(replaceString || values[search[i].field])}),limit: 10000,fields:search[i].model.fieldName}},path:search[i].model.api}
						let	res = await	this.relevanceGetData(obj);
			    	search[i].values = this.mixResult(values[search[i].field],search[i],res);*/
						const { fieldName } = search[i].model;
						if(fieldName && fieldName!=='id'){
							const obj = {
								params:{
									filter:{
										where:Object.assign(
											{},
											search[i].model.removeWhere?{}:api.where,
											search[i].model.add,
											{"id":values[search[i].field]}),
											limit: 10000,
											fields:search[i].model.fieldName
									}},
								path:search[i].model.api
							}
							let	res = await	this.relevanceGetData(obj);
				    	search[i].values = this.mixResult(values[search[i].field],search[i],res);
				    	search[i].values = search[i].values?search[i].values.value[0]:undefined;
						}else{
							search[i].values = values[search[i].field];							
						}
					}
					break;
					case "optionRelevance":
						if(search[i].field && values[search[i].field] !==undefined && values[search[i].field] !==''){
							let modelValue = null;
							for(let j in search[i].options){
								search[i].options[j]['value'] = this.booleanToNumber(search[i].options[j]['value']);
								if(search[i].options[j]	&& search[i].options[j]['value']!==undefined && search[i].options[j]['value'] === values[search[i].field]){
									modelValue = search[i].options[j];
								}
							}
							const obj = {params:{filter:{where:Object.assign({},search[i].model.removeWhere?{}:api.where,search[i].model.add,{[search[i].model.field]: modelValue.value}),limit: 10000,fields:search[i].model.fieldName || "id"}},path:search[i].model.api}
							let	res = await	this.relevanceGetData(obj);
							search[i].values = this.mixResult(values[search[i].field],search[i],res);
						}
					break;
					case "areaRelevance":
					if(search[i].field && values[search[i].field] && values[search[i].field].length){
							let postObj = {}
							for(let j in values[search[i].field]){
								postObj[search[i].model.field[j]] = values[search[i].field][j];
							}
							const childObj = {params:{filter:{where:Object.assign({},search[i].model.removeWhere?{}:api.where,search[i].model.add,postObj),limit: 10000,fields:search[i].model.fieldName || "id"}},path:search[i].model.api}
							let	result = await	this.relevanceGetData(childObj);
							search[i].values = this.mixResult(values[search[i].field],search[i],result);
							/*let modelValue = null;
							for(let j in search[i].options){
								search[i].options[j]['value'] = this.booleanToNumber(search[i].options[j]['value']);
								if(search[i].options[j]	&& search[i].options[j]['value']!==undefined && search[i].options[j]['value'] === values[search[i].field]){
									modelValue = search[i].options[j];
								}
							}
							const obj = {params:{filter:{where:Object.assign({},search[i].model.add,{[search[i].model.field]: modelValue.value}),limit: 10000,fields:search[i].model.fieldName || "id"}},path:search[i].model.api}
							let	res = await	this.relevanceGetData(obj);
							search[i].values = this.mixResult(values[search[i].field],search[i],res);*/
						}
					break;
					case "area":
						search[i].field && values[search[i].field] && values[search[i].field].length?search[i].values = values[search[i].field]:'';
					break;
					case "unrelevance":
						if(search[i].field && values[search[i].field]){
							/*if(search[i].model.child){
								const { model } = search[i];
								const { child } = model;
								const childObj = {params:{filter:{where:Object.assign({},child.removeWhere?{}:api.where,{[child.field]: child.like?{ like: `%${values[search[i].field]}%` }:values[search[i].field]}),limit: 10000,fields:child.fieldName || "id"}},path:child.api}	
								let	childResult = await	this.relevanceGetData(childObj);
								childResult = childResult.data || childResult.data.data || childResult;
								childResult = childResult.map((item)=>child.fieldName?item[child.fieldName]:item.id);
								const obj = {params:{filter:{where:Object.assign({},model.removeWhere?{}:api.where,{[model.field]: { inq:childResult}}),limit: 10000,fields:model.fieldName || "id"}},path:model.api};
								let	result = await	this.relevanceGetData(obj);
								let relevanceData = {value:[],title:values[search[i].field]}
					      let data = this.isArray(result.data.data)?result.data.data:result.data;
					      if(this.isArray(data)){
					      	data = data.map((item)=>model.fieldName?item[model.fieldName]:item.id);
					      	relevanceData.value = data;  	
					      }
					      delete search[i].model;
								search[i].values = relevanceData;
							}*/
							if(search[i].model.child){
								const { model } = search[i];
								const { child } = model;
								const obj = {
									params:{
										filter:{
											where:Object.assign(
												{},
												model.removeWhere?{}:api.where,
												{[model.field]: values[search[i].field]}
											),
											limit: 10000,
											fields:model.fieldName || "id"
										}
									},
									path:model.api
								};
								let	res = await	this.relevanceGetData(obj);
								search[i].values = this.mixResult(values[search[i].field],search[i],res);
							}
							
						}
					break;
					case "number":
						if((values[search[i].field+'min'] ||values[search[i].field+'min']===0)  && (values[search[i].field+'max'] || values[search[i].field+'max']===0)){
							const min = parseFloat(values[search[i].field+'min']);
							const max = parseFloat(values[search[i].field+'max']);
							if(min>max){
								return message.error(search[i].title+'最小值不能大于最大值！');
							}
							search[i].values = [!isNaN(min)?min:null,!isNaN(max)?max:null];
						}
					break;
		      case "numberRelevance":
						if((values[search[i].field+'min'] ||values[search[i].field+'min']===0)  && (values[search[i].field+'max'] || values[search[i].field+'max']===0) ){
							const minRelevance = parseFloat(values[search[i].field+'min']);
							const maxRelevance = parseFloat(values[search[i].field+'max']);
							if(minRelevance>maxRelevance){
								return message.error(search[i].title+'最小值不能大于最大值！');
							}
							let numberRelevance = [!isNaN(minRelevance)?minRelevance:null,!isNaN(maxRelevance)?maxRelevance:null];
							let searchObj = {};
							if(numberRelevance[0]!==null && numberRelevance[1]!==null) {
								searchObj[search[i].model.field] = {
									between: [numberRelevance[0], numberRelevance[1]]
								};
							} else if(numberRelevance[0]!==null) {
								searchObj[search[i].model.field] = {
									gt: numberRelevance[0]
								};
							} else if(numberRelevance[1]!=null) {
								searchObj[search[i].model.field] = {
									lt: numberRelevance[1]
								};
							}
							const obj = {params:{filter:{where:Object.assign({},search[i].model.removeWhere?{}:api.where,search[i].model.add,searchObj),limit: 10000,fields:search[i].model.fieldName || "id"}},path:search[i].model.api}
							let	res = await	this.relevanceGetData(obj);
							search[i].values = this.mixResult(numberRelevance,search[i],res);
						}
					break;
					default:
		        break;  
				}	
				if(search[i].type!=='number'){
					search[i].values!==undefined?searchArr.push(search[i]):'';
				}else{
					if(search[i].values){
						search[i].values[0]===null && search[i].values[1]===null?'':searchArr.push(search[i]);
					}
				}
			}
			console.log(searchArr,"searchArr");
			return this.props.onSearchChange(searchArr);
    });
	}
  render() {
    const { search,onSearchReset,loading,resetFresh } = this.props;
    return (
      <div className="AsyncSearchClass">
      	<Form>
		      <Row>
			      {search.map((s,i) =><Col key={i}  span={8}>{this.returnInput(s,i)}</Col>)}
			      <Col span={search.length%3==0?24:search.length%3==1?16:8} style={{textAlign:'right',paddingBottom:'10px',paddingTop:'4px'}}>
		        	<Button type="primary" style={{marginRight:'10px'}} onClick={this.searchClick} disabled={loading}>搜索</Button>
		        	<Button onClick={resetFresh?onSearchReset:this.reSetSearch} disabled={loading}>重置</Button>
	        	</Col>
		    	</Row>
        </Form>
      </div>
    );
  }
}
const WrappedAsyncSearch = Form.create()(AsyncSearch);
export default WrappedAsyncSearch;