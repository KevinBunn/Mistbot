const Discord = require("discord.js");

function getJustDoItGif(channel) {
	const justdoit = new Discord.Attachment(`assets/justdoit.gif`, `justdoit.gif`)
	channel.send(justdoit);
}
function getThinkingGif(channel) {
	const thinking = new Discord.Attachment(`assets/thinking.gif`, `thinking.gif`)
	channel.send(thinking);
}

module.exports = {
	getJustDoItGif: getJustDoItGif,
	getThinkingGif: getThinkingGif
}