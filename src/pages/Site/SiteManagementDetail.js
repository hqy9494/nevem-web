import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import moment from "../../components/Moment";
import TableExpand from "../../components/TableExpand";


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class SiteManagementDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {

  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {

  }
  getSubStr = (str, left, right) => str.substring(str.indexOf(left) + 1,str.lastIndexOf(right))

  render() {
    const { match } = this.props
    const id = this.getSubStr(match.params.id,'=','&')
    const status = match.params.id.substr(-1)
    
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: `/DepotPickups/${id}`,
        where: {
          type: status
        }
      },
      search: [
        {
          type: "field",
          field: "receiptNo",
          title: "单据编号"
        },
        {
          type: "option",
          title: "订单状态",
          field: "status",
          options: [
            { title: "已拒绝", value: -1 },
            { title: "等待审核", value: 0 },
            { title: "已审核(待确认收货)", value: 1 },
            { title: "已审核(提货成功)", value: 2 }
          ]
        },
        {
          type: "date",
          field: "createdAt",
          title: "交易时间",
          sort: true
        }
      ],
      columns:[
        {
          title: '场地名称',
          dataIndex: 'barcode',
          key: 'barcode',
        },
        {
          title: '状态',
          dataIndex: 'product.name',
          key: 'product',
        },
        {
          title: '所属代理商',
          dataIndex: 'qty',
          key: 'qty',
        },
        {
          title: '领取时间',
          dataIndex: 'createAt',
          key: 'createAt',
          type: 'date',
          sort: true
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    };
    return (
      <section>
        <div>补货列表</div>
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
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteManagementDetail);
