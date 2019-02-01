import React from "react";
import classNames from "classnames";
import { Row } from "antd";

export default ({
  className,
  title,
  col = 3,
  layout = "horizontal",
  gutter = 32,
  children,
  size,
  avatar,
  ...restProps
}) => {
  const clsString = classNames(
    "descList",
    layout === "vertical" && "desc-vertical",
    className,
    {
      small: size === "small",
      large: size === "large"
    }
  );
  const column = col > 4 ? 4 : col;
  return (
    <div className={clsString} {...restProps}>
      {title ? <div className="desc-title">{title}</div> : null}
      <div style={avatar ? { position: "relative", paddingLeft: 114 } : {}}>
        {avatar && (
          <div className="user-block-picture">
            <div className="user-block-status">
              <img
                src={avatar}
                alt="Avatar"
                width="80"
                height="80"
                className="img-thumbnail img-circle"
              />
              <div className="circle circle-success circle-lg" />
            </div>
          </div>
        )}
        <Row gutter={gutter}>
          {React.Children.map(children, child =>
            React.cloneElement(child, { column })
          )}
        </Row>
      </div>
    </div>
  );
};
