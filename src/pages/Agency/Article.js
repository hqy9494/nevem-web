import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Modal, Input, Popconfirm, Form, Cascader} from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
const FormItem = Form.Item

export class Article extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      areaData: [],
      type : 'pick',
      visible: false,
      editType: false,
      roles: [],
      editAddressData:{}
    };
    this.areaObj = {};
    this.uuid = uuid.v1();
  }
  

  componentWillMount() {}

  componentDidMount() {
    this.getRoles()
  }
  componentWillReceiveProps(nextProps) {}

  getRoles = () => {
    this.props.rts({
      method: 'get',
      url: `/accounts/roles`,
    }, this.uuid, 'getRoles', (v) => {
      this.setState({
        roles: v
      })
    })
  }

  setClassify = (filterRoles = []) => filterRoles.map(v => v.name).join('/')

  handToEdit = (id) => {
    if(!id) return
    
    this.props.to(`${this.props.match.path}/edit/${id}`)
  }

  confirm = (id, bool) => { this.deleteGuides(id) }

  deleteGuides = (id) => {
    this.props.rts({
      method: 'delete',
      url: `/Guides/${id}`,
    }, this.uuid, 'deleteGuides', () => {
      this.setState({
        visible: false,
        refreshTable: true,
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { areaData } = this.state
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Guides/web",
      },
      search: [
        {
          type: "field",
          field: "title",
          title: "文章标题"
        }
      ],
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to(`${this.props.match.path}/edit/add`)
          }
        }
      ],
      columns: [
        {
          title: "文章标题",
          dataIndex: "title",
          key: "title",
        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: 'date',
          sort: true
        },
        {
          title: "分类",
          dataIndex: "type",
          key: "type",
          render: (text, record) => {
            return <span>{this.setClassify(record.roles)}</span>
          }
        },
        {
          title: "排序",
          dataIndex: "sequence",
          key: "sequence",
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <Button
                className="buttonListFirst"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {this.handToEdit(record.id)}}
              >
                编辑
              </Button>
              <Popconfirm
                title="确认删除该文章?"
                onConfirm={() => {
                  this.confirm(record.id, true);
                }}
                okText="是"
                cancelText="否"
              >
                <Button size="small" className="buttonListDanger">删除</Button>
              </Popconfirm>
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
    <section className="Article-page">
      <TableExpand
        {...config}
        path={`${this.props.match.path}`}
        replace={this.props.replace}
        refresh={this.state.refreshTable}
        onRefreshEnd={() => {
          this.setState({refreshTable: false});
        }}
      />
    </section>
  )
  }
}
const mapDispatchToProps = dispatch => {
  return {};
};


const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  postLandMark: state => state.get("rts").get("postLandMark"),
  putLandMark: state => state.get("rts").get("putLandMark"),
  deleteGuides: state => state.get("rts").get("deleteGuides"),
});

const ArticleForm = Form.create()(Article);

export default connect(mapStateToProps, mapDispatchToProps)(ArticleForm);
