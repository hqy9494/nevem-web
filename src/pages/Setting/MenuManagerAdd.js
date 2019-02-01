import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import { Panel } from "react-bootstrap";
import FormExpand from "../../components/FormExpand";
import DetailTemplate from "../../components/DetailTemplate"
export class MenuManagerAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    const { params } =  this.props.match;
    const {id} = params;
    this.getOne();
  }

  componentWillReceiveProps(nextProps) {


  }

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

  dealOne = ones => {
    if (!ones[0] || ones[0].id !== "one") {
      ones.unshift({ id: "one", name: "顶级菜单" });
    }
    return ones.map(o => {
      return {
        value: o.id,
        title: o.name
      };
    });
  };

  submitNew = (form = {}) => {
    if (Number(form.sort)) {
      this.props.rts(
        {
          method: "post",
          url: `/menus`,
          data: Object.assign(
            {},
            {
              name: form.name,
              eName: form.component,
              component: form.component,
              icon: form.icon,
              sort: Number(form.sort)
            },
            form.preMenuId !== "one" && { preMenuId: form.preMenuId }
          )
        },
        this.uuid,
        "submitNew",
        () => {
          this.props.to("/setting/menuManager");
        }
      );
    }
  };

  render() {
    const { oneLevel } = this.props;
    let ones = [];

    if (oneLevel && oneLevel[this.uuid]) {
      ones = this.dealOne(oneLevel[this.uuid]);
    }
		const child = (
			<Panel header="基本信息">
        <FormExpand
          elements={[
            {
              label: "名称",
              field: "name",
              type: "text",
              params: {
                rules: [{ required: true, message: "必填项" }]
              }
            },
            {
              label: "路由/组件名称",
              field: "component",
              type: "text",
              params: {
                rules: [{ required: true, message: "必填项" }]
              }
            },
            {
              label: "图标",
              field: "icon",
              type: "text"
            },
            {
              label: "父级菜单",
              field: "preMenuId",
              type: "select",
              options: ones,
              params: {
                rules: [{ required: true, message: "必填项" }]
              }
            },
            {
              label: "排序",
              field: "sort",
              type: "number",
              params: {
                rules: [{ required: true, message: "必填项" }]
              }
            }
          ]}
          onSubmit={values => {
            // console.log(values);
            this.submitNew(values);
          }}
          onCancel={this.props.goBack}
        />
      </Panel>
		)
    return (
    	<div>
    		<DetailTemplate
	      	config = {this.props.config}
	      	title = "新建"
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

const RoleManageruuid = state => state.get("rts").get("uuid");
const oneLevel = state => state.get("rts").get("oneLevel");

const mapStateToProps = createStructuredSelector({
  RoleManageruuid,
  oneLevel
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuManagerAdd);
