import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Col, Row, Icon } from "antd";
import moment from "moment";
import uuid from "uuid";
// import styles from "./Index.scss";

export class EquipmentAdjustment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.uuid = uuid.v1();
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    return <section className="EquipmentAdjustment-page">EquipmentAdjustment</section>;
  }
}

const mapDispatchToProps = dispatch => {
  return {};
};

const UUid = state => state.get("rts").get("uuid");

const mapStateToProps = createStructuredSelector({
  UUid
});

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentAdjustment);
