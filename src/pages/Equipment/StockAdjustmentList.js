import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button, Transfer, Modal, Popconfirm,Form,Input,Select,message  } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class EquipmentStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	visible: false,
      refreshTable: false
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}
	check = () => {
		Modal.confirm({
	    title: '确定修改？',
	    okText: '确认',
	    cancelText: '取消',
	  });
    /*this.props.form.validateFieldsAndScroll((err, values) => {
    	if(err){
    		return;
    	}else{
				console.log('ues');
    	}
    });*/
  }
  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Terminals",
        include:["position"],
        // total: "/Orders/count"
      },
      // buttons: [
      //   {
      //     title: "批量导出"
      //   }
      // ],
      search: [
      	{
          title: "设备名称",
          type: "field",
          field: "name"
        }
      ],
      buttons: [
        {
          title: "新建",
          onClick: () => {
//          this.props.form.resetFields();
          	this.setState({ visible: true});
          }
        }
      ],
      columns: [
        {
          title: "设备名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "在线名称",
          dataIndex: "id",
          key: "id"
        },
        {
          title: "储备箱库存",
          dataIndex: "address",
          key: "address"
        }
      ],
      path: this.props.match.url,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      },
      config:this.props.config,
	    title:this.props.title
    };
    return (
    	
      <section className="EquipmentStatus-page">
        <TableExpand
          {...config}
        />
        <Modal
          //width="80%"
          visible={this.state.visible}
          title={"新建库存调整列表"}
          okText="确定"
          cancelText="取消"
          loading={this.state.loading}
          // style={{display:"flex"}}
          onOk={this.check.bind(this)}
          onCancel={() => {
            this.setState({
              visible: false
            }, () => {
            });
          }}

        >
          <Form layout="vertical">
           	<FormItem {...formItemLayout} label="当前库存："  >
            	<Input defaultValue={50} disabled={true}/>
            </FormItem>
            <FormItem {...formItemLayout} label="修改库存："  >
            	<Input placeholder="请输入修改库存" />
            </FormItem>
          </Form>
        </Modal>
      </section>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentStatus);
