import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Row, Col, Panel, Tabs, Tab} from "react-bootstrap";
import {Form, Select, Button, Input, message, Switch, InputNumber,Modal,Table,Icon,Divider,Popconfirm} from "antd";
import { getRegular } from '../../components/CheckInput';
import FormExpand from "../../components/FormExpand";
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14}
};

export class AgencyListDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      checkState: false,
      role: true,
      roleData: [],
      show: false,
      showFlag:false,
      agentsData: [],
      selectedTable: [],
      getAgentLowerData:[],
      getAgentLowerTotal:"",
      initSelectedTable: [],
      switchChecked:"",
      recordDeleteArr:[]//记录要解绑得id
    };
    this.uuid = uuid.v1();
  }

  componentDidMount() {
    const {params} =  this.props.match;
    const {id} = params;
    const {showFlag}=this.state;
    const {getAgentLower}=this.props;
    this.getRole();
    if (id && id !== "add") {


      this.setState({
        disabled: true,
      });
      this.getOne();
      this.getAgentLower();
    }

  }

  componentWillReceiveProps(nextProps) {
    const {getRole,getAgents,getAgentLower} = nextProps;
    const {selectedTable} = this.state;
    const id = this.props.match.params.id;
    // console.log(id,"nextPropsId")


    if (getRole && getRole[this.uuid]) {
      this.setState({
        roleData: getRole[this.uuid],
      })
    }

    // 处理已绑定的代理商
    if (getAgents && getAgents[this.uuid] && getAgents[this.uuid].data) {
      let data = getAgents[this.uuid].data.map(v => {
        const bol = selectedTable.some(k => k.id === v.id);
        return Object.assign(v, {mystatus: bol})
      }).filter(v =>v.level === null&& v.id !==id);
      this.setState({
        agentsData: data,
      });
    }

    if (getAgentLower && getAgentLower[this.uuid]) {
      this.setState({
        selectedTable: getAgentLower[this.uuid].data || [],
        getAgentLowerTotal: getAgentLower[this.uuid].total,
        initSelectedTable: getAgentLower[this.uuid].data || [],//记录回来的代理商，不变
      });
    }

  }
// 获取该信息
  getOne = (id = this.props.match.params.id) => {
    id &&
    this.props.rts(
      {
        method: "get",
        url: `/Agents/${id}`
      },
      this.uuid,
      "pageInfo"
    );
  };
  // 获取代理商下级列表
  getAgentLower = (id = this.props.match.params.id) => {
    id &&this.props.rts(
      {
        method: "get",
        url: `/Agents/${id}/lower`
      },
      this.uuid,
      "getAgentLower",
      (v) => {
        if(v.total > 0){
          this.setState({
            show:true,
          });
        }
      }
    );
  };



  // 获取角色
  getRole = (id = this.props.match.params.id) => {
    this.props.rts(
      {
        method: "get",
        url: `/Agents/roles`
      },
      this.uuid,
      "getRole"
    );
  };

  // 获取代理商列表
  getAgents = () => {
    this.props.rts(
      {
        method: "get",
        url: `/Agents`
      },
      this.uuid,
      "getAgents"
    );
  };

  // 数据提交
  submitNew = e => {
    const id = this.props.match.params.id;
    const {recordDeleteArr,switchChecked,show,initSelectedTable}=this.state;


    e.preventDefault();
    this.props.form.validateFields((err, values) => {
    	values.direct = values.direct?true:false;
      values.roleId += '';
      values.mobile += '';
      values.AgencyList = this.state.selectedTable;
      let AgentRelations={};
      AgentRelations.ids=this.state.selectedTable &&  this.state.selectedTable.map((v) => v.id);
           if (!err) {
        if(id && id !== "add"){
         this.props.rts(//绑定代理商

           {
             method: "post",
             url: `/AgentRelations/${id}/bind`,
             data: AgentRelations
           },
           this.uuid,
           "AgentRelations",
           (v) => {

             this.props.goBack();
           }
         );
          if(show){
            if (recordDeleteArr.length > 0) {
              recordDeleteArr && recordDeleteArr.map((v,i)=>{
                return this.deleteButton(v.id)
              });
            }

          }else {
            initSelectedTable && initSelectedTable.map((v,i)=>{
              return this.deleteButton(v.id)
            });
          }
        }else {
          this.props.rts(
            {
              method: "post",
              url: `/Agents/agent`,
              data: values
            },
            this.uuid,
            "newPage",
            (v) => {

              let agentId= v.agent&& v.agent.id;

              this.props.rts(
                {
                  method: "post",
                  url: `/AgentRelations/${agentId}/bind`,
                  data: AgentRelations
                },
                this.uuid,
                "AgentRelations",
                (v) => {

                  this.props.goBack();
                }
              );

            }
          );
        }

      }

    })

  };

  // 检测switch个change值
  changeSwitch =checked=>{
    if (checked){
      this.setState({
        show:true,
       // switchChecked:true,
      })

    }
    else {
      this.setState({
        show:false,
       // switchChecked:false,
      })
    }
  };

  // Model ok
  handleOk = () =>{

    this.setState({visible:false})
  };

// 表格搜索按钮
  handleSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };
// 表格搜索重置按钮
  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: '' });
  };

//新建代理商中删除已选中二级代理

  deleteButton=(val)=>{

    const removeSelected = [...this.state.selectedTable];
    const id = this.props.match.params.id;

      let AgentRelationsRelieve={};
      AgentRelationsRelieve.childId=val;
      this.props.rts(
        {
          method: "post",
          url: `/AgentRelations/${id}/relieve`,
          data: AgentRelationsRelieve
        },
        this.uuid,
        "AgentRelationsRelieve",
        (v) => {
          this.setState({
            selectedTable:removeSelected.filter(item=>item.id !==val),
            agentsData: this.state.agentsData.map(v => v.id !== val ? v : Object.assign(v, {mystatus: !v.mystatus}))
          })
        }
      );
  };

  // 记录选择删除得信息
  recordDelete=(val)=>{
    // let recordDeleteArr=[];

    const removeSelected = [...this.state.selectedTable];
    // console.log(this.state.recordDeleteArr.concat(this.state.initSelectedTable.filter((item)=> item.id ===val.id)),"initSelectedTable")
    this.setState({
      selectedTable:removeSelected.filter(item=>item.id !==val.id),
      agentsData: this.state.agentsData.map(v => v.id !== val.id ? v : Object.assign(v, {mystatus: !v.mystatus})),
      recordDeleteArr: this.state.recordDeleteArr.concat(this.state.initSelectedTable.filter((item)=> item.id ===val.id))
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {pageInfo, match} = this.props;
    const id = match.params.id;

    // roleData下拉框的值,show 判断switch是否为true


    const {disabled, roleData,show,agentsData,selectedTable,getAgentLowerData,getAgentLowerTotal,showFlag} = this.state;





    // 获取回来的数据额
    let page = {};
    if (pageInfo && pageInfo[this.uuid]) {
      page = pageInfo[this.uuid];
    }


// 二级代理商的表格
    const config2 = {
      data: selectedTable &&  selectedTable.map((v,i) => {
        return {
          ...v,
          key: i
        }
      }),

      columns: [
        {
          title: "代理名称",
          dataIndex: "name",
          key: "name",
        },
        // {
        //   title: "代理账号",
        //   dataIndex: "balance",
        //   key: "balance",
        // },
        {
          title: "操作",
          render: (text, record) => (
             <span>

             <Popconfirm
             title="确认删除该代理商?"
             onConfirm={() => {
               // this.deleteButton(record)
               this.recordDelete(record)

             }}
             okText="是"
             cancelText="否"
             >
             <Button
               className="buttonListDanger"
               size="small"
               style={{marginRight: '5px', color: "#ffffff", background: "#f3b981", borderColor: "#f3b981"}}
               //onClick={()=>{
               //  this.deleteButton(record)
               //}}
             >
                  删除
                </Button>
             </Popconfirm>

           </span>
         )
        },
      ],

    };






// 添加代理商的表格
    const config1 = {
      data: agentsData && agentsData.map((v,i) => {
        return {
          ...v,
          key: i
        }
      }),

      columns: [
        {
          title: "代理名称",
          dataIndex: "name",
          key: "name",
          filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div className="custom-filter-dropdown">
              <Input
                ref={ele => this.searchInput = ele}
                placeholder="代理商名称"
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={this.handleSearch(selectedKeys, confirm)}
              />
              <Button type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>搜索</Button>
              <Button onClick={this.handleReset(clearFilters)}>重重</Button>
            </div>
          ),
          filterIcon: filtered => <Icon type="search-o" style={{ color: filtered ? '#108ee9' : '#aaa' ,fontSize:"16px"}} />,
          onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              });
            }
          },
        },
        // {
        //   title: "代理账号",
        //   dataIndex: "balance",
        //   key: "balance",
        // },
      ],
    };
    // 复选框
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {


        this.setState({selectedTable: [...this.state.initSelectedTable, ...selectedRows]});

      },

      onSelect: (record, selected, selectedRows) => {

        this.setState({
          agentsData: agentsData.map(v => v.id !== record.id ? v : Object.assign(v, {mystatus: !v.mystatus}))
        })
      },
      getCheckboxProps: record => (
        // console.log(record.mystatus,record.name,"888888"),
        {
       //checked: record.name , // Column configuration not to be checked
       checked: record.mystatus , // Column configuration not to be checked
       name: record.name,
      }),
      onSelectAll: (selected, selectedRows, changeRows) => {
        if (selected) {
          this.setState({
            agentsData: agentsData.map(v => Object.assign(v, {mystatus: true}))
          })
        }else {
          this.setState({
            agentsData: agentsData.map(v => Object.assign(v, {mystatus: false}))
          })
        }
      },
    };


    const child = (
      <Panel>
        <Form onSubmit={this.submitNew}>
          <div >
            <div style={{maxWidth: 750}}>
              <FormItem
                {...formItemLayout}
                label="代理商"
              >
                {getFieldDecorator("name", {
                  rules: [{
                    required: true, message: '必填项',
                  }],
                  initialValue: page.name
                })(
                  <Input placeholder="请输入代理商名称" disabled={disabled}/>
                )}

              </FormItem>
              {
                id && id == 'add' &&
                <div>

                  <FormItem
                  {...formItemLayout}
                  label="账号"
                  >
                  {getFieldDecorator("username", {
                  rules: [{
                  required: true, message: '必填项',
                  }]
                  })(
                  <Input  placeholder="请输入账号"/>
                  )}
                  </FormItem>
                  <FormItem
                  {...formItemLayout}
                  label="密码"
                  >
                  {getFieldDecorator('password', {
                  rules: [{
                  required: true, message: '请输入密码',
                  }]
                  })(
                  <Input type="password" placeholder="请输入密码"/>
                  )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="登录手机号"
                  >
                    {getFieldDecorator("mobile", {
                      rules: [{
                        required: true,
                        message: '请输入正确的11位手机号',
                        pattern: getRegular('mobile-phone')
                      }],
                      initialValue: page.mobile

                    })(
                      <InputNumber placeholder="请输登录手机号" length={11} style={{width: "100%"}}/>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="业务角色">
                    {getFieldDecorator(`roleId`, {
                      rules: [{required: true, message: '请选择'}],
                      // initialValue: product && product.categoryId ? [product.categoryId] : []
                    })(
                      <Select
                        style={{width: "100%"}}
                        placeholder={"请选择业务角色"}
                        //defaultValue={this.state.role}
                        //value={this.state.role}
                        //onChange={val => {

                        //}}
                      >
                        {
                          roleData && roleData.map((val, key) => {
                            return <Option value={val.id} key={key}>{val.name}</Option>
                          })
                        }
                      </Select>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="代理属性">
                    {getFieldDecorator(`direct`, {
                      rules: [{required: true, message: '请选择'}],
                      // initialValue: product && product.categoryId ? [product.categoryId] : []
                    })(
                      <Select
                        style={{width: "100%"}}
                        placeholder={"请选择代理属性"}
                        //defaultValue={this.state.role}
                        //value={this.state.role}
                        //onChange={val => {

                        //}}
                      >
                        {/*{attribute && attribute.map((v,i) => {*/}
                          {/*return   <Option value={v.key} key={i}>{v.name}</Option>*/}
                        {/*})}*/}
                        <Option value={0} key={0}>一般代理</Option>
                        <Option value={1} key={1}>直属代理</Option>
                      </Select>
                    )}
                  </FormItem>
                </div>
              }
              {
                id && id == 'add' ?
                  (
                    <FormItem
                    {...formItemLayout}
                    label="是否授权二级代理"
                  >
                    {getFieldDecorator('switch', { valuePropName: 'checked' })(
                      <Switch
                        checkedChildren="是"
                        unCheckedChildren="否"
                        onChange={this.changeSwitch}
                      />
                    )}
                  </FormItem>
                  ):
                  (
                    <FormItem
                      {...formItemLayout}
                      label="是否授权二级代理"
                    >
                      {getFieldDecorator('switch', {
                        valuePropName: 'checked' ,
                        initialValue: getAgentLowerTotal && getAgentLowerTotal> 0 ? true:false
                      })(
                        <Switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          onChange={this.changeSwitch}
                        />
                      )}
                    </FormItem>
                  )





              }

            </div>
            {
              show?
                (
                  <FormItem
                    {...formItemLayout}
                    wrapperCol={{span: 24, offset: 0}}
                  >
                    {getFieldDecorator(`AgencyList`, {
                      initialValue: page && page.role ? page.role.name : 0
                    })(
                     //<TableExpand
                     //  {...config}
//
                     //  path={`${this.props.match.path}`}
                     //  replace={this.props.replace}
                     //  refresh={this.state.refreshTable}
                     //  onRefreshEnd={() => {
                     //    this.setState({refreshTable: false});
                     //  }}
                     ///>
                      <div>
                        <Button
                          type="primary"
                          onClick={()=>{
                            this.getAgents();
                            this.setState({visible:true})
                          }}
                          //onClick={this.setState({visible:true})}
                        >
                          添加
                        </Button>
                        <Table
                        	className="publicTable"
                          columns={config2.columns}
                          dataSource={config2.data}
                          locale={{
                            filterTitle: '筛选',
                            filterConfirm: '确定',
                            filterReset: '重置',
                            emptyText: '暂无数据'
                          }}
                          bordered
                        />
                      </div>

                    )}
                  </FormItem>
                ):""
            }

            {/*<FormItem wrapperCol={{span: 12, offset: 6}}>
                <ButtonGroup>

                  <Button type="primary" htmlType="submit"
                          onSubmit={values => {
                            this.submitNew(values)
                          }}>
                    保存
                  </Button>
                  <Button
                    onClick={() => {
                      this.props.goBack();
                    }}
                  >
                    取消
                  </Button>
                </ButtonGroup>

            </FormItem>*/}

          </div>
        </Form>
        <Modal
          width="70%"
          height="80%"
          visible={this.state.visible}
          title="选择代理"
          footer={null}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          <div style={{overflowY:"auto",maxHeight:"400px"}}>
            <Table
              columns={config1.columns}
              dataSource={config1.data}
              rowSelection={rowSelection}
              bordered
            />
          </div>
          <ButtonGroup>

            <Button type="primary" htmlType="submit"
                    onClick={ this.handleOk}>
              选择
            </Button>
            <Button
              onClick={() => {

                this.setState({ visible: false });

              }}
            >
              取消
            </Button>
          </ButtonGroup>
        </Modal>
      </Panel>
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
const getRole = state => state.get("rts").get("getRole");
const getAgents = state => state.get("rts").get("getAgents");
const getAgentLower = state => state.get("rts").get("getAgentLower");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  pageInfo,
  getRole,
  getAgents,
  getAgentLower,
});

const WrappedAgencyListDetail = Form.create()(AgencyListDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedAgencyListDetail
);
