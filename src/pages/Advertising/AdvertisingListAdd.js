import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Form, Select, Button, Input, message ,Switch,InputNumber, Upload, Icon } from "antd";
import FormExpand from "../../components/FormExpand";
import DetailTemplate from "../../components/DetailTemplate"
import BMF from 'browser-md5-file';
import {  Panel } from 'react-bootstrap';
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
};
const optionKey = [
  { key: 'video', value: '视频' },
  { key: 'image', value: '图片' }
]
const bmf = new BMF();
export class AdvertisingListAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkState:false,
      role:true,
      advertId: null,
      roleData: [],
      mainImg: [],
      page: {},
    };
    this.uuid = uuid.v1();
  }
  componentDidMount() {
    const { params } =  this.props.match;
    const { id } = params;
    if (id && id !== "add") {
      this.pageInfo(id)

      this.setState({
        advertId: id,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { pageInfo } = nextProps;
    
    if (pageInfo && pageInfo[this.uuid]) {
      this.setState({
        page: pageInfo[this.uuid],
      })
    }
  }

  handleChange = (name, { fileList }) => {
    this.setState({ [name]: fileList })
  }

  showSelect = (type) => {
  	let { page } = this.state;
  	page.type = type;
  	this.props.form.setFieldsValue({type});
  	this.setState({page});
	}

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleStart = (e) => {
    return e
  }

  pageInfo = (id = this.props.match.params.id) => {
    id && this.props.rts({
      method: "get",
      url: `/MaterialLibraries/${id}`
    },this.uuid, "pageInfo");
  };

  submitNew = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
      	if(values.type && !values.type[0]){
      		return message.error('请选择素材类型');
      	}
      	
      	const obj = this.state.advertId===null?{msg:'新建成功！',path:'/MaterialLibraries',methods:'post'}:{msg:'更新成功！',path:`/MaterialLibraries/${this.state.advertId}`,methods:'put'}
      	this.props.rts({
		      method:obj.methods,
		      url: obj.path,
		      data:values,
		    },this.uuid, "postData",()=>{
		    	message.success(obj.msg);
		    	this.props.goBack()
		    });
      }
    })
  };
	getMD5 = (event) =>{
		event.persist();
		const file = event.target.files[0];
		if(!file){
			return;
		}
	  bmf.md5(
	    file,
	    (err, md5) => {
	      this.props.form.setFieldsValue({md5,size:file.size});
	    },
	    progress => {
	    },
	  );
	}

  render() {
    const uploadButton = (<div><Icon type="upload" /> 添加</div>)
    const { getFieldDecorator } = this.props.form;
    const { match } = this.props;
    const id = match.params.id;

    const { disabled, roleData, page ,advertId} = this.state; 

    const child = (
      <section className="AdvertisingStrategyList-page">
        <Panel>
        <Form onSubmit={this.submitNew}>
          <div style={{ maxWidth: 750 }}>
              <FormItem
                {...formItemLayout}
                label="素材名称"
              >
                {getFieldDecorator("name", {
                  rules: [{
                    required: true, message: '必填项',
                  }],
                  initialValue: page && page.name || ''
                })(
                  <Input placeholder="请输入素材名称" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="素材类型"
              >
                {getFieldDecorator("type", {
                  rules: [{
                    required: true, message: '必填项',
                  }],
                  initialValue: page && [page.type] || []
                })(
                  <Select onChange={(e) => { this.showSelect(e) }} placeholder="请选择">
                    {
                      optionKey && optionKey.length > 0 ? optionKey.map((v, i) => {
                        return <Option key={v.key}>{v.value}</Option>
                      }) : null
                    }
                  </Select>
                )}
              </FormItem>
              {
                page.type === 'image'?
                  <FormItem
                    label={`素材图片`}
                    extra="图片：请上传图片链接"
                     {...formItemLayout}
                  >
                  	{getFieldDecorator(`url`, {
                        rules: [{message: '请填写路径地址', required: true }],
                        initialValue: page && page.url || []
                    })(
                        <Input placeholder="请填写路径地址"/>
                    )}
                    {/*getFieldDecorator(`mainImg`, {
                        rules: [{message: '请上传图片', required: true }],
                    })(
                        <Upload
                          name="file"
                          action={`${'https://nevem.yooyuu.com.cn'}${'/api/v1'}/upload/image`}
                          listType="picture-card"
                          headers={{
                            Authorization: localStorage.token
                          }}
                          onStart={this.handleStart}
                          onPreview={this.handlePreview}
                          onChange={(fileList) => {
                            this.handleChange('mainImg', fileList)
                          }}
                          // customRequest={this.handleCustomRequest}
                          accept="image/*"
                          fileList={this.state.mainImg || []}
                        >
                          {this.state.mainImg.length === 1 ? null : uploadButton}
                        </Upload>
                    )*/}
                  </FormItem> :
                page.type === 'video'?
                  <FormItem
                    label={`视频文件`}
                    extra="视频：请上传视频链接"
                    {...formItemLayout}
                  >
                  	{getFieldDecorator(`url`, {
                        rules: [{message: '请填写路径地址', required: true }],
                        initialValue: page && page.url || []
                    })(
                        <Input placeholder="请填写路径地址"/>
                    )}
                    {/*getFieldDecorator(`mainImg`, {
                        rules: [{message: '请上传视频', required: true }],
                    })(
                        <Upload
                          name="file"
                          action={`${'https://nevem.yooyuu.com.cn'}${'/api/v1'}/upload/image`}
                          listType="picture-card"
                          headers={{
                            Authorization: localStorage.token
                          }}
                          onPreview={this.handlePreview}
                          onChange={(fileList) => {
                            this.handleChange('mainImg', fileList)
                          }}
                          accept="video/*"
                          fileList={this.state.mainImg || []}
                        >
                          {this.state.mainImg.length === 1 ? null : uploadButton}
                        </Upload>
                    )*/}
                  </FormItem> :
                  null
                }
              <FormItem
                {...formItemLayout}
                 extra="注意：MD5获取需从网上把（视频/图片）下载到本地"
                label="MD5"
              >
            	<div>
                {getFieldDecorator("md5", {
                	rules: [{message: '请点击按钮获取MD5', required: true }],
                  initialValue: page && page.md5
                })(
	                  <Input placeholder="请选择文件生成MD5" disabled/>
                )}
                  <div className="getMD5Box">
	                  <Button>
								      <Icon type="upload" /> 获取图片/视频的MD5
								    </Button>
	                  <input type="file" accept={
	                  	page.type === 'image'?
	                  	"image/*":
	                  	page.type === 'video'
	                  	?"video/*":'*'
	                  	} onChange={this.getMD5}/>
                  </div>
							  </div>
              </FormItem>
              <FormItem style={{display:'none'}}>
                {getFieldDecorator("size", {
                  initialValue: page && page.size
                })(
	                  <Input/>
                )}
              </FormItem>
            {/*<div className="ta-c mt-20">
              <Button style={{ marginRight: 8 }} onClick={() => {
                this.props.goBack()
              }}>
                返回
              </Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </div>*/}
            </div>
        </Form>
        </Panel>
      </section>
    );
    
     return (
      <section className="EquipmentInfoDetail-page">
	      <DetailTemplate
	      	config = {this.props.config}
	      	title = {page && page.name || this.props.title}
	      	child={child}
	      	onCancle={this.props.goBack}
	      	onOk={this.submitNew}
	      />
    </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const StaffManageruuid = state => state.get("rts").get("uuid");
const pageInfo = state => state.get("rts").get("pageInfo");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  pageInfo,
});

const WrappedAdvertisingListAdd = Form.create()(AdvertisingListAdd);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedAdvertisingListAdd
);
