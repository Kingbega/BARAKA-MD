/*------------------------------------------------------------------------------------------------------------------------------------------------------


Copyright (C) 2024 Kingbega.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Baraka - Kingbega 



------------------------------------------------------------------------------------------------------------------------------------------------------*/


const { System, setData, pluginList, removeData, isUrl, extractUrlsFromText, getData } = require("../lib/");
const axios = require("axios");
const util = require("util");
const fs = require("fs");
  
  
System({
  pattern: "plugin",
  fromMe: true,
  desc: "Installs External plugins",
  type: "user",
}, async (message, match) => {
  let pluginName = ""; 
  match = match || message.reply_message.text;
  if (!match) return await message.send("_Send a plugin url to install plugin_");
  if (match === "list") {
    const data = await pluginList(); 
    if(!data) return message.send("_*no plugin installed*_");
    data.forEach(item => {
      pluginName += `*${item.name}:* ${item.url}\n`;
    });
    return message.send(pluginName);
  } else {
    if (isUrl(match)) {
      const arr = await extractUrlsFromText(match);
      for (const element of arr) {
        try {
          var url = new URL(element);
        } catch (e) {
          console.error(e);
          return await message.send("_Invalid Url_");
        }
        if (url.host === "gist.github.com") {
          url.host = "gist.githubusercontent.com";
          url = url.toString() + "/raw";
        } else {
          url = url.toString();
        }
        try {
          var { data, status } = await axios.get(url);
          if (status == 200) {
            pluginName = data.match(/(?<=pattern:) ["'](.*?)["']/g).map(match => match.trim().split(" ")[0]).join(', ').replace(/'/g, '').replace(/"/g, '');
            if (!pluginName) {
              pluginName = "__" + Math.random().toString(36).substring(8); 
            }
            fs.writeFileSync(__dirname + "/" + pluginName.split(',')[0] + ".js", data);
            try {
              require("./" + pluginName.split(',')[0]);
            } catch (e) {
              fs.unlinkSync(__dirname + "/" + pluginName.split(',')[0] + ".js");
              return await message.send("Invalid Plugin\n\n ```" + util.format(e) + "```");
            }
            await setData(pluginName.split(',')[0], url, "true", "plugin");
            await message.send(`_*New plugin installed : ${pluginName}*_`);
          }
        } catch (error) {
          return await message.send("_Error occurred while installing plugin_");
        }
      }
    } else {
      const { plugin } = await getData(match);
      if(!plugin) return message.reply("_*Plugin not found*_");
      await message.reply(plugin.message);
    }
  }
});


System({
    pattern: "remove(?: |$)(.*)",
    fromMe: true,
    desc: "Remove external plugins",
    type: "user",
}, async (message, match) => {
     if (!match) return await message.send("_*Need a plugin name to remove*_");
       const pluginPath = __dirname + "/" + match + ".js";
       const pluginName = await removeData(match, "plugin");
     if (!fs.existsSync(pluginPath) && !pluginName) {
       return await message.send("_*Plugin not found*_");
     } else {      
       delete require.cache[require.resolve(pluginPath)];
       fs.unlinkSync(pluginPath);
       await message.send(`_*Plugin ${match} deleted successfully*_`);
    }
});
