import XLSX from 'xlsx';
import {message} from "antd";
import { getParameterByName } from '../../utils/utils';
class outPutExcel{
	constructor(props,uuid) {
		this.props = props;
		this.uuid = uuid;
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
								between: [s.values.startDate+' 00:00:00:000+08:00', s.values.endDate+' 23:59:59:999+08:00']
							};
						} else if(s.values.startDate) {
							where[s.field] = {
								gt: s.values.startDate+' 00:00:00:000+08:00'
							};
						} else if(s.values.endDate) {
							where[s.field] = {
								lt: s.values.endDate+' 23:59:59:999+08:00'
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
	toExcelFile = (_headers, _data,name='output.xlsx') => {
		let headers = _headers.map((v, i) => Object.assign({}, {
				v: v,
				position: String.fromCharCode(65 + i) + 1
			}))
			.reduce((prev, next) => Object.assign({}, prev, {
				[next.position]: {
					v: next.v
				}
			}), {});
		let data = _data.map((v, i) => _headers.map((k, j) => Object.assign({}, {
				v: v[k],
				position: String.fromCharCode(65 + j) + (i + 2)
			}))).reduce((prev, next) => prev.concat(next))
			.reduce((prev, next) => Object.assign({}, prev, {
				[next.position]: {
					v: next.v,
					t:typeof(next.v)==='string'?'s':'n'
				}
			}), {});
		let output = Object.assign({}, headers, data);
		var outputPos = Object.keys(output);
		var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
		var wb = {
			SheetNames: ['mySheet'],
			Sheets: {
				'mySheet': Object.assign({}, output, {
					'!ref': ref
				})
			}
		};
		XLSX.writeFile(wb,name);
	}
	toExcelData = (obj, callback) => {
		const {path,where,include,params,fields} = obj;
		const qParams =  getParameterByName('q')? JSON.parse(decodeURIComponent(getParameterByName('q'))) : {};
		const { searchs } = qParams;
		this.props.rts({
				method: "get",
				url: path,
				params: params ? params:{
					filter: Object.assign({}, {
						where: Object.assign({},where,this.searchsToWhere(searchs))
					}, {
						include: include,
						order:"createdAt DESC",
						fields
					}
					)
				}
			},
			this.uuid,
			"toExcelData",
			res => {
				if(!res.data.length){
					return message.error('没有可导出的数据');
				}
				return callback(res);
			}
		);
	}
}

export default outPutExcel;