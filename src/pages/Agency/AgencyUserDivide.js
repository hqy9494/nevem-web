import React from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import uuid from "uuid";
import {Row, Col, Panel, Tabs, Tab} from "react-bootstrap";
import {Form, Select, Button, Input, message, Switch, InputNumber, Modal, Table, Icon, Popconfirm} from "antd";
//import FormExpand from "../../components/FormExpand";
// import TableExpand from "../../components/TableExpand";
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
      disabled: false,
      checkState: false,
      role: true,
      roleData: [],//获取角色表
      terminalsData: [],//获取设备数据
      selectedTable: [],
      initSelectedTable: [],
      divideSelectedTable: [],
      //changeSelect:false
      recordDeleteArr: [],//记录要删除得id
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
    if (id && id !== "add") {
      this.setState({
        disabled: true,
      });
      this.getOne();
      this.getPositionDivides();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {getRole, getTerminals, getPositionDivides} = nextProps;
    const {selectedTable, initSelectedTable} = this.state;
    const id = this.props.match.params.id;
    if (getRole && getRole[this.uuid]) {
      this.setState({
        roleData: getRole[this.uuid],
      })
    }


    //获取设备
    if (getTerminals && getTerminals[this.uuid] && getTerminals[this.uuid].data) {

      // let data = getTerminals[this.uuid].data.map(v => {
      //   const bol = selectedTable.some(k => k.id === v.id);
      //   return Object.assign(v, {mystatus: bol, count: null})
      // }).filter(v => v.id !== id);
      // this.setState({
      //   terminalsData: data,
      // });
      let data = getTerminals[this.uuid].data.map(v => {
        const bol = selectedTable.some(k => k.id === v.id);
        return Object.assign(v, {mystatus: bol, count: 1})
      }).filter(v => !initSelectedTable.some(k => k.position && k.position.id === v.id));

      // console.log(data,"data")

      this.setState({
        terminalsData: data,
      });
    }

    // 获取回来的分成
    if (getPositionDivides && getPositionDivides[this.uuid]) {
      this.setState({
        selectedTable: getPositionDivides[this.uuid].data,
        getPositionDividesTotal: getPositionDivides[this.uuid].total,
        initSelectedTable: getPositionDivides[this.uuid].data,
      })
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
        // console.log(v,"pageInfo")
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


  submitNew = e => {
    const id = this.props.match.params.id;
    const {
      selectedTable,
      recordDeleteArr,
      initSelectedTable,
      show,
      divideSelectedTable,
      setRole,
      initRole
    } = this.state;
    const initArr = [...initSelectedTable]; //过滤和接口一致的数据
    let initDivideArr = [];               //记录提交的数组divideSelectedTable 哪些数据是已存在数据库的
    let selectedTableDivideArr = [];      //记录提交的数组divideSelectedTable 哪些数据是来自本地添加并不存在数据库的  注：从数据库获取回来的点位分成数据结构和本地添加的完全不一致，因此提交需要分开

    // console.log(initArr.length,"initArr")
    if (initArr.length>0){
      initArr.map(item => {
        divideSelectedTable.map(v => {
          if (item.id === v.id) {
            initDivideArr.push(v)
          }
          else {
            selectedTableDivideArr.push(v)
          }
        })
      });
    }
    else {
      selectedTableDivideArr=[...divideSelectedTable];
      // this.setState({
      //   selectedTableDivideArr:divideSelectedTable
      // });
    }


    let divideVal = {};//重构提交分成结构
    divideVal.accountId = id;
    divideVal.position = [];
    // 重构来自接口的数据
    initDivideArr.map((v) => {
      let divideInitDetails = {
        id: v.position && v.position.id,
        count: v.count,
      };
      divideVal.position.push(divideInitDetails);
      return divideVal.position
    });
    // 重构本地添加的
    selectedTableDivideArr.map((v) => {
      let divideLocalDetails = {
        id: v.id,
        count: v.count,
      };
      divideVal.position.push(divideLocalDetails);
      return divideVal.position
    });

    // console.log(initDivideArr, "initDivideArr");
    // console.log(selectedTableDivideArr, "selectedTableDivideArr");
    // console.log(divideVal, "divideVal");


    let val = {};
    val.accountId = id;
    val.roleId = setRole.toString();


// 新增/编辑点位分成
//     this.props.rts(
//       {
//         method: "post",
//         url: `/PositionDivides`,
//         data: divideVal
//       },
//       this.uuid,
//       "newPage",
//       (v) => {
//         console.log(v, "/PositionDivides");
//
//         // this.props.goBack();
//
//       }
//     );

    // if (initRole !== setRole) {
    //   // 修改角色
    //   this.props.rts(
    //     {
    //       method: "post",
    //       url: `/accounts/role/set`,
    //       data: val
    //     },
    //     this.uuid,
    //     "newPage",
    //     (v) => {
    //       console.log(v, "vvvvvvvvvvvvvvvvvvv")
    //       //this.props.goBack();
    //
    //     }
    //   );
    //
    // }


    if (show) {
      if (recordDeleteArr.length > 0) {
        recordDeleteArr && recordDeleteArr.map((v, i) => {
          return this.deleteButton(v.id)
        });
      }

    } else {

      initSelectedTable && initSelectedTable.map((v, i) => {
        return this.deleteButton(v.id)
      });
    }


  };

  // Model ok
  handleOk = () => {
    // let newSelectedTable=[];
    // this.state.selectedTable.map((v)=>{
    //
    //   let position={
    //     id:v.id,
    //       name:v.name,
    //   };
    //   newSelectedTable.push(position,v.count)
    //   return newSelectedTable
    //   },
    //
    //
    // );
    this.setState({
      visible: false,
      divideSelectedTable: this.state.selectedTable
    })
  };
  handleSearch = (selectedKeys, confirm) => () => {
    confirm();
    this.setState({searchText: selectedKeys[0]});
  };

  handleReset = clearFilters => () => {
    clearFilters();
    this.setState({searchText: ''});
  };

  // 获取改变的InputNumber值
  changeInputNumber = (msg, value) => {
    msg.count = value;
    // this.setState({
    //   divideSelectedTable: this.state.divideSelectedTable.map(v => v.count === value ? v : Object.assign(v, {count: value})),
    // });
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

  //删除已选中二级代理

  deleteButton = (val) => {
    // console.log(val, "deleteButton")
    const removeSelected = [...this.state.selectedTable];
    this.props.rts(
      {
        method: "delete",
        url: `/PositionDivides/${val}`,
      },
      this.uuid,
      "AgentRelationsRelieve",
      (v) => {
        this.setState({
          divideSelectedTable: removeSelected.filter(item => item.id !== val),
          terminalsData: this.state.terminalsData.map(v => v.id !== val ? v : Object.assign(v, {mystatus: !v.mystatus}))
        })
      }
    );
  };

  // 记录选择删除得信息
  recordDelete = (val) => {
    // console.log(val, "recordDelete")
    // let recordDeleteArr=[];

    const removeSelected = [...this.state.selectedTable];
    // console.log(this.state.recordDeleteArr.concat(this.state.initSelectedTable.filter((item)=> item.id ===val.id)),"initSelectedTable")
    this.setState({
      divideSelectedTable: removeSelected.filter(item => item.id !== val.id),
      terminalsData: this.state.terminalsData.map(v => v.id !== val.id ? v : Object.assign(v, {mystatus: !v.mystatus})),
      recordDeleteArr: this.state.recordDeleteArr.concat(this.state.initSelectedTable.filter((item) => item.id === val.id))
    });
  };

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {pageInfo, match} = this.props;
    const id = match.params.id;
    // console.log(id, match);

    // roleData下拉框的值
    const {disabled, roleData, terminalsData, selectedTable, divideSelectedTable, show, initSelectedTable,setRole} = this.state;
    let page = {};


    if (pageInfo && pageInfo[this.uuid]) {
      page = pageInfo[this.uuid];
    }


    // console.log(page, "page");
    // console.log(selectedTable, "selectedTable");
    // console.log(divideSelectedTable, "divideSelectedTable");

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
        // {
        //   title: "代理商名称",
        //   dataIndex: "totalPrice",
        //   render: (text, record) => <span>￥ {(Math.floor(record.price * record.count * 100) / 100 )}</span>
        // }
      ],
    };
    // 复选框
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({selectedTable: [...this.state.initSelectedTable, ...selectedRows]});
      },
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
    // 新建用户 投资者的列表
    const config = {

      data: divideSelectedTable,
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
               //value={record.count?record.count:1}
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
    return (
      <Panel>
        <Form onSubmit={this.submitNew}>
          <div>
            <div style={{maxWidth: 750}}>
              {/*<FormItem {...formItemLayout} label="角色">*/}
              {/*{getFieldDecorator(`roleId`, {*/}
              {/*rules: [{required: true, message: '请为该用户选择一个角色'}],*/}
              {/*initialValue: page && page.role ? page.role.name : "请为该用户选择一个角色",*/}

              {/*})(*/}
              <Select
                style={{width: "100%"}}
                //disabled={disabled}
                onChange={this.changeSelectedVal}
                value={setRole}
                // defaultValue={page && page.role && page.role.name}
              >
                {
                  roleData && roleData.map((val, key) => {
                    return <Option value={val.id} key={key}>{val.name}</Option>
                  })
                }
              </Select>
              {/*)}*/}
              {/*</FormItem>*/}

            </div>
            {
              show ?
                (
                  <FormItem
                    {...formItemLayout}
                    wrapperCol={{span: 24, offset: 0}}
                  >
                    {getFieldDecorator(`role`, {})(
                      <div>
                        <Button
                          type="primary"
                          onClick={() => {
                            this.getTerminals();
                            this.setState({visible: true})
                          }}
                          //onClick={this.setState({visible:true})}
                        >
                          添加
                        </Button>
                        <Table
                          rowKey='id'
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
                    )}
                  </FormItem>
                )
                : ""
            }


            <FormItem wrapperCol={{span: 12, offset: 6}}>
              {
                id && id === 'add' &&
                <ButtonGroup>

                  <Button type="primary" htmlType="submit"
                          onSubmit={values => {
                            this.submitNew(values)
                          }}
                  >
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
              }
              {
                id && id !== 'add' &&
                <ButtonGroup>
                  <Button type="primary" htmlType="submit"
                          onSubmit={values => {
                            this.submitNew(values)
                          }}
                  >
                    确认修改
                  </Button>
                  <Button
                    onClick={() => {
                      this.props.goBack();
                    }}
                  >
                    返回
                  </Button>
                </ButtonGroup>
              }

            </FormItem>

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
          <ButtonGroup>

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
