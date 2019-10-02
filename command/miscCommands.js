const Discord = require("discord.js");

function getJustDoItGif(channel) {
	const justdoit = new Discord.Attachment(`assets/justdoit.gif`, `justdoit.gif`)
	channel.send(justdoit);
}
function getThinkingGif(channel) {
	const thinking = new Discord.Attachment(`assets/thinking.gif`, `thinking.gif`)
	channel.send(thinking);
}

function getSisterClan(channel) {
	channel.send("Join our ally clan for newer players!\nhttps://discord.gg/VEA9xqG");
}

function getAbbreviations(channel) {
	channel.send("https://www.reddit.com/r/TapTitans2/wiki/abbreviations")
}

module.exports = {
	getJustDoItGif: getJustDoItGif,
	getThinkingGif: getThinkingGif,
  getSisterClan: getSisterClan,
	getAbbreviations: getAbbreviations
}
