import React from "react";
import classNames from "classnames";
import { Row, Col, Panel } from "react-bootstrap";

class Permission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  render() {
    const { row, col } = this.props;
    return (
      <Panel>
        <table>
          <colgroup>
            <col style={{ width: "110px" }} />
            {col.map((c, i) => {
              return (
                <col
                  key={`colgroup-${i}`}
                  style={{
                    width: "110px"
                  }}
                />
              );
            })}
          </colgroup>
          <thead>
            <tr className="permission-row">
              <th className="permission-col" />
              {col.map((c, i) => {
                return (
                  <th key={`th-${i}`} className="permission-col">
                    {c.title}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {row.map((r, i) => {
              return (
                <tr key={`body-tr-${i}`} className="permission-row">
                  <td className="permission-col permission-row-head">{r.title}</td>
                  {col.map((c, j) => {
                    return (
                      <td key={`body-td-${j}`} className="permission-col">
                        <label className="checkbox-inline c-checkbox">
                          <input type="checkbox" value={`${r.id}-${c.id}`} />
                          <em className="fa fa-check" />
                        </label>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    );
  }
}

export default Permission;
