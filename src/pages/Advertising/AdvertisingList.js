import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,  Divider, Popconfirm,Button,Modal,Form,Input,message,InputNumber,Select } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
// import styles from "./Index.scss";
const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const FormItem = Form.Item;
export class AdvertisingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      isPriceSet:false,
      getId:'',
      refreshTable:false,
      isMoneySet:false,
      isVideo: false,
      listDetail:{},
      batchList:{}
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  	this.getBatchList();
  }

  componentWillReceiveProps(nextProps) {}
	getBatchList = ()=>{
		this.props.rts(
         {
           method: "get",
           url: `/Batches`,
         },
         this.uuid,
         'batchList', (res) => {
         		for(let i in res.data){
         			if(res.data[i].active){
         				return this.setState({refresh: true,batchList:res.data[i]});
         			}
         		}
           
         }
       );
	}

  // 启禁用
  confirm(id, bool) {
    this.props.rts(
      {
        method: "post",
        url: `/Batches/${id}/active`,
        data: {
          bol: bool
        }
      },
      this.uuid,
      'pageInfo', () => {
        this.setState({refreshTable: true})
      }
    );
  }
  
	check=(id)=>{
		this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      	let postData = {};
      	let postPath = '';
      	if(this.state.isMoneySet){
      		const pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
      		if(!pattern.test(values.phone)){
      			return message.info("手机号格式不正确！");
      		}
					postData = {phone:values.phone};   		
					postPath = `/Agents/${id}/phone`;  		
      	}else{
      		postData = {...values,agentId:id};
      		postPath = `/AgentBatchPrices`; 
      	}
					this.props.rts(
	          {
	            method: "post",
	            url: postPath,
	            data:postData
	          },
	          this.uuid,
	          "getCheckId",
	          () => {
	            this.setState({ visible: false,refreshTable:true,isPriceSet:false,isMoneySet:false});
	            message.success("修改成功！");
						}
	       );
      }
    });
	}

  // 删除
  remove = (id) => {
    this.props.rts({
      method: "delete",
      url: `MaterialLibraries/${id}`
    },this.uuid,"remove",() => {
      message.success('删除成功');
      this.setState({ refreshTable: true })
    });
  }

  render() {
   
  	const { isVideo,listDetail,batchList,isPriceSet, payUrl } = this.state;

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/MaterialLibraries",
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to(`${this.props.match.path}/add`);
          }
        }
      ],
      search: [
      ],
      columns: [
        {
          title: "素材名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "素材类型",
          dataIndex: "type",
          key: "type",
          render: text => {
             if (text === 'video') {
                return <span className="statusBlueOne">视频</span>;
             } else if(text === 'image') {
                return <span className="statusBlueTwo">图片</span>;
             }
             return <span>----</span>;
           }
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
                 onClick={() => {
                   this.props.to(`${this.props.match.path}/${record.id}`);
                 }}
               >
                编辑
              </Button>
              <Popconfirm
                  title="是否删除该数据?"
                  onConfirm={() => {
                    this.remove(record.id);
                  }}
                  okText="是"
                  cancelText="否"
                >
                <Button
                  className="buttonListDanger"
                  size="small" 
                  style={{marginRight: '5px'}}
                >删除</Button>
              </Popconfirm>
              <Button
                className="buttonListThird"
                size="small"
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.setState({
                    visible: true,
                    isVideo: record && record.type === 'video',
                    payUrl: record && record.url
                  });
                }}
               >
                预览
              </Button>
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
      <section className="OperatorList-page">
        <TableExpand
          {...config}
        />
        <Modal visible={this.state.visible} footer={null} onCancel={() => { this.setState({visible: false}) }}>
          <div style={{ textAlign: 'center' }}>
	          {
              isVideo ?
              <div>
                <video src={ payUrl } controls="controls" style={{ width: "100%" }}></video>
              </div> :
          		<img alt="img" src={ payUrl } style={{ width: "100%" }}/>
	          }  
          </div> 
        </Modal>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const remove = state => state.get("rts").get("remove");

const mapStateToProps = createStructuredSelector({
  UUid,
  remove,
});
const WrappeAdvertisingList = Form.create()(AdvertisingList);
export default connect(mapStateToProps, mapDispatchToProps)(WrappeAdvertisingList);
