import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Redirect } from "react-router-dom";
import { authRequest } from "../../services/Auth/actions";
import { authClient } from "../../services/global/actions";
import { rtsRequest } from "services/rts/actions";
import { makeSelectUser } from "../../services/Auth/selectors";
import { makeUserFetchState } from "../../services/global/selectors";
import QRCode from "qrcode.react";
import axios from "axios";
import config from "../../config";

import { message, Card, Form, Icon, Input, Row, Col, Button } from "antd";

import mqtt from "mqtt";

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 }
  }
};

class Login extends React.Component {
  static defaultProps = {
    user: null
  };

  constructor() {
    super();
    this.state = {
      type: "qr" //phone
    };
    this.getCode = this.getCode.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getQr = this.getQr.bind(this);

    this.countdown = 60;
    this.countQrdown = 180;
  }

  componentDidMount() {
    if (this.props.userFetchState === "fetched" && !this.props.user) {
      this.getQr();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userFetchState === "fetched" && !nextProps.user) {
      this.getQr();
    }
  }

  componentWillUnmount() {
    this.countdownStop();
    this.countdownQrStop();
    this.client && this.client.end();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onLogin({
          mobile: values.mobile,
          code: values.code
        });
      }
    });
  }

  getQr() {
    this.countdownQrStart();
    axios({
      method: "get",
      url: `${config.apiUrl}${config.apiBasePath}/Logins/qr/code`
    })
      .then(res => {
        this.setState({ qr: res.data.url });
        this.client = mqtt.connect(
          config.loginMqtt,
          { username: res.data.code, rejectUnauthorized: false }
        );

        this.client.on("connect", () => {
          this.client.subscribe(
            `/qrcode/login/${res.data.code}/state`,
            function(err) {
              if (!err) {
              }
            }
          );
        });

        this.client.on("message", (topic, message) => {
          message = JSON.parse(message.toString());
          if (message.state === "scan") {
            this.setState({ state_qr: "scan" });
          } else if (message.state === "success") {
            this.setState({ state_qr: "success" }, () => {
              this.client.end();
              if (message.token) {
                this.props.onTokenLogin(message.token);
              }
            });
          }
        });
      })
      .catch(err => {
        message.error(err.response.data.error.message);
      });
  }

  getCode() {
    const { getFieldValue } = this.props.form;
    let mobile = getFieldValue("mobile");
    if (!this.state.s && mobile && /^1[34578]\d{9}$/.test(mobile)) {
      this.countdownStart();

      axios({
        method: "get",
        url: `${config.apiUrl}${config.apiBasePath}/Logins/mobile/code`,
        params: {
          mobile: parseInt(mobile)
        }
      })
        .then(res => {})
        .catch(err => {
          message.error(err.response.data.error.message);
        });
    }
  }

  countdownStart() {
    this.setState({ s: this.countdown }, () => {
      this.countdownTimer = setInterval(() => {
        this.setState({ s: this.state.s - 1 }, () => {
          if (this.state.s === 0) {
            this.countdownStop();
          }
        });
      }, 1000);
    });
  }

  countdownStop() {
    this.countdownTimer && clearInterval(this.countdownTimer);
  }

  countdownQrStart() {
    this.setState({ s_qr: this.countQrdown }, () => {
      this.countdownQrTimer = setInterval(() => {
        this.setState({ s_qr: this.state.s_qr - 1 }, () => {
          if (this.state.s_qr === 0) {
            this.countdownQrStop();
          }
        });
      }, 1000);
    });
  }

  countdownQrStop() {
    this.countdownQrTimer && clearInterval(this.countdownQrTimer);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let { state } = this.props.location;
    if (state) {
      state.from.pathname =
        state.from.pathname === "/Agency/AgencyChange"
          ? "/"
          : state.from.pathname;
    }
    const { from } = state || { from: { pathname: "/" } };
    //  const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { user, userFetchState } = this.props;
    const { type, qr, s, s_qr, state_qr } = this.state;

    if (!userFetchState || userFetchState == "fetching") {
      return <div />;
    }

    if (user) {
      return <Redirect to={from} />;
    }

    return (
      <Card style={{ width: 372 }} className="login-modal">
        {type === "qr" && (
          <div className="login-modal-content">
            <span className="login-modal-tip">验证码登录在这里</span>
            <span
              className="login-modal-switch login-modal-switch_phone"
              onClick={() => {
                this.setState({ type: "phone" });
              }}
            />
            <h3>手机微信扫码，安全登录</h3>
            <div className="login-modal-qrCode">
              <div>
                {state_qr === "scan" && s_qr > 0 && (
                  <div className="login-modal-qrCode＿success">
                    <Icon type="check-circle" theme="outlined" />
                    <span>扫码成功</span>
                  </div>
                )}
                {s_qr === 0 && (
                  <div className="login-modal-qrCode＿lose">
                    <span>二维码已失效</span>
                    <Button
                      type="primary"
                      style={{
                        width: 136,
                        backgroundColor: "#3CBCE5",
                        marginTop: 20,
                        color: "#fff"
                      }}
                      onClick={this.getQr}
                    >
                      点击刷新
                    </Button>
                  </div>
                )}
                {qr && <QRCode value={qr} size={166} />}
              </div>
            </div>
            <span className="login-modal-qrCode-desc">
              打开手机微信，扫一扫登录
            </span>
          </div>
        )}
        {type === "phone" && (
          <div className="login-modal-content">
            <span className="login-modal-tip">扫码登录更安全</span>
            <span
              className="login-modal-switch login-modal-switch_qr"
              onClick={() => {
                this.setState({ type: "qr" });
              }}
            />
            <h3>登录到您的账户</h3>
            <div className="login-modal-phone-form">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem label="手机号码" {...formItemLayout}>
                  {getFieldDecorator("mobile", {
                    rules: [
                      { required: true, message: "请输入手机号码" }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                    />
                  )}
                </FormItem>
                <FormItem label="验证码" {...formItemLayout}>
                  <Row gutter={8}>
                    <Col span={14}>
                      {getFieldDecorator("code", {
                        rules: [{ required: true, message: "请输入验证码" }]
                      })(
                        <Input
                          prefix={
                            <Icon
                              type="lock"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                        />
                      )}
                    </Col>
                    <Col span={10}>
                      <Button style={{ width: "100%" }} onClick={this.getCode}>
                        {(() => {
                          if (s) {
                            return `短信验证(${s})`;
                          } else if (s === 0) {
                            return "重新获取";
                          } else {
                            return "短信验证";
                          }
                        })()}
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      width: "100%",
                      backgroundColor: "#3CBCE5",
                      marginTop: 10
                    }}
                  >
                    登录
                  </Button>
                </FormItem>
              </Form>
            </div>
          </div>
        )}
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onLogin: creds => dispatch(authRequest(creds)),
    onTokenLogin: token => dispatch(authClient(token)),
    rts: (filter, uuid, field, cb, noSpin) =>
      dispatch(rtsRequest(filter, uuid, field, cb, noSpin))
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

const WrappedLogin = Form.create()(Login);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedLogin);
