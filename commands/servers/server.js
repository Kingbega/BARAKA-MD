const Heroku = require('heroku-client');
const Config = require('../../config');
const heroku = new Heroku({ token: Config.HEROKU_API_KEY });
const baseURI = `/apps/${Config.HEROKU_APP_NAME}`;
const axios = require('axios');
const axiosConfig = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Authorization: `Bearer ${Config.KOYEB_API}`,
  },
};

async function setVar(key, value) {
  try {
    const response = await heroku.patch(`${baseURI}/config-vars`, {
      body: {
        [key.toUpperCase()]: value,
      },
    });
    return true;
  } catch (error) {
    return `Error setting config var: ${error}`;
  }
};

async function changeEnv(key, value) {
  try {
    const koyebResponse = await axios.get('https://app.koyeb.com/v1/services', axiosConfig);
    const serviceId = koyebResponse.data.services[0].id;
    const deploymentResponse = await axios.get(`https://app.koyeb.com/v1/deployments/${koyebResponse.data.services[0].latest_deployment_id}`, axiosConfig);
    const envVars = deploymentResponse.data.deployment.definition.env.map((envVar) => {
      if (envVar.key === key) {
        return { scopes: ['region:fra'], key, value };
      }
      return envVar;
    });
    if (!envVars.some((envVar) => envVar.key === key)) {
      envVars.push({ scopes: ['region:fra'], key, value });
    }
    const body = {
      definition: {
        ...deploymentResponse.data.deployment.definition,
        env: envVars,
      },
    };
    const updateResponse = await axios.patch(`https://app.koyeb.com/v1/services/${serviceId}`, body, axiosConfig);
    if (updateResponse.status === 200) {
      return `_*Successfully changed var ${key}:${value}*_`;
    } else {
      return '_Please put Koyeb api key in var KOYEB_API._\nEg: KOYEB_API:api key';
    }
  } catch (error) {
    return `_Error changing env var: ${error}_`;
  }
};

async function herokuRestart(message) {
  try {
    await heroku.delete(baseURI + "/dynos");
    return true;
  } catch (error) {
    return await message.send(`HEROKU : ${error.body.message}`);
  }
};


module.exports = { setVar, changeEnv, herokuRestart };
