import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Card, Form, Input, DatePicker, Radio, Select, Button, Modal, Table } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
// import styles from "./Index.scss";

export class ProductPrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouseDetailsData : null,
      productId: null
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {
    
  }
  componentWillReceiveProps(nextProps) {
    
  }

  priceSubmit = () => {
    const { productId } = this.state
    const price = this.props.form.getFieldValue('price')
    if(productId) this.putProductPrice(productId, {
      price: price ? Number(price) : 0.01
    })
  }
  putProductPrice = (id, params) => {
    this.props.rts({
      method: 'put',
      url: `/Products/${id}/price`,
      data: params,
    }, this.uuid, 'putProductPrice', () => {
      this.setState({
        visible: false,
        refreshTable: true
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Products",
      },
      search: [
        {
          type: "field",
          field: "name",
          title: "商品名称"
        },
        {
          type: "field",
          field: "barcode",
          title: "商品ID"
        },
//      {
//        type: "field",
//        field: "price",
//        title: "商品价格"
//      }
      ],
      columns: [
        {
          title: "商品名称",
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: "商品ID",
          dataIndex: "barcode",
          key: "barcode",
        },
        {
          title: "商品价格",
          dataIndex: "price",
          key: "price",
          align:'right'
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <span>
              <Button
              	className="buttonListFirst"
                size="small"
                onClick={() => {
                  // this.getwarehouseDetails(record.id)
                  this.setState({
                    visible: true,
                    productId: record.id
                  });
                }}
              >
                编辑
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
    
    return <section className="ProductPrice-page">
      <TableExpand
        {...config}
      />
      <Modal
        width="20%"
        height="auto"
        visible={this.state.visible}
        title="修改价格"
        okText="确定"
        cancelText="取消"
        destroyOnClose={true}
        onCancel={() => {
          this.setState({ visible: false });
        }}
        onOk={this.priceSubmit}
      >
        <div>
          <FormItem label={`商品价格:`}>
            {getFieldDecorator(`price`, {
              rules: [{
                message: '必选项',
                required: true
              }],
              initialValue : ''
            })(
              <Input type='number'/>
            )}
          </FormItem>
        </div>
      </Modal>
    </section>;
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const putProductPrice = state => state.get("rts").get("putProductPrice");

const mapStateToProps = createStructuredSelector({
  UUid,
  putProductPrice,
});

const ProductPriceForm = Form.create()(ProductPrice);

export default connect(mapStateToProps, mapDispatchToProps)(ProductPriceForm);
