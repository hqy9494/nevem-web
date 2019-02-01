import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Panel, Tabs, Tab } from "react-bootstrap";
import FormSubmit from "../../components/Form/FormSubmit";
import DetailTemplate from "../../components/DetailTemplate"
import { Row, Col,Icon, Form, Select, Button, Card,Alert,Tree,message } from "antd";
import { getParameterByName } from '../../utils/utils';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

message.config({
  top: 60
});

export class RoleManagerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isApiRender:false,isMenuRender:false};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  	// console.log(this.props,'this.props');
    if (this.props.match.params.id) {
      this.getRoles();
      this.getRoleMenu();
      this.getRoleApi();
    }
    this.getAllMenu();
    this.getAllApi();
  }
	shouldComponentUpdate(newProps, newState){
		if(newState.isApiRender && newState.isMenuRender)return true;
		return false;
	}
  componentWillReceiveProps(nextProps) {}

// 获取当前角色
  getRoles = () => {
    this.props.rts(
      {
        method: "get",
        url: `/roleMenus/roles`
      },
      this.uuid,
      "roles",
      roles => {
        let form = {};
        roles.map(r => {
          if (r.id == this.props.match.params.id) {
            form = r;
          }
        });
        this.setState({ form });
      }
    );
  };

  getRoleUser = (roleId = this.props.match.params.id) => {
    roleId &&
      this.props.rts(
        {
          method: "get",
          url: `/roleMenus/users/${roleId}`
        },
        this.uuid,
        "users"
      );
  };
  submitDesc = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.rts(
          {
            method: "put",
            url: `/roleMenus/role/${this.props.match.params.id}`,
            data: values
          },
          this.uuid,
          "submitDesc",
          result => {
            message.success("修改成功", 3, () => {
              this.getRoles();
            });
          }
        );
      }
    });
  };

  //菜单
  // 获取所有菜单目录
  getAllMenu = () => {
    this.props.rts(
      {
        method: "get",
        url: `/menus/all`
      },
      this.uuid,
      "allMenu",
      ()=>{
      	this.setState({isMenuRender:true});
      }
    );
  };

  // 传roleId去更改菜单权限
  // 根据当前角色去查菜单权限
  getRoleMenu = (roleId = this.props.match.params.id) => {
    roleId &&
      this.props.rts(
        {
          method: "get",
          url: `/roleMenus/${roleId}`
        },
        this.uuid,
        "roleMenu",
        roleMenu => {
          let checkedKeys = [];
          roleMenu.map((rm, i) => {
            if (rm.children) {
              rm.children.map((rmc, j) => {
                checkedKeys.push(rmc.id);
              });
            }
          });
          // 记录tree组件的勾选
          this.setState({ menuCheckedKeys: checkedKeys });
        }
      );
  };
  // 监控菜单是否勾选
  onMenuCheck = checkedKeys => {
    this.setState({ menuCheckedKeys: checkedKeys });
  };

  submitMenu = () => {
    let { menuCheckedKeys = [] } = this.state;

    const { allMenu } = this.props;
    let able =false;
    // 存储新的数组，用于数据提交监控enable的值改变
    let postMenuCheckedKeys =[];
    // 全部id
    let allMenuValue =[];

    if (allMenu && allMenu[this.uuid]) {
      allMenu[this.uuid].map((am, i) => {
        // 把父元素id存进全部id的数组里
        allMenuValue.push({id:am.id,enable:am.enable});

        if (am.children) {
          am.children.map(amc => {
            // 把子元素id存进全部id的数组里
            allMenuValue.push({id:amc.id,enable:amc.enable});
            // 检测选了子元素把父元素id也提交
            if (
              menuCheckedKeys.indexOf(amc.id) > -1 &&
              menuCheckedKeys.indexOf(am.id) === -1
            ) {
              menuCheckedKeys.push(am.id);
            }
          });
        }
      });

    }


    // 判断菜单被勾选的
    // 用存进全部id的数组（即allMenuValue）判断是否存在被勾选的数组（即menuCheckedKeys）中，存在enable值为true否则为false
    allMenuValue.map((val,key) =>{
       if(menuCheckedKeys.indexOf(val.id) != -1){
         able=true;
         postMenuCheckedKeys.push({id:val.id,enable:able});
       }else{
         able=false;
         postMenuCheckedKeys.push({id:val.id,enable:able});

       }
    });



    let menus = postMenuCheckedKeys.map(ck => {

      return { id: ck.id,enable:ck.enable };
    });


    this.props.match.params.id &&
      this.props.rts(
        {
          method: "post",
          url: `/roleMenus`,
          data: {
            roleId: Number(this.props.match.params.id),
            menus
          }
        },
        this.uuid,
        "submitMenu",
        () => {
          message.success("修改成功", 3, () => {
            this.getRoleMenu();
          });
        }
      );
  };



  //接口
  // 获取所有接口
  getAllApi = () => {
    this.props.rts(
      {
        method: "get",
        url: `/Permissions/methods`
      },
      this.uuid,
      "allApi",
      (res)=>{
      	this.setState({isApiRender:true});
      }
    );
  };


// 获取某个角色有权限的接口
  getRoleApi = () => {
  	const name = getParameterByName('name');
    if (name) {
      this.props.rts(
        {
          method: "get",
          url: `/Permissions/methods/${name}/allow`
        },
        this.uuid,
        "roleApi",
        roleApi => {
          let checkedKeys = [];
          roleApi.map((rm, i) => {
            if (rm.methods) {
              rm.methods.map((rmc, j) => {
                checkedKeys.push(`${rm.model}-${rmc.property}`);
              });
            }
          });
          this.setState({ apiCheckedKeys: checkedKeys });
        }
      );
    }
  };
  onApiCheck = checkedKeys => {
    this.setState({ apiCheckedKeys: checkedKeys });
  };


  submitApi = () => {
    const { allApi, roleApi } = this.props;
    // 勾选的值
    let { apiCheckedKeys = [] } = this.state;
    // let models = allApi[this.uuid].map(ra => ra.model);
    // let oldApi = [];

    let postApiCheckedKeys =[];

    // 获取全部api信息
    let allApiValue  =[],permission="ALLOW";

 // 这是我的代码
    if (allApi && allApi[this.uuid]) {
      allApi[this.uuid].map((am, i) => {
        // 把父元素id存进全部id的数组里
        // allApiValue.push({model:am.model});

        if (am.methods) {
          am.methods.map(amc => {

            // 把子元素id存进全部id的数组里
            allApiValue.push({model:`${am.model}-${amc.name}`});
            // 检测选了子元素把父元素id也提交
            if (
              apiCheckedKeys.indexOf(amc.model) > -1 &&
              apiCheckedKeys.indexOf(am.model) === -1
            ) {
              apiCheckedKeys.push(am.model);
            }
          });
        }
      });

    }



// 判哪些接口被勾选的，未勾选permission="DENY"，勾选permission="ALLOW";
    allApiValue.map((val,key) =>{
      let data={};
     if(val.model.indexOf("-") == -1){
       data={
         model: val,
       };
     }else {
       data={
         model: val.model.split("-")[0],
         property: val.model.split("-")[1],
         permission: permission
       };
     }

      if(apiCheckedKeys.includes(val.model)){
        permission="ALLOW";
        data.permission = permission;
        postApiCheckedKeys.push(data);
      }else{

        permission="DENY";
        data.permission = permission;
        postApiCheckedKeys.push(data);

      }
    });


    let acls = postApiCheckedKeys.map(ck => {
      return { model: ck.model,property: ck.property ,permission: ck.permission};
    });

// 源哥的代码
    /*
    roleApi && roleApi[this.uuid].map(rm => {
      if (rm.methods) {
        rm.methods.map((rmc, j) => {
           oldApi.push(`${rm.model}-${rmc.property}`);
        });
      }
    });
    apiCheckedKeys = apiCheckedKeys.filter(cs => models.indexOf(cs) === -1);
    let acls = [];

    apiCheckedKeys.map(cs => {
      acls.push({
        model: cs.split("-")[0],
        property: cs.split("-")[1],
        permission: "ALLOW"
      });

    });

    oldApi.map(oa => {
      if (apiCheckedKeys.indexOf(oa) === -1) {
        acls.push({
          model: oa.split("-")[0],
          property: oa.split("-")[1],
          permission: "DENY"
        });
      }else{
        acls.push({
          model: oa.split("-")[0],
          property: oa.split("-")[1],
          permission: "ALLOW"
        });
      }
    });


     */
    this.props.params &&
      this.props.params.name &&
      this.props.rts(

        {
          method: "post",
          url: `/Permissions/set`,
          data: {
            roleName: decodeURIComponent(this.props.params.name),
            acls
          }
        },
        this.uuid,
        "submitApi",
        () => {
          message.success("修改成功", 3, () => {
            this.getRoleApi();
          });
        }
      );
  };




  // dealApi = apis => {
  //   return apis.map(api => {
  //     let newMethods = [],
  //       newMethodNames = [];
  //       api.methods.map(ams => {
  //         if (ams && newMethodNames.indexOf(`${api.model}-${ams.name}`) === -1) {
  //           newMethodNames.push(`${api.model}-${ams.name}`);
  //           newMethods.push(ams);
  //         } else {
  //         }
  //       });
  //     return {
  //       ...api,
  //       methods: newMethods
  //     };
  //   });
  // };

  fixApi = data => {
    let res = []

    data.forEach(v => {
      if (v.methods.length > 0) {
        res.push(v)
      }
    })
    return res
  }
	sortFn = (list)=>{
		list.sort((last,next)=>last.model>=next.model?1:-1);
		return list;
	}
  render() {
    const { getFieldDecorator } = this.props.form;
    const { form = {},apiCheckedKeys,menuCheckedKeys } = this.state;
    const { allMenu, allApi, users } = this.props;
    let row_menu = [],
      row_api = [],
      row_users = [];
    if (allMenu && allMenu[this.uuid]) {
      row_menu = allMenu[this.uuid];
    }
    if (allApi && allApi[this.uuid]) {
      row_api = this.sortFn(this.fixApi(allApi[this.uuid]));
    }
    if (users && users[this.uuid]) {
      row_users = users[this.uuid];
    }
    const child = (
    	<Panel>
          <Row type="flex" justify="space-around" align="top">
            <Col span={11}>
              <Card title="接口权限"  hoverable>
                <Tree
                  checkable
                  autoExpandParent
                  onCheck={this.onApiCheck}
                  checkedKeys={apiCheckedKeys}
                >
                  {row_api.map((r, i) => {
                    if (r.methods) {
                      return (
                        <TreeNode title={r.description || r.model} key={r.description || r.model}>
                          {r.methods.map((rc, j) => (
                            <TreeNode
                              title={rc.description}
                              key={`${r.model}-${rc.name}`}
                            />
                          ))}
                        </TreeNode>
                      );
                    } else {
                      return <TreeNode title={r.model} key={r.model} />;
                    }
                  })}
                </Tree>
                <ButtonGroup>
                  <Button
                    type="primary"
                    style={{ margin: "15px 0" }}
                    onClick={this.submitApi}
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
              </Card>
            </Col>
            <Col span={11}>
              <Card title="菜单权限"  hoverable>
                <Tree
                  checkable
                  defaultExpandAll
                  autoExpandParent
                  onCheck={this.onMenuCheck}
                  checkedKeys={this.state.menuCheckedKeys}
                >
                  {row_menu.map((r, i) => {
                    if (r.children) {
                    	return (
                        <TreeNode title={r.name} key={r.id}>
                          {r.children.map((rc, i) => (
                          	<TreeNode 
	                          	title={rc.name}
	                          	key={rc.id}
                          	/>
                          ))}
                        </TreeNode>
                      );
                    } else {
                      return <TreeNode title={r.name} key={r.id} />;
                    }
                  })}
                </Tree>
                <ButtonGroup>
                  <Button
                    type="primary"
                    style={{ margin: "15px 0" }}
                    onClick={this.submitMenu}
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
              </Card>
            </Col>

          </Row>
        </Panel>
    	
    )
    return (
      <section className="RoleManagerDetail-page">
      	<DetailTemplate
	      	config = {this.props.config}
	      	title = {form && form.description || this.props.title}
	      	child={child}
	      	removeAllButton
	      />
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const RoleManageruuid = state => state.get("rts").get("uuid");
const allMenu = state => state.get("rts").get("allMenu");
const allApi = state => state.get("rts").get("allApi");
const users = state => state.get("rts").get("users");
const roleApi = state => state.get("rts").get("roleApi");

const mapStateToProps = createStructuredSelector({
  RoleManageruuid,
  allMenu,
  allApi,
  users,
  roleApi
});

const WrappedRoleManagerDetail = Form.create()(RoleManagerDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedRoleManagerDetail
);
