import React from "react";
import  "./index.scss";
import { Button } from "antd";
import HeaderNav from "../../components/HeaderNav"
// 根据配置读取并拼接组件
class DetailTemplate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {}
	componentWillReceiveProps(nextProps) {}
	isArray(obj){ 
		return (typeof obj=='object')&&obj.constructor==Array; 
	}
	render() {
		const {config,title,child,onCancle,onOk,definedButton,removeOkButton,removeAllButton,okText,cancleText,isBottom,buttons,removeHeader} = this.props;
		return(
			<div className="detailTemplate" style={isBottom?{minHeight:'100%'}:{height:'auto'}}>
				{removeHeader?"":<HeaderNav
		        	config = {config}
					title = {title}
					buttons = {buttons}
		        />}
				<div className="content">{child}
					{!removeAllButton && !isBottom?<div className="centerButton">
						{definedButton?definedButton:
							removeOkButton?
							<Button onClick={onCancle}>
						        {cancleText?cancleText:'返回'}
						    </Button>:
					        <div>
						        <Button style={{ marginRight: 8 }} onClick={onCancle}>
						        	{cancleText?cancleText:'返回'}
						        </Button>
						        <Button type="primary" 
					        	onClick={onOk}
						        >{okText?okText:'保存'}</Button>
					        </div>
					    }
		      		</div>:''}
				</div>
				{!removeAllButton && isBottom?<div className="buttonGrop">
					{definedButton?definedButton:
						removeOkButton?
						<Button onClick={onCancle}>
					        {cancleText?cancleText:'返回'}
					    </Button>:
				        <div>
					        <Button style={{ marginRight: 8 }} onClick={onCancle}>
					        	{cancleText?cancleText:'返回'}
					        </Button>
					        <Button type="primary" 
				        	onClick={onOk}
					        >{okText?okText:'保存'}</Button>
				        </div>
				    }
	      		</div>:''}
			</div>
		)
	}
};

export default DetailTemplate;