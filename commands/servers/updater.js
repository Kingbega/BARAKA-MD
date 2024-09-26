const simpleGit = require('simple-git');
const axios = require('axios');
const Heroku = require("heroku-client");
const { exec } = require('child_process');
const Config = require("../../config");
const git = simpleGit();
const heroku = new Heroku({ token: Config.HEROKU_API_KEY });

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Authorization": `Bearer ${Config.KOYEB_API}`
    }
};

const gitPull = async (m) => {
    try {
        m.reply("*Checking for updates...*");
        await git.fetch();
        let newCommits = await git.log(['main..origin/main']);
        if (newCommits.total > 0) {
            m.reply("*New update pending, updating...*");
            await git.pull("origin", "main");
            const packageChanged = newCommits.latest && newCommits.latest.message.includes('package.json');
            if (packageChanged) {
                await new Promise((resolve, reject) => {
                    exec('npm install', (error, stdout, stderr) => {
                        if (error) {
                            m.reply("*Failed to install npm packages!*");
                            reject(error);
                        } else {
                            m.reply("*Installed npm packages successfully..!*");
                            resolve();
                        }
                    });
                });
            };
            if(m.client.server === "REPLIT") {
                return m.reply("_*Bot is updated restart your application manually*_");
            } else {
                return m.reply("*Updated the bot with latest changes.*");
            };
        } else {
            return m.reply("*Bot is already working on the latest version.*");
        }
    } catch (error) {
        return m.reply("*Error updating bot.*");
    }
}

const getDeployments = async () => {
    try {
        const validStatus = new Set(['STOPPED', 'STOPPING', 'ERROR', 'ERRPRING']);
        const response = await axios.get('https://app.koyeb.com/v1/deployments', axiosConfig);
        const deploymentStatuses = response.data.deployments.map(deployment => deployment.status);
        return deploymentStatuses.filter(status => !validStatus.has(status)).length > 1;
    } catch (error) {
        throw new Error("Error fetching deployments");
    }
}

const redeploy = async () => {
    try {
        if (!Config.KOYEB_API) throw new Error("KOYEB_API key is not set.");
        const { data } = await axios.get(`https://app.koyeb.com/v1/services`, axiosConfig);
        if (!data.services.length) throw new Error("No services found.");
        await axios.post(`https://app.koyeb.com/v1/services/${data.services[0].id}/redeploy`, { "deployment_group": "prod" }, axiosConfig);
        return '_*Update started..!*_';
    } catch (error) {
        return '*Error redeploying.*\n*Ensure KOYEB_API key is properly set.*\n_E.g.: KOYEB_API: api key from https://app.koyeb.com/account/api ._';
    }
}

const updateBot = async (message) => {
    try {
        const commits = await git.log(['main..origin/main']);
        if (commits.total === 0) return message.send('_Baraka is on the latest version: v${version}_');
        const app = await heroku.get('/apps/' + Config.HEROKU_APP_NAME);
        await message.send("*Updating Jarvis, please wait...*");
        git.fetch('upstream', 'main');
        git.reset('hard', ['FETCH_HEAD']);
        const git_url = app.git_url.replace("https://", "https://api:" + Config.HEROKU_API_KEY + "@");
        try {
            await git.addRemote('heroku', git_url);
        } catch {
            message.send('Heroku remote adding error');
        }
        await git.push('heroku', 'main');
        return await message.send('_*Bot updated... Restarting.*_');
    } catch (error) {
        return message.send('*Error updating bot.*');
    }
}

module.exports = { gitPull, getDeployments, redeploy, updateBot };
