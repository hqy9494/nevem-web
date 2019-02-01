import React from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import classNames from 'classnames';
import { Table, Button } from 'antd';
import moment from '../Moment';
import SearchExpand from '../SearchExpand';
const ButtonGroup = Button.Group;

import { getParameterByName } from '../../utils/utils';

export default class TableExpand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      data: [],
      total: 0,
      params: {},
      skips : 0,
    };
    // this.getAll = !props.api.total || props.getAll ? true : false;
    this.getAll = props.getAll ? true : false;
    this.params = getParameterByName('q')
      ? JSON.parse(decodeURI(getParameterByName('q')))
      : {};
    this.columns = this.dealColumns(props.columns);
    this.propParams = props.params
  }

  componentWillMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {

    if (!this.props.refresh && nextProps.refresh === true) {
      this.getData(() => {
        this.props.onRefreshEnd && this.props.onRefreshEnd();
      }, nextProps || this.props);
    }
  }

  componentWillUnmount() {
    this._isUnmounted = true;
  }

  //包装setState
  updateState(newState, cb) {
    if (this._isUnmounted) {
      return;
    }
    this.setState(newState, cb);
  }

  getData = (cb, props, newProps) => {
    const { api, uuid } = props || this.props;
    const { skip, pageSize } = this.state;

    if (api.data) {
      if (this.getAll) {
        api.rts(
          {
            method: 'get',
            url: api.data,
            params: newProps ? newProps : {
              filter: Object.assign(
                {},
                {
                  where: Object.assign(
                    {},
                    this.searchsToWhere(this.params.searchs),
                    api.where
                  ),
                  // limit: pageSize,
                  // skip: this.params.skip || 0,
                  order: this.params.order || 'createdAt DESC'
                },
                api.include && {
                  include: api.include
                }
              )
            }
          },
          api.uuid,
          'data',
          (result = {}) => {
            // let data = result.data || [];
            this.updateState({
              data: result,
              total: result.length
            });
            cb && cb();
          }
        );
      } else {
        api.rts(
          {
            method: 'get',
            url: api.data,
            params: newProps ? newProps : {
              filter: Object.assign(
                {},
                {
                  where: Object.assign(
                    {},
                    this.searchsToWhere(this.params.searchs),
                    api.where
                  ),
                  limit: pageSize,
                  skip: this.params.skip || 0,
                  order: this.params.order || 'createdAt DESC'
                },
                api.include && {
                  include: api.include
                }
              )
            }
          },
          api.uuid,
          'data',
          (result = {}) => {
            this.updateState({
              data: result.data,
              total: result.total
            });
            cb && cb();
          }
        );
      }
    }
    // if (api.total) {
    //   api.rts(
    //     {
    //       method: "get",
    //       url: api.total,
    //       params: {
    //         where: Object.assign(
    //           {},
    //           this.searchsToWhere(this.params.searchs),
    //           api.where
    //         ),
    //       }
    //     },
    //     api.uuid,
    //     "total",
    //     total => {
    //       this.updateState({ total: total.count || 0 });
    //     }
    //   );
    // }
  };

  searchsToWhere = (searchs = []) => {
    let where = {};

    searchs.map(s => {
      if (s.type === 'field') {
        where[s.field] = {
          like: `%${s.values}%`
        };
      } else if (s.type === 'relevance') {
        where[s.field] = s.values.value;
      } else if (s.type === 'option') {
        where[s.field] = s.values.value;
      } else if (s.type === 'number') {
        if (s.values && s.values.constructor === Array) {
          if (s.values[0] && s.values[1]) {
            where[s.field] = {
              between: [s.values[0], s.values[1]]
            };
          } else if (s.values[0]) {
            where[s.field] = {
              gt: s.values[0]
            };
          } else if (s.values[1]) {
            where[s.field] = {
              lt: s.values[0]
            };
          }
        }
      } else if (s.type === 'date') {
        if (s.values && s.values.constructor === Object) {
          if (s.values.startDate && s.values.endDate) {
            where[s.field] = {
              between: [s.values.startDate, s.values.endDate]
            };
          } else if (s.values.startDate) {
            where[s.field] = {
              gt: s.values.startDate
            };
          } else if (s.values.endDate) {
            where[s.field] = {
              lt: s.values.endDate
            };
          }
        }
      }
    });
    return where;
  };

  onChange = (page, pageSize) => {
    this.jumpUrl({
      skip: (page - 1) * pageSize
    });
    this.setState({
      skips: (page - 1) * pageSize
    })
  };

  dealColumns = columns => {
    const { order = '' } = this.params,
      orderArr = order.split(' ');
    return columns.map(c => {
      if (c.type) {
        c.render = (text, record) => (
          <span> {this.formatValue(c.type, text)} </span>
        );
      }
      if (c.sort) {
        c.title = (
          <div
            className={classNames('tableExpand-sort-th', {
              'tableExpand-sort-th-no': orderArr[0] !== c.dataIndex,
              'tableExpand-sort-th-asc':
                orderArr.length === 2 &&
                orderArr[0] === c.dataIndex &&
                orderArr[1] === 'ASC',
              'tableExpand-sort-th-desc':
                orderArr.length === 2 &&
                orderArr[0] === c.dataIndex &&
                orderArr[1] === 'DESC'
            })}
            onClick={() => {
              let newOrder = '';
              if (orderArr.length === 2 && orderArr[0] === c.dataIndex) {
                if (orderArr[1] === 'ASC') {
                  newOrder = `${c.dataIndex} DESC`;
                }
              } else {
                newOrder = `${c.dataIndex} ASC`;
              }
              this.jumpUrl({
                order: newOrder
              });
            }}
          >
            {c.title}
          </div>
        );
      }
      return c;
    });
  };

  jumpUrl = (newParams = {}) => {
    const { hasParams = {}, api } = this.props;
    const { pageSize } = this.state;

    if (Object.keys(hasParams).length) {
      let paramsStr = '';
      const params = Object.assign({}, this.params, newParams);

      for (let i in hasParams) {
        if (
          hasParams[i] === undefined ||
          hasParams[i] === null ||
          hasParams[i] === ''
        ) {
          history.replaceState(null,null,'#' + this.props.path + `?q=${JSON.stringify(params)}`);
          return;
        }
        paramsStr += '&' + i + '=' + hasParams[i];
      }
      history.replaceState(
        null,
        null,
        '#' + this.props.path + `?q=${JSON.stringify(params)}` + paramsStr
      );
      
    } else {
      const params = Object.assign({}, this.params, newParams);

      history.replaceState(null, null, '#'+this.props.path+`?q=${JSON.stringify(params)}`);

      const newProps = {
        filter: Object.assign(
          {},
          {
            where: Object.assign(
              {},
              this.searchsToWhere(params.searchs),
              api.where
            ),
            limit: pageSize,
            skip: params.skip || 0,
            order: 'createdAt DESC'
          },
          api.include && {
            include: api.include
          }
        )
      }
      this.getData(() => {}, this.props, newProps)
    }
  };

  simplifySearchs = searchs => {};

  formatValue = (type, value) => {
    switch (type) {
      case 'date':
        return moment(value).format('YYYY-MM-DD HH:mm');
      case 'fromNow':
        return moment(value).fromNow();
      case 'penny':
        return Math.floor(value / 100);
      default:
        return value;
    }
  };

  render() {

    const { api, search, buttons, pages } = this.props;
    const { data, total, pageSize, skips } = this.state;

    let skip = skips ? skips : this.params.skip || 0;
    let { columns, rowSelection = null } = this.props;
    columns = this.dealColumns(columns);
    let pagination = {
      pageSize,
      total
    };
    
    pagination.current = Math.ceil(skip / pageSize + 1);
    pagination.onChange = this.onChange;
    return (
      <Panel>
        <Row>
          <Col xs={12} md={6}>
            <div
              style={{
                display: 'flex'
              }}
            >
              {buttons && buttons.length > 0 ? (
                <div
                  style={{
                    marginLeft: 8
                  }}
                >
                  <ButtonGroup className="pull-right">
                    {buttons.map((b, i) => {
                      return (
                        <Button
                          key={`button-${i}`}
                          style={b.style ? b.style : null}
                          onClick={() => {
                            b.onClick && b.onClick(data);
                          }}
                        >
                          {b.title}
                        </Button>
                      );
                    })}
                  </ButtonGroup>
                </div>
              ) : (
                ''
              )}
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div
              style={{
                display: 'flex'
              }}
            >
              <div
                style={{
                  flex: 1
                }}
              >
                {search &&
                  search.length > 0 && (
                    <SearchExpand
                      defaultSearchs={this.params.searchs || []}
                      search={search}
                      onSearchChange={searchs => {
                        this.jumpUrl({
                          searchs,
                          skip: 0,
                        });
                      }}
                    />
                  )}
              </div>
            </div>
          </Col>
        </Row>
        <Table
          rowKey="id"
          scroll={{
            x: 1000
          }}
          style={{
            marginTop: 16
          }}
          columns={columns}
          rowSelection={rowSelection}
          dataSource={data}
          pagination={this.getAll ? false : pages ? false : pagination}
          className="TableExpand"
          locale={{
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据'
          }}
        />
      </Panel>
    );
  }
}

// search: [
//   {
//     type: "field",
//     field: "a1",
//     title:"订单编号"
//   },
//   {
//     type: "relevance"
//   },
//   {
//     type: "number"
//   },
//   {
//     type: "option"
//   },
//   {
//     type: "date"
//   }
// ]
