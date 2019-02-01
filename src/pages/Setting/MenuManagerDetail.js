import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Row, Col, Panel, Tabs, Tab } from "react-bootstrap";
import FormExpand from "../../components/FormExpand";
import DetailTemplate from "../../components/DetailTemplate"
import {
  Form,
  Select,
  Button,
  Input,
  InputNumber,
  Checkbox,
  message
} from "antd";
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class MenuManagerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getMenu(this.props.match.params.id);
      this.getMenuRoles(this.props.match.params.id);
    }
    this.getOne();
    this.getRoles();
  }

  componentWillReceiveProps(nextProps) {}

  getMenu = id => {
    id &&
    this.props.rts(
      {
        method: "get",
        url: `/menus/${this.props.match.params.id}`
      },
      this.uuid,
      "menu"
    );
  };

  getMenuRoles = id => {
    id &&
    this.props.rts(
      {
        method: "get",
        url: `/roleMenus/${id}`
      },
      this.uuid,
      "menuRoles",
      result => {
        this.setState({
          roles: result.map(r => {
            return r.id;
          })
        });
      }
    );
  };

  getOne = () => {
    this.props.rts(
      {
        method: "get",
        url: `/menus/oneLevel`
      },
      this.uuid,
      "oneLevel"
    );
  };

  getRoles = () => {
    this.props.rts(
      {
        method: "get",
        url: `/roleMenus/roles`
      },
      this.uuid,
      "roles"
    );
  };

  dealOne = (ones=[]) => {
    if (!ones[0] || ones[0].id !== "one") {
      ones.unshift({ id: "1", name: "顶级菜单" });
    }
    return ones.map(o => {
      return {
        value: o.id,
        title: o.name
      };
    });
  };

  submitinfo = values => {
    this.props.rts(
      {
        method: "put",
        url: `/menus/${this.props.match.params.id}`,
        data: {
          name: values.name,
          component: values.component,
          preMenuId: values.preMenuId,
          icon: values.icon,
          sort: values.sort
        }
      },
      this.uuid,
      "submitinfo",
      result => {
        message.success("修改成功", 3, () => {
          this.getMenu(this.props.match.params.id);
        });
      }
    );
  };

  submitRoles = () => {
    const { roles = [] } = this.state;
    let success = [];
    roles.map(r => {
      this.props.rts(
        {
          method: "post",
          url: `/roleMenus`,
          data: {
            roleId: Number(r),
            menus: [{ id: this.props.match.params.id }]
          }
        },
        this.uuid,
        "menu",
        () => {
          success.push(r);
          if (success.length === roles.length) {
            message.success("修改成功", 3, () => {
              this.getMenuRoles(this.props.match.params.id);
            });
          }
        }
      );
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { oneLevel, menu, roles, menuRoles } = this.props;
    let ones = [],
      form = {},
      allRoles = [],
      curRoles = [];

    if (oneLevel && oneLevel[this.uuid]) {
      ones = this.dealOne(oneLevel[this.uuid]);
    }
    if (menu && menu[this.uuid]) {
      form = menu[this.uuid];
    }
    if (roles && roles[this.uuid]) {
      allRoles = roles[this.uuid].map(r => {
        return {
          label: r.description,
          value: r.id
        };
      });
    }
    // if (menuRoles && menuRoles[this.uuid]) {
    //   curRoles = menuRoles[this.uuid].map(r => {
    //     return r.id;
    //   });
    // }
    const child = (
    	
      <Panel>
        <FormExpand
          elements={[
            {
              label: "名称",
              field: "name",
              type: "text",
              params: {
                initialValue: form.name,
                rules: [{ required: true, message: "必填项" }]
              }
            },
            {
              label: "路由/组件名称",
              field: "component",
              type: "text",
              params: {
                initialValue: form.component,
                rules: [{ required: true, message: "必填项" }]
              }
            },
            {
              label: "图标",
              field: "icon",
              type: "text",
              params: {
                initialValue: form.icon
              }
            },
            {
              label: "父级菜单",
              field: "preMenuId",
              type: "select",
              options: ones,
              params: {
                initialValue: form.preMenuId,
                rules: [{ required: true, message: "必填项" }]
              }
            },
            {
              label: "排序",
              field: "sort",
              type: "number",
              params: {
                initialValue: form.sort,
                rules: [{ required: true, message: "必填项" }]
              }
            }
          ]}
          onSubmit={values => {
            this.submitinfo(values);
          }}
          //取消
         onCancel={()=>{this.props.goBack()}}
        />
      </Panel>
    )
    return (
    	<div>
    		<DetailTemplate
	      	config = {this.props.config}
	      	title = {form && form.name || this.props.title}
	      	child={child}
	      	removeAllButton
	      />
    	</div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const MenuManageruuid = state => state.get("rts").get("uuid");
const oneLevel = state => state.get("rts").get("oneLevel");
const menu = state => state.get("rts").get("menu");
const roles = state => state.get("rts").get("roles");
const menuRoles = state => state.get("rts").get("menuRoles");

const mapStateToProps = createStructuredSelector({
  MenuManageruuid,
  oneLevel,
  menu,
  roles,
  menuRoles
});

const WrappedMenuManagerDetail = Form.create()(MenuManagerDetail);

export default connect(mapStateToProps, mapDispatchToProps)(
  WrappedMenuManagerDetail
);
