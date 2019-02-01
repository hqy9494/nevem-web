import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon, Button } from "antd";
import moment from "moment";
import uuid from "uuid";
import TableExpand from "../../components/TableExpand"

export class StrategySite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      placesData: []
    };
    this.uuid = uuid.v1();
  }

  componentWillMount() {}
  componentDidMount() {
    // this.getPlaces()
  }
  componentWillReceiveProps(nextProps) {
    const { getPlaces } = nextProps

    if (getPlaces && getPlaces[this.uuid]) {
      this.setState({
        placesData: getPlaces[this.uuid],
      })
    }
  }
  getPlaces = () => {
    this.props.rts({
      method: 'get',
      url: '/Places',
    }, this.uuid, 'getPlaces')
  }
  // deletePlace = id => {
  //   this.props.rts({
  //     method: 'delete',
  //     url: '/Places',
  //   }, this.uuid, 'getPlaces')
  // }
  render() {
    const { placesData } = this.props
   
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Places",
        include: ['industry', 'landMark']
      },
      buttons: [
        {
          title: "新建",
          onClick: () => {
            this.props.to('/Strategy/StrategySite/add')
          }
        }
      ],
      search: [
        {
          type: "field",
          field: "name",
          title: "场地名称"
        },
        {
          type: "field",
          field: "city",
          title: "市"
        },
        {
          type: "field",
          field: "district",
          title: "区"
        },
        {
          type: "field",
          field: "subject",
          title: "场地主体"
        }
      ],
      columns: [
        {
          title: "场地名称",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "市区",
          key: "productName",
          render: text => `${text.city}${text.district}`
        },
        {
          title: "场地主体",
          dataIndex: "subject",
          key: "subject",
        },
        {
          title: "行业分类",
          dataIndex: "industry.name",
          key: "industry",
        },
        {
          title: "商圈",
          dataIndex: "landMark.name",
          key: "landMark",
        },
        {
          title: "操作",
          key: "handle",
          render: (text, record) => (
            <div>
              <Button 
                className="buttonListFirst"
                size="small" 
                style={{marginRight: '5px'}}
                onClick={() => {
                  this.props.to(`/Strategy/StrategySite/${text.id}`)
                }}
              >编辑</Button>
              {
                // <Button 
                //   type="danger" 
                //   size="small" 
                //   style={{marginRight: '5px'}}
                //   onClick={() => {
                //     this.deletePlace(text.id)
                //   }}
                // >删除</Button>
              }
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
      <section className="StrategySite-page">
        <div className="project-title">设备列表</div>
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
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getPlaces: state => state.get("rts").get("getPlaces"),
});

export default connect(mapStateToProps, mapDispatchToProps)(StrategySite);
