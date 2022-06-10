//import runtimeEnv from '@mars/heroku-js-runtime-env';

const config = {
  apiBasePath: process.env.REACT_APP_API_URL,
  reactAppMode: process.env.REACT_APP_MODE || 'dev',
};

export default config;
