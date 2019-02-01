import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Modal, Input, Popconfirm, Form, Cascader} from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
const FormItem = Form.Item

export class BusinessDistrict extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      areaData: [],
      type : 'pick',
      visible: false,
      editType: false,
      editAddressData:{}
    };
    this.areaObj = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentDidMount() {
    this.getArea();
  }
  componentWillReceiveProps(nextProps) {
    const { getArea } = nextProps
    if (getArea && getArea[this.uuid]) {
      this.setState({
        areaData: getArea[this.uuid],
      })
    }
  }

  handleEdit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {}
        for(let i of Object.keys(values)){
          if (!values[i]) continue
          if(i === 'residence') continue;
          params[i] = values[i]
        }
        if (values['residence'][0]) params.province = values['residence'][0]
        if (values['residence'][1]) params.city = values['residence'][1]
        params.district = values['residence'][2] ? values['residence'][2] : '其他'
        this.putLandMark(params)
      }
    });
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
  }

  confirm = (id, bool) => { this.deleteLandMark(id) }

  getArea = () => {
    this.props.rts({
      method: 'get',
      url: '/tools/getAreaData'
    }, this.uuid, 'getArea')
  };

  putLandMark = (params = {}) => {
    const { editAddressData } = this.state

    this.props.rts({
      method: !editAddressData ? 'post' : 'put',
      url: !editAddressData ? `/LandMarks` : `/LandMarks/${editAddressData.id}`,
      data: params
    }, this.uuid, 'putLandMark', () => {
      this.setState({
        visible: false,
        refreshTable: true,
      })
    })
  }
	editAddressFn(obj){
		this.setState({
		  visible: true,
		  editType: false,
		  editAddressData:obj
		})       
	}
  deleteLandMark = (id) => {
    this.props.rts({
      method: 'delete',
      url: `/LandMarks/${id}`,
    }, this.uuid, 'deleteLandMark', () => {
      this.setState({
        visible: false,
        refreshTable: true,
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { areaData } = this.state
    const area = this.handleArea(areaData) || [];
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/LandMarks",
      },
      search: [
        {
          type: "field",
          field: "name",
          title: "场地名称"
        }
      ],
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.setState({ 
              visible: true,
              editType: true,
              editAddressData: null
            })
          }
        }
      ],
      columns: [
        {
          title: "场地名称",
          dataIndex: "name",
          key: "name",
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
                onClick={this.editAddressFn.bind(this,record)}
              >
                编辑
              </Button>
              {record.enabled ? (
                <Popconfirm
                  title="确认禁用该用户?"
                  onConfirm={() => {
                    this.confirm(record.id, false);
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <Button className="buttonListDanger" size="small" style={{marginRight: '5px'}}>禁用</Button>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="确认删除该场地?"
                  onConfirm={() => {
                    this.confirm(record.id, true);
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <Button size="small" className="buttonListDanger">删除</Button>
                </Popconfirm>
              )}
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
    <section className="BusinessDistrict-page">
      <TableExpand
        {...config}
        path={`${this.props.match.path}`}
        replace={this.props.replace}
        refresh={this.state.refreshTable}
        onRefreshEnd={() => {
          this.setState({refreshTable: false});
        }}
      />
      <Modal
        width="30%"
        height="auto"
        visible={this.state.visible}
        title={this.state.editType ? '新建场地' : '编辑场地'}
        footer={null}
        destroyOnClose={true}
        onCancel={() => {
          this.setState({ visible: false });
          this.props.form.resetFields(['name','residence'])
        }}
      >
        <Form onSubmit={this.handleEdit}>
          <FormItem
            label={`场地名称:`}
            {...formItemLayout}
          >
            {getFieldDecorator(`name`, {
              rules: [{
                message: '必选项',
                required: true
              }],
              initialValue : this.state.editAddressData && this.state.editAddressData.name
            })(
              <Input type='text' placeholder="请填写场地名称"/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="仓库地址"
          >
            {getFieldDecorator('residence', {
              rules: [{ type: 'array', required: true, message: '请选择' }],
              initialValue: this.state.editAddressData && [this.state.editAddressData.province, this.state.editAddressData.city, this.state.editAddressData.district]
            })(
              <Cascader
                options={area}
                placeholder="请选择仓库地址"
                onChange={(value, selectedOptions) => {
                  this.setState({
                    editAddress: selectedOptions
                  }, () => {
                    let last = selectedOptions[selectedOptions.length - 1];
                  })
                }}
              />
            )}
          </FormItem>
          <div className="ta-c mt-20">
            <Button style={{ marginRight: 8 }} onClick={() => {
              this.setState({
                visible: false
              })
              this.props.form.resetFields(['name','residence'])
            }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
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
  postLandMark: state => state.get("rts").get("postLandMark"),
  putLandMark: state => state.get("rts").get("putLandMark"),
  deleteLandMark: state => state.get("rts").get("deleteLandMark"),
  getArea: state => state.get("rts").get("getArea"),
});

const BusinessDistrictForm = Form.create()(BusinessDistrict);

export default connect(mapStateToProps, mapDispatchToProps)(BusinessDistrictForm);
