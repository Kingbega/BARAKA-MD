/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kingbega.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Baraka - Kingbega 
 


------------------------------------------------------------------------------------------------------------------------------------------------------*/

const { System, isPrivate, sleep, shell, version, changeVar, setData } = require("../lib/");
const Config = require("../config");
const simpleGit = require("simple-git");
const git = simpleGit();
const { gitPull, getDeployments, redeploy, updateBot, setVar, changeEnv, herokuRestart } = require("./client/");

System({
    pattern: "shutdown",
    fromMe: true,
    type: "server",
    desc: "shutdown bot",
}, async (message) => {
    await message.reply(`_Baraka Md is shutting down..._`);
    return await shell("npm stop");
});

System({
  pattern: "setvar",
  fromMe: true,
  type: "server",
  desc: "Set environment variable",
}, async (message, match, m) => {
  const server = message.client.server;
  if (!match) return await message.reply(`Example: .setvar SUDO:255762190568`);
  const [key, ...part] = match.split(":");
  const value = part.join(":").trim();
  if (!key || !value) return await message.send(`_*Example: .setvar SUDO:255762190568*_`);
  if (server === "HEROKU") {
    await m.send(`_*Updated variable ${key.toUpperCase()}: ${value}*`);
    const env = await setVar(key.toUpperCase(), value);
    if (!env) return m.reply(env);
  } else if (server === "KOYEB") {
    const koyebEnv = await changeEnv(key.toUpperCase(), value);
    await m.reply(koyebEnv);
  } else if (server === "RAILWAY") {
    await m.reply(`*${server} can't change variable, change it manually*`);
  } else {
    const env = await changeVar(key.toUpperCase(), value);
    if (!env) return m.send("*Error in changing variable*");
    await setData(key.toUpperCase(), value, !!value, "vars");
    await m.reply(`_*Environment variable ${key.toUpperCase()} set to ${value}*_`);
    await require('pm2').restart('index.js');
  }
});


System({
    pattern: "platform",
    fromMe: true,
    type: "server",
    desc: "Show which platform you delpoyed",
}, async (m, match) => {
    m.reply("_*" + "You are delpoyed on " + m.client.server + "*_");
});

System({
    pattern: "delvar",
    fromMe: true,
    type: "server",
    desc: "Delete environment variable",
}, async (message, match, m) => {
    const server = message.client.server;
    if (!match) return await message.reply("_Example: delvar sudo_");
    const key = match.trim().toUpperCase();
    if (server === "HEROKU") {
      await m.reply(`_*deleted var ${key.toUpperCase()}*_`);
      const env = await setVar(key.toUpperCase(), null);
      if (!env) return m.reply(env);
    } else if (server === "KOYEB") {
      const koyebEnv = await changeEnv(key.toUpperCase(), null);
      await m.reply(`_*deleted var ${key.toUpperCase()}*_`);
    } else if (server === "RAILWAY") {
      await m.reply(`*${server} can't change variable, change it manually*`);
    } else {
      const env = await changeVar(key.toUpperCase(), "");
      if (!env) return m.reply("*Error in deleted variable*");  
      await setData(key.toUpperCase(), null, false, "vars");
      await m.reply(`_*deleted var ${key.toUpperCase()}*_`);
      await require('pm2').restart('index.js');
    }
});

System({
    pattern: "allvar",
    fromMe: true,
    type: "server",
    desc: "all environment variables",
}, async (message) => {
    delete Config.DATABASE;
    delete Config.ALIVE_DATA;
    delete Config.GOODBYE_MSG;
    delete Config.WELCOME_MSG;
    if (message.client.server !== "HEROKU") {
        delete Config.HEROKU_API_KEY;
        delete Config.HEROKU_APP_NAME;
    }
    if (message.client.server !== "KOYEB") {
        delete Config.KOYEB_API;
    }
    let s = '\n*All Your Vars*\n\n';
    for (const key in Config) {
        s += `*${key}*: ${Config[key]}\n\n`;
    }
    await message.reply(s);
});

System({
    pattern: "getvar",
    fromMe: true,
    type: "server",
    desc: "Show env",
}, async (message, match) => {
    if(!match) return message.reply("_*eg: getvar sudo*_");
    const requestedVar = match.trim().toUpperCase();
    if (Config.hasOwnProperty(requestedVar)) {
        message.reply(`*${requestedVar}*: ${Config[requestedVar]}`);
    } else {
        message.reply(`_*Variable '${requestedVar}' not found.*_`);
    }
});

System({
    pattern: "getsudo", 
    fromMe: true, 
    desc: "shows sudo", 
    type: "server" 
 }, async (message, match) => {
    await message.reply("_*SUDO NUMBER'S ARA :*_ "+"```"+Config.SUDO+"```")
});

System({
    pattern: "setsudo", 
    fromMe: true, 
    desc: "set sudo", 
    type: "server" 
}, async (message, match, m) => { 
    const server = message.client.server;
    let newSudo;
    if (message.mention && message.mention.jid && message.mention.jid[0]) {
      newSudo = message.mention.jid[0].split("@")[0];
    } else if (message.reply_message && message.reply_message.sender) {
      newSudo = message.reply_message.sender.split("@")[0];
    } else {
      newSudo = null;
    }

    if (!newSudo && !match) return await m.reply("_Reply to someone/mention_\n*Example:* . setsudo @user");

    let setSudo = Config.SUDO;
    if (newSudo) {
        setSudo = (setSudo + "," + newSudo).replace(/,,/g, ",");
        setSudo = setSudo.startsWith(",") ? setSudo.replace(",", "") : setSudo;
    }

    await message.reply("*new sudo numbers are :* " + setSudo);
    await message.reply("_It takes 30 seconds to take effect_");

    if (server === "HEROKU") {
      const env = await setVar("SUDO", setSudo);
      if (!env) return m.reply(env);
    } else if (server === "KOYEB") {
      const koyebEnv = await changeEnv("SUDO", setSudo);
    } else if (server === "RAILWAY") {
      await m.reply(`*${server} can't change variable, change it manually*`);
    } else {
      const env = await changeVar("SUDO", setSudo);
      if (!env) return m.send("*Error set sudo*");  
      await setData("SUDO", setSudo, !!setSudo, "vars");
      await require('pm2').restart('index.js');
    }
});

System({
  pattern: "delsudo ?(.*)",
  fromMe: true,
  desc: "delete sudo sudo",
  type: "server",
}, async (m, text, message) => {
  const server = message.client.server;
  let sudoNumber = m.quoted? m.reply_message.sender : text;
  sudoNumber = sudoNumber.split("@")[0];
  if (!sudoNumber) return await m.send("*Need reply/mention/number*");
  let sudoList = Config.SUDO.split(",");
  sudoList = sudoList.filter((number) => number!== sudoNumber);
  let newSudoList = sudoList.join(",");
  await m.send(`NEW SUDO NUMBERS ARE: \n\`\`\`${newSudoList}\`\`\``, { quoted: m.data });
  await m.send("_IT TAKES 30 SECONDS TO MAKE EFFECT_", { quoted: m });
   if (server === "HEROKU") {
      const env = await setVar("SUDO", newSudoList);
      if (!env) return m.reply(env);
    } else if (server === "KOYEB") {
      const koyebEnv = await changeEnv("SUDO", newSudoList);
    } else if (server === "RAILWAY") {
      await m.reply(`*${server} can't change variable, change it manually*`);
    } else {
      const env = await changeVar("SUDO", newSudoList);
      if (!env) return m.send("*Error set sudo*");  
      await setData("SUDO", newSudoList, !!newSudoList, "vars");
      await require('pm2').restart('index.js');
    }
});

System({
    pattern: "update",
    fromMe: true,
    type: "server",
    desc: "Checks for update.",
}, async (message, match) => {
    const server = message.client.server;
    await git.fetch();
    var commits = await git.log([Config.BRANCH + "..origin/" + Config.BRANCH,]);
    if (match == "now") {
        if (commits.total === 0) {
            return await message.reply(`_Baraka is on the latest version: v${version}_`);
        } else {
            if (server === "HEROKU") {
                await updateBot(message);
            } else if (server === "KOYEB") {
                await message.send("_*Building preparing 𐍮*_")
                let check = await getDeployments();
                if (check === 'true') return message.reply('_Please wait..._\n_Currently 2 instances are running in Koyeb, wait to stop one of them._');
                let data = await redeploy();
                return await message.reply(data);
            } else {
                await gitPull(message);
                await require('pm2').restart('index.js');
            }
        }
    } else if (commits.total === 0) {
        return await message.send(`_Baraka is on the latest version: v${version}_`);
    } else {
        var availupdate = "*Updates available for Baraka-Md* \n\n";
        commits["all"].map((commit, num) => {
            availupdate += num + 1 + " ●  " + commit.message + "\n";
        });
        return await message.send(`${availupdate}\n\n _type *${message.prefix} update now*_`);
    }
});

System({
  pattern: "restart",
  fromMe: true,
  desc: "for restart bot",
  type: "server",
}, async (message) => {
  await message.send("_*Restarting*_");
  message.client.server === "HEROKU" ? await herokuRestart(message) : await shell("pm2 restart Jarvis-md");
});

System({
  pattern: "mode",
  fromMe: true,
  type: "server",
  desc: "change work type",
}, async (message, value, m) => {
  if (!value) {
    return message.isGroup
     ? await message.send("Choose mode", {
          values: [
            { displayText: "private", id: "mode private" },
            { displayText: "public", id: "mode public" },
          ],
          onlyOnce: true,
          withPrefix: true,
          participates: [message.sender],
        }, "poll")
      : message.reply("_*mode private/public*_");
  }
  const workType = value.toLowerCase();
  if (workType!== "public" && workType!== "private") return;
  await message.send(`_*Work type changed to ${workType}*_`);
  let env;
  switch (message.client.server) {
    case "HEROKU":
      env = await setVar("WORK_TYPE", workType);
      break;
    case "KOYEB":
      env = await changeEnv("WORK_TYPE", workType);
      break;
    case "RAILWAY":
      return m.reply(`*${message.client.server} can't change variable, change it manually*`);
    default:
      env = await changeVar("WORK_TYPE", workType);
      if (!env) return await m.send("*Error in changing variable*");
      await setData("WORK_TYPE", workType,!!workType, "vars");
      await require('pm2').restart('index.js');
  }
  if (!env) return await m.reply(env);
});
