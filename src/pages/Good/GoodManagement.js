import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Tree, Button, Popconfirm } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
import HeaderNav from "../../components/HeaderNav";
const TreeNode = Tree.TreeNode
// import styles from "./Index.scss";

export class GoodManagement extends React.Component {
  constructor(props) {
  	// console.log(props,'props');
    super(props);
    this.state = {
      categoryId: '',
      refreshTable: false,
      catData: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {
    this.getCat()
  }
  componentWillReceiveProps(nextProps) {
    const { getCat } = nextProps

    if (getCat && getCat[this.uuid]) {
      const data = getCat[this.uuid]
      this.setState({
        catData: data.data,
        catTotal: data.total,
        categoryId: data.data[0].id
      })
    }
  }
  getCat = () => {
    this.props.rts({
      method: 'get',
      url: '/Categories'
    }, this.uuid, 'getCat')
  }
  getTree = (catData = []) => {
    let data = []

    catData.forEach(v => {
      if (v) data.push({
        key: v.id,
        title: v.name
      })
    })

    return data
  }
  onSelect = (selectedKeys, e) => {
  	console.log(selectedKeys,'selectedKeys');
    if (selectedKeys.length > 0) {
      this.setState({
        categoryId: selectedKeys[0],
        refreshTable: true
      })
    }
  }
  deleteProduct = id => {
    this.props.rts({
      method: 'delete',
      url: `/Products/${id}`
    }, this.uuid, 'deleteProduct', () => {
      this.setState({
        refreshTable: true
      })
    })
  }
  render() {
    const { catData, categoryId } = this.state

    let options = this.getTree(catData)

    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Products",
        include: "category",
        where: {
          categoryId: categoryId
        }
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to('/Good/GoodManagement/add')
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "barcode",
          title: "条形码"
        },
        {
          type: "field",
          field: "name",
          title: "商品名称"
        },
        {
          type: "date",
          field: "createdAt",
          title: "创建时间"
        },
        {
          type: "relevance",
          field: "categoryId",
          title: "分类名称",
          model: {
            api: "/Categories",
            field: "name"
          }
        },
      ],
      columns: [
        {
          title: "图片",
          dataIndex: "imageUrl",
          key: "imageUrl",
          render: val => <img style={{width: '50px', height: '50px'}} src={val}/>
        },
        {
          title: "条形码",
          dataIndex: "barcode",
          key: "barcode"
        },
        {
          title: "商品名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "分类名称",
          dataIndex: "category.name",
          key: "categoryId"
        },
        {
          title: "创建时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <div>
              <Button
                className="buttonListFirst"
                size="small"
                style={{marginRight: '10px'}}
                onClick={() => {
                  this.props.to(`${this.props.match.path}/${text.id}`)
                }}
              >编辑</Button>
              <Popconfirm
                title="确认删除？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => {
                  this.deleteProduct(text.id)
                }}
              >
                <Button className="buttonListDanger" size="small">删除</Button>
              </Popconfirm>
            </div>
          )
        }
      ],
      path: this.props.match.path,
      replace: this.props.replace,
      refresh: this.state.refreshTable,
      onRefreshEnd: () => {
        this.setState({ refreshTable: false });
      }
    }
    return (
      <section className="GoodManagement-page">
      	<HeaderNav
      		className="myHeader"
      		config={this.props.config}
          title={this.props.title}
      	/>
        <Row style={{backgroundColor: '#fff', padding: '20px'}}>
          <Col span={2}>
            {
              categoryId &&
              <Tree
                defaultExpandAll
                showLine
                defaultSelectedKeys={[categoryId]}
                onSelect={this.onSelect}
              >
                {
                  options && options.map((v, i) => (
                    <TreeNode title={v.title} key={v.key} />
                  ))
                }
              </Tree>
            }
          </Col>
          <Col span={22}>
            {
              categoryId &&
              <TableExpand
                {...config}
                removeHeader
              />
            }
          </Col>
        </Row>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");
const getCat = state => state.get("rts").get("getCat");

const mapStateToProps = createStructuredSelector({
  UUid,
  getCat
});

export default connect(mapStateToProps, mapDispatchToProps)(GoodManagement);
