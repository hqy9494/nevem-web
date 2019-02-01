import React, { Component } from "react";
import createReactClass from "create-react-class";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";

import BaseConstructor from "./base";

import Indexs from "../Indexs/modules";
import Setting from "../Setting/modules";
import Equipment from "../Equipment/modules";
import Good from "../Good/modules";
import Strategy from "../Strategy/modules";
import Stock from "../Stock/modules";
import Order from "../Order/modules";
import System from "../System/modules";
import Agency from "../Agency/modules";
import Replenish from "../Replenish/modules";
import Site from "../Site/modules";
import Statistics from "../Statistics/modules";
import Advertising from "../Advertising/modules";
import Collection from "../Collection/modules";
import Account from "../Account/modules";

const modules = {
  Indexs,
  Setting,
  Equipment,
  Good,
  Strategy,
  Stock,
  Order,
  System,
  Agency,
  Replenish,
  Site,
  Statistics,
  Advertising,
  Collection,
  Account,
};

export function mapDispatchToProps(dispatch) {
  return {};
}

const mapStateToProps = createStructuredSelector({});

// 终节点组件路由 （若组件为配置数组，调用base方法）
const endPointComponent = (path, model, component, name = "") => {
  let module = modules[model][component];
  let router = createReactClass({
    render() {
      if (module.component && module.component.constructor === Array) {
        return (
          <Route
            key={path}
            path={path}
            component={BaseConstructor(module, name)}
          />
        );
      } else {
        return <Route key={path} path={path} component={module} />;
      }
    }
  });
  return withRouter(connect(mapStateToProps, mapDispatchToProps)(router));
};

// 终节点redirect路由
const endPointRedirect = (path, redirect) => {
  let router = createReactClass({
    render() {
      return (
        <Route
          exact
          key={path}
          path={path}
          render={props => <Redirect to={redirect} />}
        />
      );
    }
  });
  return withRouter(connect(mapStateToProps, mapDispatchToProps)(router));
};

// 读取配置，递归生成路由（需要组件引用为固定格式）
const fullRouters = (obj, path = "", module = null, superRouter = null) => {
  let innerRouter = [];

  if (superRouter) {
    if (superRouter.redirect) {
      innerRouter.push(
        <Route
          exact
          key={path}
          path={path}
          render={props => <Redirect to={superRouter.redirect} />}
        />
      );
    } else if (superRouter.component) {
      innerRouter.push(
        <Route
          exact
          key={path}
          path={path}
          component={endPointComponent(
            path,
            superRouter.module || module,
            superRouter.component,
            superRouter.title
          )}
        />
      );
    }
  }

  for (let key in obj) {
    let nPath = path + obj[key].path;
    if (obj[key]["subs"]) {
      innerRouter.push(
        <Route
          key={nPath}
          path={nPath}
          component={fullRouters(
            obj[key]["subs"],
            nPath,
            obj[key]["module"] || module,
            obj[key]
          )}
        />
      );
    } else {
      if (obj[key].redirect) {
        innerRouter.push(
          <Route
            exact
            key={nPath}
            path={nPath}
            component={endPointRedirect(nPath, obj[key].redirect)}
          />
        );
      } else {
        innerRouter.push(
          <Route
            exact
            key={nPath}
            path={nPath}
            component={endPointComponent(
              nPath,
              obj[key]["module"] || module,
              obj[key]["component"],
              obj[key]["title"]
            )}
          />
        );
      }
    }
  }

  class router extends Component {
    render() {
      return <Switch>{innerRouter}</Switch>;
    }
  }

  return withRouter(connect(mapStateToProps, mapDispatchToProps)(router));
};

export default fullRouters;
