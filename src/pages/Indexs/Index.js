import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon } from "antd";
import moment from "moment";
import uuid from "uuid";
// import styles from "./Index.scss";

export class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    return <section className="index-page">首页</section>;
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const indexuuid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  indexuuid
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
