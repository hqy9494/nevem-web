import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Popconfirm, Button } from "antd";
import uuid from "uuid";
import TableExpand from "../../components/AsyncTable";
export class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshTable: false,
      logMethods: [],
      userName: []
    };
    this.uuid = uuid.v1();
  }

  componentDidMount() {
    this.getLogsMethods()
    this.getUserName()
  }

  componentWillReceiveProps(nextProps) {}

  getUserName = () => {
    this.props.rts({
      method: "get",
      url: `/accounts`,
    }, this.uuid, 'getUserName', (x) => {
      this.setState({
        userName: x.data,
        refreshTable: true
      })
    });
  }

  setUserName = (id) => {
    const {userName} = this.state
    const single = userName && Array.isArray(userName) && userName.filter(v => v.id === id)

    return single && single.length > 0 ? single[0].username : '--'
  }

  getLogsMethods = () => {
    this.props.rts({
      method: "get",
      url: `/Logs/methods`,
    }, this.uuid, 'getLogsMethods', (x) => {
      this.setState({
        logMethods: x
      })
    });
  }

  setLogMethods = (controller, method) => {
    const { logMethods } = this.state
    let newLog = {}
    logMethods.forEach(v => {
      if(v.model === controller) {
        const methodsList = v.methods.filter(q => q.name === method)
        newLog = {
          controller: v.description,
          method: methodsList[0].description
        }
      }
    })
    return newLog
  }
  
  render() {
    const config = {
      api: {
        rts: this.props.rts,
        uuid: this.uuid,
        data: "/Logs",
      },
      search: [
      	{
          type: "relevance",
          field: "userId",
          title: "操作人",
          model: {
            api: "/accounts",
            field: "username",
            add: {
              agent: true
            }
          },
          addOptions:[
            {name:'默认',value:null},
          ],
          changeType:'field'
        },
        {
          type: "field",
          field: "mobile",
          title: "手机"
        },
        {
          type: "field",
          field: "ip",
          title: "IP"
        },
        {
          type: "option",
          field: "platform",
          title: "操作平台",
          options:[
            {title: 'iPhone', value: 'iPhone'},
            {title: 'PC', value: 'PC'},
            {title: 'Android', value: 'Android'},
          ]
        },
        {
          type: "date",
          field: "createdAt",
          title: "操作时间"
        },
      ],
      columns: [
        {
          title: "操作人",
          dataIndex: "userId",
          key: "userId",
          render: (text, records) => {
            return <span>{this.setUserName(records.userId)}</span>
          }
        },
        {
          title: "手机",
          dataIndex: "mobile",
          key: "mobile",
        },
        {
          title: "IP",
          dataIndex: "ip",
          key: "ip",
        },
        {
          title: "操作平台",
          dataIndex: "platform",
          key: "platform"
        },
        {
          title: "操作时间",
          dataIndex: "createdAt",
          key: "createdAt",
          type: "date",
          sort: true
        },
        {
          title: "操作对象",
          dataIndex: "extra.description",
          key: "extra.description",
        },
        {
          title: "操作内容",
          dataIndex: "method",
          key: "method",
          render: (text, records) => {
            let newLog = this.setLogMethods(records.controller, records.method)
            return (
            <div>
              {`对【${newLog.controller}】进行【${newLog.method}】`}
            </div>)
          }
        },
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
      <section className="Logs-page">
        <TableExpand
          {...config}
        />
      </section>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  UUid: state => state.get("rts").get("uuid"),
  getUserName: state => state.get("rts").get("getUserName"),
});

export default connect(mapStateToProps)(Logs);
