const Discord = require('discord.js');
module.exports.help = {
  name: "ping",
  aliases: ["ping"],
  description: "Ping",
  usage: "!ping"
};
exports.run = function(client, message, args) {
  message.reply(':black_joker: Pong!')
     };
