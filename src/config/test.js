import baseConfig from './base';

const config = {
  apiUrl: 'https://hk.uugo.in',
  mobileUrl: "https://hk.uugo.in/#/",
  env: 'test'  // don't remove the appEnv property here
};

export default Object.freeze(Object.assign(baseConfig, config));
