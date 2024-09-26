const path = require('path');
const config = require('./config');
const { requireJS, retrivePlugins, client } = require('./lib');
async function initialize() {
 await requireJS(path.join(__dirname, '/lib/Client/database/'));
 console.log('Syncing Database');
 await config.DATABASE.sync();
 console.log('⬇  Installing Plugins...');
 await requireJS(path.join(__dirname, '/plugins/'));
 await retrivePlugins();
 return await client();
}

initialize();
