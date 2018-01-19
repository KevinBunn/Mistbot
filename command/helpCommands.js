const Discord = require("discord.js");
const config = require("../config/config.json");

function getHelp(channel) {
	const embed = new Discord.RichEmbed()
	.setTitle("FishBot Commands")
	.setDescription(`prefix: ${config.prefix}`)
	.addField("weekly_stats", "\tDisplays current clan accolades for the week.")
	.addField("curr_tour", "\tDisplays current tournament that is going on.")
	.addField("next_tour", "\tDisplays when and what the next tournament is.")
	.addField("top_ten_damage", "\tDisplays the top ten total damage dealers.")
	.addField("just_do_it", "\tDisplays the just do it gif.")
	.setColor(0x00AE86)
	.setFooter("FishBot | Help");

	channel.send({embed});
}

module.exports = {
	getHelp: getHelp
}