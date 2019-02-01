import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon,Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import AsyncTable from "../../components/AsyncTable";

// import styles from "./Index.scss";
export class OrderManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {
  }
	componentDidMount(){
		console.log(this.props);
	}
  componentWillReceiveProps(nextProps) {}

  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Orders",
        // total: "/Orders/count"
       include: ["terminal", "position"]
      },
      search: [
        {
          type: "field",
          field: "id",
          title: "订单编号"
        },
        {
          type: "relevance",
          field: "terminalId",
          title: "出货设备",
          model: {
            api: "/Terminals",
            field: "name"
          }
        },
        {
          type: "numberRelevance",
          field: "totalOutStock",
          title: "缺货数量",
          fieldName: "terminalId",
          model: {
            api: "/Terminals",
            field: "totalOutStock"
          }
        },
        {
          type: "number",
          field: "price",
          title: "价格",
        },
        {
          type: "date",
          field: "createdAt",
          title: "下单时间"
        },
        {
          type: "option",
          title: "支付方式",
          field: "payType",
          options: [
            {title: "微信", value: "wechat"},
            {title: "支付宝", value: "alipay"}
          ]
        },
        {
          type: "optionRelevance",
          title: "是否删除",
          field: "isDelete",
          fieldName: "terminalId",
          options: [
            { title: "已删除", value: true },
            { title: "未删除", value: false }
          ],
          model: {
            api: "/Terminals",
            field: "isDelete"
          }
        },
      ],
      columns: [
        {
          title: "订单编号",
          dataIndex: "id",
          key: "id"
        },
        {
          title: "下单时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "价格",
          dataIndex: "price",
          key: "price",
          align: "right",
					sort: true
        },
        {
          title: "出货设备",
          dataIndex: "terminal.name",
          key: "terminal.name"
        },
        {
          title: "缺货设备",
          dataIndex: "terminal.totalOutStock",
          key: "terminal.totalOutStock",
          align: "right",
        },
        {
          title: "支付方式",
          dataIndex: "payType",
          key: "payType",
          render: (text, record) => {
            switch (text) {
              case "wechat":
                return <Icon type="wechat" style={{color: "#8ddc57", fontSize: "26px"}}/>;
              case "alipay":
                return <Icon type="alipay-circle" style={{color: "#1aaceb", fontSize: "26px"}}/>;
              default:
                break;
            }
          }
        },
        /*{
          title: "入账金额",
          dataIndex: "terminal.name",
          key: "terminal.name"
        },
        {
          title: "时间",
          dataIndex: "terminal.name",
          key: "terminal.name"
        },*/
        // {
        //   title: "交易操作",
        //   key: "handle",
        //   render: (text, record) => (
        //     <span>
        //       <a
        //         href="javascript:;"
        //         onClick={() => {
        //           this.props.to(`${this.props.match.path}/detail/${record.id}`);
        //         }}
        //       >
        //         详情
        //       </a>
        //     </span>
        //   )
        // }
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
      <section className="OrderManagement-page">
      	{/*<div className="project-title">账单流水</div>*/}
        <AsyncTable
          {...config}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderManagement);
