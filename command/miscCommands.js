const Discord = require("discord.js");

function getJustDoItGif(channel) {
	const justdoit = new Discord.Attachment(`assets/justdoit.gif`, `justdoit.gif`)
	channel.send(justdoit);
}
function getThinkingGif(channel) {
	const thinking = new Discord.Attachment(`assets/thinking.gif`, `thinking.gif`)
	channel.send(thinking);
}

function getMistwraithCode(channel) {
	channel.send("Mistwraith Clan Code: 3krx2");
}

function getAbbreviations(channel) {
	channel.send("https://www.reddit.com/r/TapTitans2/wiki/abbreviations")
}

module.exports = {
	getJustDoItGif: getJustDoItGif,
	getThinkingGif: getThinkingGif,
	getMistwraithCode: getMistwraithCode,
	getAbbreviations: getAbbreviations
}