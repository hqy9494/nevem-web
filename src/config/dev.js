import baseConfig from "./base";

const config = {
  env: "dev",
  apiUrl: "https://nevem.yooyuu.com.cn", //测试服务器npms
  // apiUrl: "https://api.nevem.mrwish.net",//正式服务器npm
  // loginMqtt: "ws://ws.test.nevem.mrwish.net:4000",
  loginMqtt: "wss://admin.nevem.yooyuu.com.cn:4000"
};

export default Object.freeze(Object.assign({}, baseConfig, config));

