import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button,message,InputNumber,Modal} from "antd";
import moment from "moment";
import uuid from "uuid";
import {Panel} from "react-bootstrap";
import DetailTemplate from "../../components/DetailTemplate"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const { Meta } = Card;
//点位
export class PointManagementPicture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pointDetail: {},
      picList:[],
      placeData: [],
      priceRulesData: [],
      replenishmentData: [],
      name:''
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  	this.getData();
  }
  getData(){
  	this.props.rts({
      method: 'get',
      url: `/Positions/${this.props.match.params.id}`
    }, this.uuid, 'getPoint',res=>{
			this.setState({picList:res.pictures,name:res.name});
    })
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
/*
    const data =[
      {
        name:"1",
        pic:"../../assets/img/02.png"
      },
      {
        name:"2",
        pic:"../../assets/img/02.png"
      },
      {
        name:"3",
        pic:"../../assets/img/02.png"
      },
      {
        name:"4",
        pic:"../../assets/img/02.png"
      },
      {
        name:"5",
        pic:"../../assets/img/02.png"
      },
      {
        name:"6",
        pic:"../../assets/img/02.png"
      },
      {
        name:"7",
        pic:"../../assets/img/02.png"
      },
      {
        name:"8",
        pic:"../../assets/img/02.png"
      },
      {
        name:"9",
        pic:"../../assets/img/02.png"
      },
      {
        name:"10",
        pic:"../../assets/img/02.png"
      },
      {
        name:"11",
        pic:"../../assets/img/02.png"
      },
      {
        name:"12",
        pic:"../../assets/img/02.png"
      },
      {
        name:"13",
        pic:"../../assets/img/02.png"
      },
      {
        name:"14",
        pic:"../../assets/img/02.png"
      },
      {
        name:"15",
        pic:"../../assets/img/02.png"
      },
      {
        name:"16",
        pic:"../../assets/img/02.png"
      },
      {
        name:"17",
        pic:"../../assets/img/02.png"
      },
      {
        name:"18",
        pic:"../../assets/img/02.png"
      },
      {
        name:"19",
        pic:"../../assets/img/02.png"
      },
      {
        name:"20",
        pic:"../../assets/img/02.png"
      },


    ];
*/
		const {picList,name} = this.state;
		const child = (
			<Panel>
        <Row
          //type="flex"
          //justify="center"
          style={{margin:"0 auto" ,width:"80%"}}
        >
            {picList.length?picList.map((val,key) => {
                      return(
                        <Col span={6} key={key}>
                          <Card
                            hoverable
                            style={{ height:"250px",marginBottom:"30px",overflow:'hidden' }}
                            cover={
                              <img
                                alt="图片说明"
                                title="点击放大"
                                style={{ width: "100%" }}

                                src={val}
                                onClick={() => {
                                  this.setState({ previewVisible: true, previewImage: val});
                                }}
                              />
                            }
                          >
                            {/*<Meta
                              title={val.name}
                              style={{textAlign:"center"}}
                            />*/}
                          </Card>

                        </Col>
                      )
            }):(<Col span={24} style={{textAlign:'center',color:'rgba(0, 0, 0, 0.45)'}}>暂无图片</Col>)}
        </Row>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={() => {
            this.setState({ previewVisible: false });
          }}
        >
          <img
            alt="商品图片(大)"
            style={{ width: "100%" }}
            src={this.state.previewImage}
          />
        </Modal>
      </Panel>
		)
    return (
    <section className="pointManagementDetail-page">
      <DetailTemplate
      	config = {this.props.config}
      	title = {name || this.props.title}
      	child={child}
      	onCancle={this.props.goBack}
      	removeOkButton
      />
    </section>

    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const PointManagementPictureForm = Form.create()(PointManagementPicture);

const mapStateToProps = createStructuredSelector({
});

export default connect(mapStateToProps, mapDispatchToProps)(PointManagementPictureForm);
