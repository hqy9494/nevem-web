import "babel-polyfill";
import "sanitize.css/sanitize.css";
import './theme.less';

import "../src/vendor";

import bootify from "bootify";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import ContextProvider from "react-with-context";
import { Router } from "react-router-dom";

// Import Language Provider
import LanguageProvider from "services/LanguageProvider";
import Main from "containers/Main";

// import './global-styles';
import boot from "./utils/boot";

import initTranslation from "./components/Common/localize";
import initLoadThemes from "./components/Common/load-themes";

// Application Styles
import "./styles/bootstrap.scss";
import "./styles/app.scss";

// Init translation system
initTranslation();
// Init css loader (for themes)
initLoadThemes();

// Disable warning "Synchronous XMLHttpRequest on the main thread is deprecated.."
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
  options.async = true;
});

const app = bootify({});
app.phase(boot(require.context("./boot", true, /^\.\/.*\.(js|jsx)$/)));
app.boot(err => {
  if (err) throw err;

  ReactDOM.render(
    <ContextProvider context={{ app }}>
      <Provider store={app.store}>
        <LanguageProvider messages={app.messages}>
          <Router history={app.history}>
            <Main />
          </Router>
        </LanguageProvider>
      </Provider>
    </ContextProvider>,
    document.getElementById("app")
  );
});
