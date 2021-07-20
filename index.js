const discord = require("discord.js");
const db = require('croxydb');
const fs = require("fs");
const client = new discord.Client();
client.commands = new discord.Collection();
client.aliases = new discord.Collection();
require("./dash.js")(client);

client.on('ready', () => {
  console.log("bot ve dashboard kullanıma hazır.");
  client.user.setPresence({
    activity: {
      name: "Ghost Development Komutlu Dashboard",
      type: "WATCHING"
    },// discord.gg/delimine 
    status: "idle"
  });
});

client.on('message', message => {
  let prefix = "!";
  if (message.author.bot) return;
  if (message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  };
  if (cmd) {
    cmd.run(client, message, args);
  };
});

fs.readdir('./commands/', (err, files) => {
  if (err) console.log(err);
  console.log(`${files.length} komut yüklenecek.`);
  files.forEach(file => {
    let cmd = require(`./commands/${file}`);
    console.log(`${cmd.help.name} komutu yüklendi.`)
    client.commands.set(cmd.help.name, cmd);
    cmd.help.aliases.forEach(alias => {
      client.aliases.set(alias, cmd.help.name);
    });
  });
});


client.login("BOT_TOKEN").catch(error => { console.log("bot tokeni yanlış") });