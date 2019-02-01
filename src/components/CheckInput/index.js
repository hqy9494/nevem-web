import { message } from "antd";
import getCheckFn from "./checkFn";
export default function checkInput(obj) {
	const getRegularResult = getRegular(obj.type);
	if(typeof getRegularResult==='function'){
		const result = getRegularResult(obj.value)
		if(!result.pass){
			message.error(result.msg || obj.msg)
		}
		return result.pass;
	}
	else{
		if((getRegularResult.test(obj.value))){
			return true;
		}
		message.error(obj.msg)
		return false;
	}
	
}

export function getRegular(type){
	switch (type){
		//手机号码
		case 'mobile-phone':
			return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
		break;	
		//电话号码	
		case 'tele-phone':	
			return /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$|(0\d{10})$/;
		break;		
		//邮箱
		case  'email':
			return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		break;		
		case  'chinese':
			return /^[\u4e00-\u9fa5]{0,}$/;
		break;		
		case  'zip-code':
			return /[1-9]\d{5}(?!\d)/;
		break;		
		case  'IDcard':
			return	getCheckFn['IDcard'];
		break;
		case 'url':
			return /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
			break;
		case 'http-url':
			return /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
			break;
		case 'number':
			return /^(\-|\+)?\d+(\.\d+)?$/;
			break;
		default:
			break;
	}
}


