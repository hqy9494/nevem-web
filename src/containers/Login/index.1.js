import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Redirect } from "react-router-dom";
import { authRequest } from "../../services/Auth/actions";
import { makeSelectUser } from "../../services/Auth/selectors";
import { makeUserFetchState } from "../../services/global/selectors";
import Form from "../../components/Form";
import { message } from "antd";


class Login extends React.Component {
  static defaultProps = {
    user: null
  };

  constructor() {
    super();
    this.state = {
      creds: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error.length > 0) {
      let error = nextProps.error;
      message.error(error[error.length - 1]);
    }
  }

  signin = e => {
    e.preventDefault();

    if (this.state.creds.username && this.state.creds.password) {
      this.props.onLogin(this.state.creds);
    }
  };

  onChange(key, value) {
    let creds = this.state.creds;
    creds[key] = value;
    this.setState({ creds });
  }

  render() {
  	let {state} = this.props.location;
  	if(state){
  		state.from.pathname = state.from.pathname==='/Agency/AgencyChange'?'/':state.from.pathname;
  	}
    const { from } = state || { from: { pathname: "/" } };
    const { user, userFetchState } = this.props;
    const { creds = {} } = this.state;

    if (!userFetchState || userFetchState == "fetching") {
      return <div />;
    }

    if (user) {
      return <Redirect to={from} />;
    }

    return (
      <div className="block-center mt-xl wd-xl">
        {/* START panel */}
        <div className="panel panel-dark panel-flat">
          <div className="panel-heading text-center">
              心愿先生
          </div>
          <div className="panel-body">
            <p className="text-center pv">请继续</p>
            <Form onSubmit={this.signin}>
              <div className="form-group has-feedback">
                <input
                  id="exampleInputEmail1"
                  type="text"
                  placeholder="请输入用户名"
                  autoComplete="off"
                  required="required"
                  className="form-control"
                  value={creds.username || ""}
                  onChange={e => {
                    this.onChange("username", e.target.value || "");
                  }}
                />
                <span className="fa fa-envelope form-control-feedback text-muted" />
              </div>
              <div className="form-group has-feedback">
                <input
                  id="exampleInputPassword1"
                  type="password"
                  placeholder="请输入密码"
                  required="required"
                  className="form-control"
                  value={creds.password || ""}
                  onChange={e => {
                    this.onChange("password", e.target.value || "");
                  }}
                />
                <span className="fa fa-lock form-control-feedback text-muted" />
              </div>
              <div className="clearfix">
                <div className="checkbox c-checkbox pull-left mt0">
                  <label>
                    <input type="checkbox" value="" name="remember" />
                    <em className="fa fa-check" />记住密码
                  </label>
                </div>
                <div className="pull-right">
                  {/* <Link to="recover" className="text-muted">Forgot your password?</Link> */}
                </div>
              </div>
              <button type="submit" className="btn btn-block btn-primary mt-lg">
                登录
              </button>
            </Form>
            {/* <p className="pt-lg text-center">Need to Signup?</p> */}
            {/* <Link to="register" className="btn btn-block btn-default">Register Now</Link> */}
          </div>
        </div>
        {/* END panel */}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onLogin: creds => dispatch(authRequest(creds))
  };
}

const error = state => state.get("global").get("error");

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  userFetchState: makeUserFetchState(),
  error
});

Login.propTypes = {
  location: PropTypes.object.isRequired,
  onLogin: PropTypes.func.isRequired,
  user: PropTypes.object,
  userFetchState: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
