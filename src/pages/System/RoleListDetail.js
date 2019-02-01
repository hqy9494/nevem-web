import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Panel, Tabs, Tab } from "react-bootstrap";
import { Row, Col,Icon, Form, Select, Button, Card,Alert,Tree } from "antd";
import moment from "moment";
import uuid from "uuid";
// import styles from "./Index.scss";
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const TreeNode = Tree.TreeNode;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class RoleListDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
    const { params } =  this.props.match;
    const {id} = params;

    if (id && id !== "add") {
      this.state.disabled = true;
      this.getOne();
    }

  }

  componentWillReceiveProps(nextProps) {}

  getOne = (id = this.props.match.params.id) => {
    id &&
    this.props.rts(
      {
        method: "get",
        url: `/CutdownConfigs/${id}`
      },
      this.uuid,
      "pageInfo"
    );
  };

  submitNew = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // if (!err) {
      //   this.props.rts(
      //     {
      //       method: "post",
      //       url: `/CutdownConfigs`,
      //       data: val
      //     },
      //     this.uuid,
      //     "newPage",
      //     () => {
      //       this.props.goBack();
      //     }
      //   );
      // }

    })

  };

  onSelect = (selectedKeys, info) => {
    // console.log('selected', selectedKeys, info);
  };

  onCheck = (checkedKeys, info) => {
    // console.log('onCheck', checkedKeys, info);
  };




  render() {
    const { getFieldDecorator } = this.props.form;
    const { pageInfo } = this.props;
    const { disabled } = this.state;

    let page = {};

    if (pageInfo && pageInfo[this.uuid]) {
      page = pageInfo[this.uuid];
    }

    return (
      <section className="RoleListDetail-page">
        <Panel>
          <Row type="flex" justify="space-around" align="top">
            <Col span={11}>
              <Card title="允许的权限"  hoverable>
                <Tree
                  checkable
                  defaultExpandedKeys={['0-0-0', '0-0-1']}
                  defaultSelectedKeys={['0-0-0', '0-0-1']}
                  defaultCheckedKeys={['0-0-0', '0-0-1']}
                  onSelect={this.onSelect}
                  onCheck={this.onCheck}
                >
                  <TreeNode title="parent 1" key="0-0">
                    <TreeNode title="parent 1-1" key="0-0-1">
                      <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
                    </TreeNode>
                  </TreeNode>
                </Tree>
              </Card>
            </Col>
            <Col span={11}>
              <Card title="菜单权限"  hoverable>
                <Tree
                  checkable
                  defaultExpandedKeys={['0-0-0', '0-0-1']}
                  defaultSelectedKeys={['0-0-0', '0-0-1']}
                  defaultCheckedKeys={['0-0-0', '0-0-1']}
                  onSelect={this.onSelect}
                  onCheck={this.onCheck}
                >
                  <TreeNode title="parent 1" key="0-0">
                    <TreeNode title="parent 1-1" key="0-0-1">
                      <TreeNode title={<span style={{ color: '#1890ff' }}>sss</span>} key="0-0-1-0" />
                    </TreeNode>
                  </TreeNode>
                </Tree>
              </Card>
            </Col>
          </Row>
        </Panel>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const pageInfo = state => state.get("rts").get("pageInfo");
const mapStateToProps = createStructuredSelector({
  UUid,
  pageInfo
});
const  WrappedRoleListDetail = Form.create()(RoleListDetail);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedRoleListDetail);
