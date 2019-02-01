import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import uuid from "uuid";
import moment from "../../components/Moment";
import TableExpand from "../../components/AsyncTable";


const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

export class StockReplenishDetail extends React.Component {
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
//getSubStr = (str, left, right) => str.substring(str.indexOf(left) + 1,str.lastIndexOf(right))
  
  render() {
    const { params } = this.props;
    const config = {
    	hasParams:{"id":params.id,"status":params.status},
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: `/BatchCodes/replenishment/record`,
        include: ['account','batch'],
        where: {
          terminalId: params.id
        }
      },
      columns:[
        {
          title: '批次号',
          dataIndex: 'encryptCode',
          key: 'encryptCode',
        },
        {
          title: '补货员',
          dataIndex: 'account.username',
          key: 'account',
        },
        {
          title: '获取时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          type: 'date',
          sort: true
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
      <section>
          <TableExpand
            {...config}
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

export default connect(mapStateToProps, mapDispatchToProps)(StockReplenishDetail);
