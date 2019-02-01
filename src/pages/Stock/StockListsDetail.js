import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { ButtonGroup, ButtonToolbar} from "react-bootstrap";
import { Button, Col, Row, Icon, Modal, Input, Card, Form, DatePicker, Radio, Select, Cascader} from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

export class StockListsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }

  render() {
    const { match } = this.props
    const id = match.params.id
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/DepotStocks",
        include: ["batch","depot"],
        where: {
          depotId: id
        }
      },
      search: [
        {
          type: "number",
          field: "avgPrice",
          title: "平均进价"
        },
        {
          type: "number",
          field: "qty",
          title: "批次数量"
        }
      ],
      columns: [
        {
          title: "批次名称",
          dataIndex: "batch.name",
          key: "batchId",
        },
        {
          title: "数量",
          dataIndex: "qty",
          key: "qty",
          align:'right',
          sort:true
        },
        {
          title: "平均进价",
          dataIndex: "avgPrice",
          key: "avgPrice",
          align:'right',
          sort:true
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
    return <section className="StockListsDetail-page">
      <TableExpand
        {...config}
      />
    </section>
  }
}


const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});

export default connect(mapStateToProps, mapDispatchToProps)(StockListsDetail);
