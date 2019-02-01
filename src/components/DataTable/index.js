import React from "react";
import {
  Row,
  Col,
  Panel,
  Button,
  ButtonGroup,
  FormControl,
  Table,
  Pagination
} from "react-bootstrap";
import moment from "../../components/Moment";

export default class RoleManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  formatValue = (column, value) => {
    switch (column.type) {
      case "date":
        return moment(value).format("YYYY-MM-DD HH:mm");
      case "fromNow":
        return moment(value).fromNow();
      default:
        return value;
    }
  };

  render() {
    const {
      style,
      className,
      pagination,
      PageSize,
      showSizeChanger,
      buttons,
      search,
      column = [],
      data = [],
      pageNumber,
      onSizeChange,
      onSortChange,
      onPageChange
    } = this.props;

    return (
      <Panel>
        <Row>
          <Col xs={12} md={4}>
            {showSizeChanger && (
              <FormControl
                componentClass="select"
                bsSize="small"
                className="form-control page-select-120"
                onChange={e => {
//                console.log(e.target.value);
                  onSizeChange && onSizeChange(e.target.value);
                }}
              >
                <option value="10">10 / 页</option>
                <option value="20">20 / 页</option>
                <option value="30">30 / 页</option>
                <option value="50">50 / 页</option>
              </FormControl>
            )}
          </Col>
          <Col xs={12} md={8}>
            {buttons && buttons.length > 0 ? (
              <ButtonGroup className="pull-right">
                {buttons.map((b, i) => {
                  return (
                    <Button
                      key={`button-${i}`}
                      onClick={() => {
                        b.onClick && b.onClick();
                      }}
                    >
                      {b.title}
                    </Button>
                  );
                })}
              </ButtonGroup>
            ) : (
              ""
            )}
          </Col>
        </Row>
        {column && column.length ? (
          <Table id="datatable" className="datatable" responsive striped hover>
            <thead>
              <tr>
                {column.map((c, i) => {
                  return (
                    <th
                      key={`thead-th-${i}`}
                      className={c.order ? "sorted" : ""}
                      onClick={() => {
//                      console.log(c.dataIndex, i);
                        if (c.order && onSortChange) {
                          onSortChange(c.dataIndex, i);
                        }
                      }}
                    >
                      {c.title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={d.id}>
                  {column.map((c, i) => (
                    <td key={`${d.id}-${c.dataIndex}`}>
                      {(() => {
                        if (c.render) {
                          return c.render(d[c.dataIndex], d);
                        } else {
                          return this.formatValue(c, d[c.dataIndex]);
                        }
                      })()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          ""
        )}
        {pagination && (
          <div style={{ textAlign: "center" }}>
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              items={pageNumber || 1}
              maxButtons={5}
              onSelect={page => {
//              console.log(page);
                onPageChange && onPageChange(page);
              }}
            />
          </div>
        )}
      </Panel>
    );
  }
}
