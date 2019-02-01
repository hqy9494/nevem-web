import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Col } from "antd";
import responsive from "./responsive";

const Description = ({ term, column, className, children, ...restProps }) => {
  const clsString = classNames("desc-desc", className);
  return (
    <Col className={clsString} {...responsive[column]} {...restProps}>
      {term && <div className="desc-term">{term}</div>}
      {children && <div className="desc-detail">{children}</div>}
    </Col>
  );
};

Description.defaultProps = {
  term: ""
};

Description.propTypes = {
  term: PropTypes.node
};

export default Description;
