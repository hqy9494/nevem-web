import React from "react";
import  "./index.scss";
import { Button } from "antd";
// 根据配置读取并拼接组件
class HeaderNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillMount(){
		
	}
	componentWillReceiveProps(nextProps) {}
	isArray(obj){ 
		return (typeof obj=='object')&&obj.constructor==Array; 
	}
	getTitleName = () =>{
		const { config } = this.props;
		const { menu ,component,location } = this.props.config;
		let pathname = location.pathname.split('/');
		if(menu){
			let obj = {}
			for(let m in menu){
				if(menu[m].component === pathname[1]){
					obj.name = menu[m].name;
					obj.component = menu[m].component;
					return obj;
				}
			}
		}
		return false;
	}
	render() {
		const { config,title,buttons,data,className } = this.props;
		let myClass = className || '';
		const interObj = this.getTitleName();
		return(
			<div className={"HeaderNav "+myClass}>
              {
                config.initialState.subtitle && (
                  <span className="text-sm hidden-xs">{config.initialState.subtitle}</span>
                )
              }
              {config.initialState.breadcrumb && (
                <ol className="breadcrumb">
                	<span className="mr" style={{color:'#000',fontSize:'20px',fontWeight:'600'}}>
	                  {config.initialState.title || "无标题"}
	                </span>
	                {/*<li>
	                    <a href="#">首页</a>
	                </li>*/}
	                {interObj ? <li className="active">
	                    {interObj.name || '首页'}
	                </li>:<li>
	                    <a href="#">首页</a>
	                </li>}
	                  {	
	                    Array.isArray(config.initialState.breadcrumb) && config.initialState.breadcrumb.map((v, i) => (
	                      <li key={i}>
	                        <a href={v.url}>{v.name}</a>
	                      </li>
	                    ))
	                  }
	                  <li className="active">{title}</li>
	              	<div style={{float:'right'}}>
	              		{this.isArray(buttons) && buttons.map((b, i) => {
	              			return (
	              				b.isAhref ?
		                          <a download={b.fileName} href={b.download || '#'} key={`button-${i}`}>
		                            <Button
		                              onClick={() => {
		                                b.onClick && b.onClick(data);
		                              }}
		                              className={b.className}
			                          type={b.type}
			                          disabled={b.disabled}
		                            >
		                              {b.title}
		                            </Button> 
		                          </a>:
	                          	<Button
		                          key={`button-${i}`}
		                          className={b.className}
		                          type={b.type}
		                          disabled={b.disabled}
		                          onClick={() => {
		                            b.onClick && b.onClick(data)
		                          }}
		                        >
	                          		{b.title}
	                        	</Button>
		                        
	                    )})}
	            	</div>
                </ol>
              )}
            </div>
		)
	}
};

export default HeaderNav;