import React from "react";
import { Input, Icon, Radio, InputNumber, Button } from "antd";
import classNames from "classnames";
import moment from "../../components/Moment";
import { Calendar, DateRange } from "react-date-range";
import * as rdrLocales from "react-date-range/dist/locale";
import axios from "axios";
import config from "../../config";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
const RadioGroup = Radio.Group;
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};

export default class SearchExpand extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(
      {},
      {
        openField: "",
        searchs: props.defaultSearchs || []
      },
      this.initSearchState(props.search)
    );
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  initSearchState(search = {}) {
    let searchState = {};
    search.map(s => {
      if (s.type === "date") {
        searchState[s.field] = {
          type: "gt", //[gt,lt,range]
          values: new Date()
          // {
          //   startDate: new Date(),
          //   endDate: new Date()
          // }
        };
      } else if (s.type === "number") {
        searchState[s.field] = {};
      } else if (s.type === "relevance") {
        searchState[s.field] = {
          data: []
        };
      }
    });
    return { searchState };
  }

  addSearch = (text, type, field, title) => {
    const { searchs } = this.state;
    let curSearch = { field, type, title };
    let newSearchs = [],
      isNew = true;
    searchs.map(s => {
      if (s.field === field) {
        curSearch = s;
        isNew = false;
      }
    });

    // switch (type) {
    //   case "field":
    //     if (curSearch.values.indexOf(text) === -1) {
    //       curSearch.values.push(text);
    //     }
    //     break;
    //   case "relevance":
    //     if (curSearch.values.indexOf(text) === -1) {
    //       curSearch.values.push(text);
    //     }
    //     break;
    //   case "number":
    //     curSearch.values = text;
    //     break;
    //   case "option":
    //     curSearch.values = text;
    //     break;
    //   case "date":
    //     curSearch.values = text;
    //     break;
    //   default:
    //     break;
    // }

    curSearch.values = text;

    if (isNew) {
      newSearchs = searchs;
      newSearchs.push(curSearch);
    } else {
      searchs.map(s => {
        if (s.field === field) {
          newSearchs.push(curSearch);
        } else {
          newSearchs.push(s);
        }
      });
    }
//  console.log(newSearchs);
    this.setState({ searchs: newSearchs, searchText: null });
    this.props.onSearchChange && this.props.onSearchChange(newSearchs);
  };

  removeSearch = field => {
    const { searchs } = this.state;
    this.setState({ searchs: searchs.filter(s => s.field !== field) }, () => {
      this.props.onSearchChange &&
        this.props.onSearchChange(this.state.searchs);
    });
  };

  returnSearchItem = search => {
    switch (search.type) {
      case "field":
        return (
          <li key={search.field}>
            <div
              className="o-dropdown-option"
              onClick={() => {
                this.addSearch(
                  this.state.searchText,
                  search.type,
                  search.field,
                  search.title
                );
              }}
            >
              <span>
                搜索 {search.title}为：{this.state.searchText}
              </span>
            </div>
          </li>
        );
      case "relevance":
        return (
          <li key={search.field}>
            <div
              className="o-dropdown-option"
              onClick={() => {
                let openField = this.state.openField === search.field?"":search.field;
                this.setState({
                  openField
                },()=>{
                  if( openField && search.model && search.model.field && search.model.api ){
                    axios({
                      method: "get",
                      url: `${search.model.api}`,
                      headers: { Authorization: localStorage.token },
                      params: {
                        filter:{
                          where: {
//                          [search.model.field]: { like: `%${this.state.searchText}%` }
//改成非模糊搜索
                            [search.model.field]:this.state.searchText
                          },
                          limit: 5
                        }
                      }
                    }).then(res => {
                      let data = res.data;

                      if(res.data&&(res.data.total||res.data.total===0)){
                        data=res.data.data
                      }

                      this.setState({searchState:{...this.state.searchState,[search.field]:{data:data.map((rd)=>{
                        return {
                          title: rd[search.model.field],
                          value: rd.id
                        }
                      })}}})
                    }).catch(err => {});
                  }
                });
              }}
            >
              <Icon type="right" />
              <span>搜索 {search.title}为：{this.state.searchText}</span>
            </div>
            <ul className="o-dropdown-child-menu"
              style={
                this.state.openField === search.field
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              {this.state.searchState[search.field].data.length>0?this.state.searchState[search.field].data.map(so => (
                <li
                  key={so.value}
                  onClick={() => {
                    this.addSearch(
                      { value: so.value, title: so.title },
                      search.type,
                      search.field,
                      search.title
                    );
                  }}
                >
                  <span className="o-dropdown-option">{so.title}</span>
                </li>
              )):<li><span className="o-dropdown-option">结果为空</span></li>}
            </ul>
          </li>
        );
      case "number":
        return (
          <li key={search.field}>
            <div
              className="o-dropdown-option"
              onClick={() => {
                this.setState({
                  openField:
                    this.state.openField === search.field ? "" : search.field
                });
              }}
            >
              <Icon type="right" />
              <span>搜索 {search.title} 范围</span>
            </div>
            <ul
              className="o-dropdown-child-menu"
              style={
                this.state.openField === search.field
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              <li>
                <div
                  className="o-dropdown-option"
                  onClick={() => {
                    if (Number(this.state.searchText)) {
                      this.addSearch(
                        [Number(this.state.searchText), null],
                        search.type,
                        search.field,
                        search.title
                      );
                    }
                  }}
                >
                  <span style={{ marginRight: 8 }}>{`金额`}</span>
                  <span style={{ marginRight: 8 }}>{`>`}</span>
                  <span>{this.state.searchText}</span>
                </div>
              </li>
              <li>
                <div
                  className="o-dropdown-option"
                  onClick={() => {
                    if (Number(this.state.searchText)) {
                      this.addSearch(
                        [null, Number(this.state.searchText)],
                        search.type,
                        search.field,
                        search.title
                      );
                    }
                  }}
                >
                  <span style={{ marginRight: 8 }}>{`金额`}</span>
                  <span style={{ marginRight: 8 }}>{`<`}</span>
                  <span>{this.state.searchText}</span>
                </div>
              </li>
              <li>
                <div className="o-dropdown-option">
                  <span style={{ marginRight: 8 }}>
                    {this.state.searchText}
                  </span>
                  <span style={{ marginRight: 8 }}>{`<`}</span>
                  <span style={{ marginRight: 8 }}>{`金额`}</span>
                  <span style={{ marginRight: 8 }}>{`<`}</span>
                  <InputNumber
                    size="small"
                    value={this.state.searchState[search.field].lt}
                    onChange={val => {
                      this.setState({
                        searchState: {
                          ...this.state.searchState,
                          [search.field]: {
                            lt: val
                          }
                        }
                      });
                    }}
                  />
                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    size="small"
                    onClick={() => {
                      if (
                        this.state.searchText &&
                        Number(this.state.searchText) &&
                        this.state.searchState[search.field].lt &&
                        Number(this.state.searchState[search.field].lt)
                      ) {
                        this.addSearch(
                          [
                            Number(this.state.searchText),
                            Number(this.state.searchState[search.field].lt)
                          ],
                          search.type,
                          search.field,
                          search.title
                        );
                      }
                    }}
                  >
                    搜索
                  </Button>
                </div>
              </li>
              <li>
                <div className="o-dropdown-option">
                  <InputNumber
                    size="small"
                    value={this.state.searchState[search.field].gt}
                    onChange={val => {
                      this.setState({
                        searchState: {
                          ...this.state.searchState,
                          [search.field]: {
                            gt: val
                          }
                        }
                      });
                    }}
                  />
                  <span style={{ marginLeft: 8 }}>{`<`}</span>
                  <span style={{ marginLeft: 8 }}>{`金额`}</span>
                  <span style={{ marginLeft: 8 }}>{`<`}</span>
                  <span style={{ marginLeft: 8 }}>{this.state.searchText}</span>
                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    size="small"
                    onClick={() => {
                      if (
                        this.state.searchText &&
                        this.state.searchState[search.field].gt
                      ) {
                        this.addSearch(
                          [
                            Number(this.state.searchState[search.field].gt),
                            Number(this.state.searchText)
                          ],
                          search.type,
                          search.field,
                          search.title
                        );
                      }
                    }}
                  >
                    搜索
                  </Button>
                </div>
              </li>
            </ul>
          </li>
        );
      case "option":
        return (
          <li key={search.field}>
            <div
              className="o-dropdown-option"
              onClick={() => {
                this.setState({
                  openField:
                    this.state.openField === search.field ? "" : search.field
                });
              }}
            >
              <Icon type="right" />
              <span>搜索 {search.title}</span>
            </div>
            <ul
              className="o-dropdown-child-menu"
              style={
                this.state.openField === search.field
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              {search.options.map(so => (
                <li
                  key={so.value}
                  onClick={() => {
                    this.addSearch(
                      { value: so.value, title: so.title },
                      search.type,
                      search.field,
                      search.title
                    );
                  }}
                >
                  <span className="o-dropdown-option">{so.title}</span>
                </li>
              ))}
            </ul>
          </li>
        );
      case "date":
        return (
          <li key={search.field}>
            <div
              className="o-dropdown-option"
              style={{ zIndex: 2 }}
              onClick={() => {
                this.setState({
                  openField:
                    this.state.openField === search.field ? "" : search.field
                });
              }}
            >
              <Icon type="right" />
              <span>搜索 {search.title} 范围</span>
            </div>
            <div
              style={
                this.state.openField === search.field
                  ? { display: "block", zIndex: 1 }
                  : { display: "none", zIndex: 1 }
              }
            >
              <div className="o_searchview-date">
                <div>
                  <RadioGroup
                    onChange={e => {
                      let type = e.target.value,
                        value = new Date();
                      if (type === "range") {
                        value = {
                          startDate: new Date(),
                          endDate: new Date()
                        };
                      }
                      this.setState({
                        searchState: {
                          ...this.state.searchState,
                          [search.field]: { type: e.target.value, value }
                        }
                      });
                    }}
                    value={
                      this.state.searchState[search.field]
                        ? this.state.searchState[search.field].type
                        : ""
                    }
                  >
                    <Radio style={radioStyle} value={"gt"}>
                      大于所选时间
                    </Radio>
                    <Radio style={radioStyle} value={"lt"}>
                      小于所选时间
                    </Radio>
                    <Radio style={radioStyle} value={"range"}>
                      时间范围
                    </Radio>
                  </RadioGroup>
                </div>
                <div>
                  {(() => {
                    if (this.state.searchState[search.field]) {
                      if (this.state.searchState[search.field].type === "gt") {
                        return (
                          <Calendar
                            locale={rdrLocales["zhCN"]}
                            date={this.state.searchState[search.field].value}
                            onChange={value => {
                              this.setState(
                                {
                                  searchState: {
                                    ...this.state.searchState,
                                    [search.field]: {
                                      type: "gt",
                                      value
                                    }
                                  }
                                },
                                () => {
                                  this.addSearch(
                                    { startDate: value, endDate: null },
                                    search.type,
                                    search.field,
                                    search.title
                                  );
                                }
                              );
                            }}
                          />
                        );
                      } else if (
                        this.state.searchState[search.field].type === "lt"
                      ) {
                        return (
                          <Calendar
                            locale={rdrLocales["zhCN"]}
                            date={this.state.searchState[search.field].value}
                            onChange={value => {
                              this.setState(
                                {
                                  searchState: {
                                    ...this.state.searchState,
                                    [search.field]: {
                                      type: "lt",
                                      value: value
                                    }
                                  }
                                },
                                () => {
                                  this.addSearch(
                                    { startDate: null, endDate: value },
                                    search.type,
                                    search.field,
                                    search.title
                                  );
                                }
                              );
                            }}
                          />
                        );
                      } else if (
                        this.state.searchState[search.field].type === "range"
                      ) {
                        return (
                          <DateRange
                            locale={rdrLocales["zhCN"]}
                            moveRangeOnFirstSelection={false}
                            ranges={[
                              this.state.searchState[search.field].value
                            ]}
                            onChange={values => {
                              this.setState({
                                searchState: {
                                  ...this.state.searchState,
                                  [search.field]: {
                                    type: "range",
                                    value: values.range1
                                  }
                                }
                              });
                              if (
                                values.range1.startDate !==
                                values.range1.endDate
                              ) {
                                this.addSearch(
                                  values.range1,
                                  search.type,
                                  search.field,
                                  search.title
                                );
                              }
                            }}
                          />
                        );
                      }
                    }
                  })()}
                </div>
              </div>
            </div>
          </li>
        );
      default:
        break;
    }
  };

  returnLabel = label => {
    let valueJsx;

    switch (label.type) {
      case "field":
        valueJsx = (
          <div className="o_facet_values">
            <span>
              {label.values && label.values.constructor === Array
                ? label.values.join(" 或 ")
                : label.values}
            </span>
          </div>
        );
        break;
      case "relevance":
        valueJsx = (
          <div className="o_facet_values">
            <span>{label.values.title}</span>
          </div>
        );
        break;
      case "number":
        valueJsx = (
          <div className="o_facet_values">
            {(() => {
              if (label.values[0] && label.values[1]) {
                return (
                  <span>{` > ${label.values[0]} && < ${
                    label.values[1]
                  } `}</span>
                );
              } else if (label.values[0]) {
                return <span>{` > ${label.values[0]}`}</span>;
              } else if (label.values[1]) {
                return <span>{` < ${label.values[1]} `}</span>;
              }
            })()}
          </div>
        );
        break;
      case "option":
        valueJsx = (
          <div className="o_facet_values">
            <span>{label.values.title}</span>
          </div>
        );
        break;
      case "date":
        valueJsx = (
          <div className="o_facet_values">
            <span>{`${
              label.values.startDate && !label.values.endDate ? " > " : ""
            }${!label.values.startDate && label.values.endDate ? " < " : ""}${
              label.values.startDate
                ? moment(label.values.startDate).format("YYYY-MM-DD")
                : ""
            }${label.values.startDate && label.values.endDate ? " ~ " : ""}${
              label.values.endDate
                ? moment(label.values.endDate).format("YYYY-MM-DD")
                : ""
            }`}</span>
          </div>
        );
        break;
      default:
        break;
    }

    return (
      <div key={label.field} className="o_searchview_facet">
        <span className="o_searchview_facet_label">{label.title}</span>
        {valueJsx}
        <Icon
          type="close"
          className="o_facet_remove"
          onClick={() => {
            this.removeSearch(label.field);
          }}
        />
      </div>
    );
  };

  render() {
    const { search } = this.props;
    return (
      <div className={classNames("o_cp_searchview", this.props.className)}>
        <div
          className={classNames(
            "o_searchview",
            this.state.focus && "o_searchview-select"
          )}
        >
          <ul
            className="o-dropdown-menu o_searchview_autocomplete animated fadeInDown"
            role="menu"
            style={
              this.state.searchText ? { display: "block" } : { display: "none" }
            }
          >
            {search.map(s => this.returnSearchItem(s))}
          </ul>
          {this.state.searchs.map(s => this.returnLabel(s))}
          <input
            className="o_searchview_input"
            placeholder="搜索..."
            type="text"
            value={this.state.searchText || ""}
            onChange={e => {
              this.setState({ searchText: e.target.value });
            }}
            onFocus={() => {
              this.setState({ focus: true });
            }}
            onBlur={() => {
              this.setState({ focus: false });
            }}
          />
        </div>
      </div>
    );
  }
}

{
  /* <li>
  <div className="o-dropdown-option">
    <span>搜索 用户名为：{this.state.searchText}</span>
  </div>
</li>
<li>
  <div className="o-dropdown-option">
    <Icon type="right" />
    <span>搜索 状态</span>
  </div>
  <ul className="o-dropdown-child-menu">
    <li>
      <span className="o-dropdown-option">启用</span>
    </li>
    <li>
      <span className="o-dropdown-option">禁用</span>
    </li>
  </ul>
</li>
<li>
  <div className="o-dropdown-option">
    <Icon type="right" />
    <span>搜索 金额 范围</span>
  </div>
  <ul className="o-dropdown-child-menu">
    <li>
      <div className="o-dropdown-option">
        <span style={{ marginRight: 8 }}>{`金额`}</span>
        <span style={{ marginRight: 8 }}>{`>`}</span>
        <span>{this.state.searchText}</span>
      </div>
    </li>
    <li>
      <div className="o-dropdown-option">
        <span style={{ marginRight: 8 }}>{`金额`}</span>
        <span style={{ marginRight: 8 }}>{`<`}</span>
        <span>{this.state.searchText}</span>
      </div>
    </li>
    <li>
      <div className="o-dropdown-option">
        <span style={{ marginRight: 8 }}>
          {this.state.searchText}
        </span>
        <span style={{ marginRight: 8 }}>{`<`}</span>
        <span style={{ marginRight: 8 }}>{`金额`}</span>
        <span style={{ marginRight: 8 }}>{`<`}</span>
        <InputNumber size="small" />
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          size="small"
        >
          搜索
        </Button>
      </div>
    </li>
    <li>
      <div className="o-dropdown-option">
        <InputNumber size="small" />
        <span style={{ marginLeft: 8 }}>{`<`}</span>
        <span style={{ marginLeft: 8 }}>{`金额`}</span>
        <span style={{ marginLeft: 8 }}>{`<`}</span>
        <span style={{ marginLeft: 8 }}>
          {this.state.searchText}
        </span>
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          size="small"
        >
          搜索
        </Button>
      </div>
    </li>
  </ul>
</li>
<li>
  <div className="o-dropdown-option">
    <Icon type="right" />
    <span>搜索 角色为：{this.state.searchText}</span>
  </div>
  <ul className="o-dropdown-child-menu">
    <li>
      <span className="o-dropdown-option">管理员</span>
    </li>
    <li>
      <span className="o-dropdown-option">运营人员</span>
    </li>
  </ul>
</li>
<li>
  <div className="o-dropdown-option" style={{ zIndex: 2 }}>
    <Icon type="right" />
    <span>搜索 创建时间 范围</span>
  </div>
  <div className="o_searchview-date" style={{ zIndex: 1 }}>
    <div>
      <RadioGroup onChange={this.onChange} value={this.state.value}>
        <Radio style={radioStyle} value={1}>
          大于所选时间
        </Radio>
        <Radio style={radioStyle} value={2}>
          小于所选时间
        </Radio>
        <Radio style={radioStyle} value={3}>
          时间范围
        </Radio>
      </RadioGroup>
    </div>
    <div>
      <Calendar locale={rdrLocales["zhCN"]} />
    </div>
  </div>
</li> */
}
