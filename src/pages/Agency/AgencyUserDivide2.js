import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Row, Col, Panel, Tabs, Tab} from "react-bootstrap";
import {Form, Select, Button, Input, message, Switch, InputNumber, Modal, Table, Icon, Popconfirm} from "antd";
//import FormExpand from "../../components/FormExpand";
// import TableExpand from "../../components/TableExpand";
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 14}
};

export class UserListDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkState: false,
      role: true,
      roleData: [],//获取角色表
      initTerminalsData: [],
      terminalsData: [],
      initTableData: [],
      tableData: [],
      positionDividesData: [],
      show: false,
      initRole: "",//记录数据回来的角色
      setRole: "",//记录改变的角色值
    };
    this.uuid = uuid.v1();
  }

  componentDidMount() {
    const {params} = this.props.match;
    const {id} = params;
    this.getRole();
    this.getOne();
    this.getPositionDivides();
    this.getTerminals();
  }

  componentWillReceiveProps(nextProps) {
    const {getRole, getTerminals, getPositionDivides} = nextProps;
    if (getRole && getRole[this.uuid]) {
      this.setState({
        roleData: getRole[this.uuid],
      })
    }

    //获取设备
    if (getTerminals && getTerminals[this.uuid] && getTerminals[this.uuid].data && getPositionDivides && getPositionDivides[this.uuid]) {
      let positionDividesData = getPositionDivides[this.uuid].data;
      // console.log(positionDividesData, 'positionDividesData')

      let initTerminalsData = getTerminals[this.uuid].data.map(v => Object.assign(v, {mystatus: false, count: 1}))
      let terminalsData = initTerminalsData.filter(v => !positionDividesData.some(k => k.position && k.position.id === v.id))
      let initTableData = initTerminalsData.filter(v => {
        const item = positionDividesData.find(k => k.position && k.position.id === v.id)
        return item ? Object.assign(v, {count: item.count}) : false
      })
      let tableData = initTableData

      this.setState({
        initTerminalsData,
        terminalsData,
        initTableData,
        tableData,
        positionDividesData
      });
    }
  }

  getOne = (id = this.props.match.params.id) => {
    id &&
    this.props.rts(
      {
        method: "get",
        url: `/accounts/${id}`
      },
      this.uuid,
      "pageInfo",
      (v) => {
        console.log(v,"pageInfo")
        this.setState({

          initRole: v.role && v.role.id,
          setRole: v.role && v.role.id,
        });
        if (v.role && v.role.id === 18) {
          this.setState({
            show: true
          });
        } else {
          this.setState({
            show: false
          });
        }
      }
    );
  };
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
  // 获取设备
  getTerminals = (id = this.props.match.params.id) => {
    this.props.rts(
      {
        method: "get",
        url: `/Positions`,
        params: {
          filter: {
            include: ["place", "terminal"],
          },
        }
      },
      this.uuid,
      "getTerminals"
    );
  };


  //获取点位分成
  getPositionDivides = (id = this.props.match.params.id) => {
    this.props.rts(
      {
        method: "get",
        url: `/PositionDivides`,
        params: {
          filter: {
            where: {
              accountId: id
            }
          }
        }
      },
      this.uuid,
      "getPositionDivides",
      (v) => {
        this.setState({
          divideSelectedTable: v.data
        })
      }
    );
  };
  postPositionDivides = (params) => {
    this.props.rts(
      {
        method: "post",
        url: `/PositionDivides`,
        data: params
      },
      this.uuid,
      "newPage",
      (v) => {
        // console.log(v, "/PositionDivides");
      }
    );
  }
  postRole = (val) => {
    // 修改角色
    this.props.rts(
      {
        method: "post",
        url: `/accounts/role/set`,
        data: val
      },
      this.uuid,
      "newPage",
      (v) => {
        // console.log(v, "vvvvvvvvvvvvvvvvvvv")
      }
    )
  }

  //删除已选中二级代理
  deleteButton = (val) => {
    // const removeSelected = [...this.state.initTableData];
    this.props.rts(
      {
        method: "delete",
        url: `/PositionDivides/${val}`,
      },
      this.uuid,
      "AgentRelationsRelieve",
      (v) => {
        // this.setState({
        //   divideSelectedTable: removeSelected.filter(item => item.id !== val),
        //   terminalsData: this.state.terminalsData.map(v => v.id !== val ? v : Object.assign(v, {mystatus: !v.mystatus}))
        // })
      }
    );
  };
  submitNew = (e) => {
    e.stopPropagation()
    const {initTableData, tableData, setRole, initRole, show, positionDividesData} = this.state
    const id = this.props.match.params.id
    const dividesData = tableData.map(v => ({id: v.id, count: v.count}))
    // console.log(setRole, initRole)
    if (show){
      this.postPositionDivides({
        accountId: id,
        position: dividesData
      })
    }

    if (initRole !== setRole){
      this.postRole({
        accountId: id,
        roleId: setRole.toString()
      })
    }

    if (show) {
      let arr = positionDividesData.filter(v => !tableData.some(k => v.position && v.position.id === k.id))
      // console.log(arr, 'arr')
      arr.forEach(v => this.deleteButton(v.id))
    }else{
      positionDividesData.forEach(v => this.deleteButton(v.id))
    }

    this.props.goBack()
  }

  // Model ok
  handleOk = () => {
    let checkTableData = this.state.terminalsData.filter(v => v.mystatus)
    this.setState({
      visible: false,
      tableData: this.state.tableData.concat(checkTableData),
      terminalsData: this.state.terminalsData.filter(v => !checkTableData.some(k => k.id === v.id))
    })
  };

  // 获取改变的InputNumber值
  changeInputNumber = (msg, value) => {
    // console.log(msg, value, 123)
    this.setState({
      tableData: this.state.tableData.map(v => msg.id === v.id ? Object.assign(v, {count: value}) : v),
    });
  };
  changeSelectedVal = (value) => {
    this.setState({
      setRole: value,
    });
    // console.log(value)
    if (value === 18) {
      this.setState({
        show: true,
      })
    }
    else {
      this.setState({
        show: false,
        setRole: value,
        // switchChecked:false,
      })
    }
  };

  // 记录选择删除得信息
  recordDelete = (val) => {
    this.setState({
      terminalsData: this.state.terminalsData.concat(Object.assign(val, {mystatus: false})),
      tableData: this.state.tableData.filter(v => v.id !== val.id)
    });
  };

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {pageInfo, match} = this.props;
    const id = match.params.id;

    // roleData下拉框的值
    const {roleData, terminalsData, selectedTable, divideSelectedTable, show, initSelectedTable, setRole, tableData} = this.state;
    let page = {};

    if (pageInfo && pageInfo[this.uuid]) {
      page = pageInfo[this.uuid];
    }

// 选择添加设备列表
    const config1 = {
      data: terminalsData && terminalsData.map((v, i) => {
        return {
          ...v,
          key: i
        }
      }),
      columns: [
        {
          title: "设备编号",
          dataIndex: "terminal.code",
          key: "terminalCode",
        },
        {
          title: "场地地址",
          dataIndex: "count",
          key: "count",
          render: (text, record) => {
            return (
              <span>
                {record && record.place && record.place.province}
                {record && record.place && record.place.city}
                {record && record.place && record.place.district}
              </span>
            )
          }
        },
        {
          title: "场地名称",
          dataIndex: "place.name",
          key: "placeName",
        },
        {
          title: "点位名称",
          dataIndex: "name",
          key: "name",
        },
      ],
    };
    // 复选框
    const rowSelection = {
      // onChange: (selectedRowKeys, selectedRows) => {
      //   console.log(selectedRowKeys, selectedRows)
      //   // this.setState({selectedTable: [...this.state.initSelectedTable, ...selectedRows]});
      // },
      onSelect: (record, selected, selectedRows) => {
        this.setState({
          terminalsData: terminalsData.map(v => v.id !== record.id ? v : Object.assign(v, {mystatus: !v.mystatus}))
        })
      },
      getCheckboxProps: record => (
        {
          //checked: record.name , // Column configuration not to be checked
          checked: record.mystatus, // Column configuration not to be checked
          name: record.name,
        }),
      onSelectAll: (selected, selectedRows, changeRows) => {
        if (selected) {
          this.setState({
            terminalsData: terminalsData.map(v => Object.assign(v, {mystatus: true}))
          })
        } else {
          this.setState({
            terminalsData: terminalsData.map(v => Object.assign(v, {mystatus: false}))
          })
        }
      },
    };
    // console.log(tableData, 'render')
    // 新建用户 投资者的列表
    const config = {
      data: tableData,
      columns: [
        {
          title: "设备名称",
          dataIndex: "terminal.code",
          key: "terminalCode",
        },
        {
          title: "设备编号",
          dataIndex: "terminal.name",
          key: "terminalName",
        },
        {
          title: "点位名称",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <span>
              {record.name || record.position && record.position.name}
            </span>
          )
        },
        {
          title: "分成百分比(%)",
          dataIndex: "divide",
          key: "divide",
          render: (text, record) => (
            <span>
             <InputNumber
               min={1}
               max={100}
               // value={record.count ? record.count: 1}
               defaultValue={record.count ? record.count : 1}
               onChange={(value) => {
                 this.changeInputNumber(record, value)
               }}
             />
            </span>
          )
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
               title="确认删除此设备?"
               onConfirm={() => {
                 this.recordDelete(record)

               }}
               okText="是"
               cancelText="否"
             >
             <Button
               className="buttonListDanger"
               size="small"
               style={{marginRight: '5px', color: "#ffffff", background: "#f3b981", borderColor: "#f3b981"}}
             >删除</Button>
             </Popconfirm>
           </span>
          )
        },
      ],
    };
    const child = (
      <Panel>
        <Form onSubmit={this.submitNew}>
          <div>
            <div style={{maxWidth: 750,marginBottom:20, display: "flex", alignContent: "center",alignItems: "baseline"}}>
              <div style={{color: "#000000"}}>
                <div>选择角色：</div>
              </div>
              <div  style={{width: "30%"}}    >
                <Select
                  style={{width: "100%"}}
                  onChange={this.changeSelectedVal}
                  value={setRole}
                >
                  {
                    roleData && roleData.map((val, key) => {
                      return <Option value={val.id} key={key}>{val.name}</Option>
                    })
                  }
                </Select>
              </div>




            </div>
            {
              show ?
                <div>
                  <Button
                  	style={{marginBottom:10}}
                    onClick={() => {
                      this.setState({visible: true})
                    }}
                  >
                    添加
                  </Button>
                  <Table
                    rowKey='id'
                    className="publicTable"
                    columns={config.columns}
                    dataSource={config.data}
                    locale={{
                      filterTitle: '筛选',
                      filterConfirm: '确定',
                      filterReset: '重置',
                      emptyText: '暂无数据'
                    }}
                    bordered
                  />
                </div>
                : ""
            }
	        </div>
        </Form>
        <Modal
          width="70%"
          height="80%"
          visible={this.state.visible}
          title="选择设备"
          footer={null}
          onCancel={() => {
            this.setState({visible: false});
          }}
        >
          <div style={{overflowY: "auto", maxHeight: "400px"}}>
            <Table
            	className="publicTable"
              columns={config1.columns}
              dataSource={config1.data}
              rowSelection={rowSelection}
              locale={{
                filterTitle: '筛选',
                filterConfirm: '确定',
                filterReset: '重置',
                emptyText: '暂无数据'
              }}
              bordered
            />
          </div>
          <ButtonGroup style={{paddingTop:10}}>

            <Button type="primary" htmlType="submit"
                    onClick={this.handleOk}>
              选择
            </Button>
            <Button
              onClick={() => {

                this.setState({visible: false});

              }}
            >
              取消
            </Button>
          </ButtonGroup>
        </Modal>
      </Panel>
    );
     return (
      <section>
	      <DetailTemplate
	      	config = {this.props.config}
	      	title = {this.props.title}
	      	child={child}
	      	onCancle={this.props.goBack}
	      	okText={'确认修改'}
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
const getTerminals = state => state.get("rts").get("getTerminals");
const getPositionDivides = state => state.get("rts").get("getPositionDivides");

const mapStateToProps = createStructuredSelector({
  StaffManageruuid,
  pageInfo,
  getRole,
  getTerminals,
  getPositionDivides,
});

const WrappedUserListDetail = Form.create()(UserListDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedUserListDetail
);
