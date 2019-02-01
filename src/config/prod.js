import baseConfig from "./base";

const config = {
  apiUrl: 'https://api.nevem.mrwish.net',
  loginMqtt: "wss://mqtt.login.mrwish.net:4000",
  env: "prod"
};

export default Object.freeze(Object.assign({}, baseConfig, config));
