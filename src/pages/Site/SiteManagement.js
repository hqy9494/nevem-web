import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Modal, Input, Popconfirm, Form, Select, Cascader,message } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
const FormItem = Form.Item
const Option = Select.Option

export class SiteManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      areaData: [],
      type : 'pick',
      visible: false,
      editType: false,
      editAddressData:{},
      accountList:[]
    };
    this.areaObj = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    this.getArea();
    this.getIndustries();
    this.getLandMark();
    this.getAccount();
  }

  componentWillReceiveProps(nextProps) {
    const { getArea, getIndustries, getLandMark } = nextProps
    if (getArea && getArea[this.uuid]) {
      this.setState({
        areaData: getArea[this.uuid]
      })
    }

    if (getIndustries && getIndustries[this.uuid]) {
      this.setState({
        industriesData: getIndustries[this.uuid].data,
        industriesTotal: getIndustries[this.uuid].total,
      })
    }

    if (getLandMark && getLandMark[this.uuid]) {
      this.setState({
        landMarkData: getLandMark[this.uuid].data,
        landMarkTotal: getLandMark[this.uuid].total,
      })
    }
  }

  handleArea = (areaData) => {
    let res = [];
    if(areaData.length > 0) {
      areaData.forEach(v => {
        const child = {
          label: v.name,
          value: v.name,
        };
        this.areaObj[v.name] = v.id;
        if (v.child.length > 0) child.children = this.handleArea(v.child);
        res.push(child)
      });
      return res
    }
  };

  handleEdit = (e)=>{
  	e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
    	if (!err) {
        let params = {},areaObject = {};
        for(let i of Object.keys(values)){
          if(!values[i] || i === 'person' || i === 'property'/* || i === 'wechat'*/) continue;
          if(i === 'area'){
          	areaObject.province = values[i][0];
          	areaObject.city = values[i][1];
          	areaObject.district = values[i][2] ? values[i][2] : "其他区";
          	continue;
          }
          params[i] = values[i]
        }
//      const { editAddress } = this.state;
        params = {...params,...areaObject};
        /*	if (editAddress[0]) params.province = editAddress[0].label
        	if (editAddress[1]) params.city = editAddress[1].label
        	if (editAddress[2]) params.district = editAddress[2].label   */ 
        this.state.editAddressData && this.state.editAddressData.id?this.postPlace(params,this.state.editAddressData.id):this.postPlace(params);
      }
    });
  };

  /*handleNewCreate = (e) =>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
    	if (!err) {
        let params = {};
        const { editAddress } = this.state;
        for(let i of Object.keys(values)){
          if (!values[i]) continue
          if(i === 'phone' || i === 'person' || i === 'area' || i === 'property'  || i === 'wechat') continue;
          params[i] = values[i]
        }
        if (editAddress[0]) params.province = editAddress[0].label
        if (editAddress[1]) params.city = editAddress[1].label
        if (editAddress[2]) params.district = editAddress[2].label
        this.postPlace(params);
      }
    });
  };
*/
  postPlace = (params = {},id='') => {
  	let path = id?`/Places/${id}`:`/Places`;
  	this.props.rts({
      method: 'post',
      url: path,
      data: params
    }, this.uuid, 'postPlace', () => {
    	id?message.success('修改成功！'):message.success('新建成功！');
      this.setState({
        visible: false,
        refreshTable: true,
      })
    })
  }
/*
  postPlaceDetail = (id, params = {}) => {
    this.props.rts({
      method: 'post',
      url: `/Places/${id}`,
      data: params
    }, this.uuid, 'postPlaceDetail', () => {
      this.setState({
        visible: false,
        refreshTable: true,
      })
    })
  }
*/
  getLandMark = () => {
    this.props.rts({
      method: 'get',
      url: '/LandMarks'
    }, this.uuid, 'getLandMark')
  };

  getIndustries = () => {
    this.props.rts({
      method: 'get',
      url: '/Industries'
    }, this.uuid, 'getIndustries')
  };
	getAccount = () => {
    this.props.rts({
      method: 'get',
      url: '/accounts'
    }, this.uuid, 'getAccount',res=>{
    	let accountList = [];
    	for(let i in res.data){
				accountList.push({id:res.data[i].id,name:res.data[i].fullname||''});
			}
    	this.setState({accountList});
    })
  };
  getArea = () => {
    this.props.rts({
      method: 'get',
      url: '/tools/getAreaData'
    }, this.uuid, 'getArea')
  };

  confirm = (id, bool) => {}

  getSiteInformat = (place, typePlace,account) => {
    return [
      {
        type: 'input',
        content: '场地名称',
        keyName: 'name'
      },
      {
        type: 'select',
        content: '场地负责人',
        keyName: 'opAccountId',
        children: account ? account:[]
      },
      {
        type: 'input',
        content: '负责人电话',
        keyName: 'phone',
      },
      {
        type: 'input',
        content: '微信',
        keyName: 'wechat',
      },
      {
        type: 'cascader',
        content: '场地所在地',
        keyName: 'area',
      },
      {
        type: 'select',
        content: '场地商圈',
        keyName: 'landMarkId',
        children: place ? place : [],
        removeRequired:true
      },
      {
        type: 'input',
        content: '所在位置',
        keyName: 'subject',
      },
      {
        type: 'select',
        content: '行业分类',
        keyName: 'industryId',
        children: typePlace ? typePlace : [],
        removeRequired:true
      },
      {
        type: 'input',
        content: '场地属性',
        keyName: 'nature',
      }
    ]
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { areaData, landMarkData, industriesData , accountList } = this.state
    const area = this.handleArea(areaData) || []
    const siteInfo = this.getSiteInformat(landMarkData, industriesData,accountList) || []
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }

    const config = {
      hasParams:{"id":this.props.params.id},
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Places",
        where: {
          type : this.state.type
        }
      },
      buttons: [
        {
          title: "新建",
          style: {
            borderRadius: 4,
          },
          onClick:() => {
          	this.setState({ 
              visible: true,
              editType: true,
              editAddressData:null
            })
          }
        },
        {
          title: "商圈管理",
          style: {
            marginLeft: 8,
            borderRadius: 4,
          },
          onClick:() => {
            this.props.to(`/Site/BusinessDistrict`);
          }
        },
        {
          title: "行业管理",
          style: {
            marginLeft: 8,
            borderRadius: 4,
          },
          onClick:() => {
            this.props.to(`/Site/IndustryManagement`);
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "场地名称"
        },
        {
          type: "field",
          field: "subject",
          title: "所在位置"
        }
      ],
      columns: [
        {
          title: "场地名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "所在位置",
          dataIndex: "subject",
          key: "subject",
        },
        {
          title: "操作",
          key: "handle",
          render: (record) => (
            <span>
              <Button
                className="buttonListFirst"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`/Site/PointManagement?id=${record.id}`);
                }}
              >
                点位管理
              </Button>
              <Button
              	className="buttonListSecond"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.setState({
                    visible: true,
                    editType: false,
                    editAddressData:record
                  })
                }}
              >
                编辑
              </Button>
            </span>
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
    };
    return (
    <section className="SiteManagement-page">
      <TableExpand
        {...config}
      />
      <Modal
        width="35%"
        height="auto"
        visible={this.state.visible}
        title="编辑场地"
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          this.setState({ visible: false });
        }}
      >
        <div>
          <Form onSubmit={this.handleEdit}>
            {
              siteInfo.map((b,i) =>{
                return(
                  <FormItem
                    key={i}
                    label={`${b.content}`}
                    {...formItemLayout}
                  >
                    {b.type === 'select' ? 
                    getFieldDecorator(`${b.keyName}`,{
                      rules: [{
                        message: '必选项',
                        required: b.removeRequired?false:true
                      }],
                      initialValue :this.state.editAddressData && this.state.editAddressData[b.keyName] || undefined
                    })(
                        <Select style={{width:'100%'}}>
                          {
                            b.children && b.children.length > 0 ? b.children.map(e => {
                              return <Option value={e.id} key={e.id}>{e.name}</Option>
                            }) : []
                          }
                        </Select>
                      ) : 
                    b.type === 'cascader' ?
                    getFieldDecorator(`${b.keyName}`, {
                      rules: [{ type: 'array', required: true, message: '请选择' }],
                      initialValue: this.state.editAddressData&&[this.state.editAddressData.province, this.state.editAddressData.city, this.state.editAddressData.district]
                    })(
                      <Cascader
                        options={area}
                        placeholder="请选择地址"
                        onChange={(value, selectedOptions) => {
                          this.setState({
                            editAddress: selectedOptions
                          }, () => {
                            let last = selectedOptions[selectedOptions.length - 1];
                          })
                        }}
                      />
                    ) : 
                    getFieldDecorator(`${b.keyName}`,{
                      rules: [{
                        message: '必选项',
                        required: true
                      }],
                      initialValue : this.state.editAddressData && this.state.editAddressData[b.keyName]
                    })(
                        <Input/>
                      )
                    }
                  </FormItem>
                )
              })
            }
            <div className="ta-c mt-20">
              <Button style={{ marginRight: 8 }} onClick={() => {
                this.setState({
                  visible: false
                })
                // this.props.form.resetFields(['name','residence'])
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">保存</Button>
            </div>
          </Form>
        </div>
      </Modal>
    </section>
  )
  }
}
const mapDispatchToProps = dispatch => {
  return {};
};

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getArea: state => state.get("rts").get("getArea"),
  postPlace: state => state.get("rts").get("postPlace"),
  postPlaceDetail: state => state.get("rts").get("postPlaceDetail"),
  getIndustries: state => state.get("rts").get("getIndustries"),
  getLandMark: state => state.get("rts").get("getLandMark"),
});

const SiteManagementForm = Form.create()(SiteManagement);

export default connect(mapStateToProps, mapDispatchToProps)(SiteManagementForm);



