const Discord = require("discord.js");
const config = require("../config/config.json");

/**
 * Importing models.
 */
const Help = require("../model/Help");

/**
 * Displays information about all the commands for the bot
 *
 * @param {Channel} channel - The discord channel to send message to
 * @param {String} category - identifies which section of commands user wants displayed
 */
function getHelp(channel, category) {
	const help = new Help();
	if (category == null) { // default help response
		const embed = new Discord.RichEmbed()
		.setTitle("ℹ️ Mistbot Help")
		.setDescription(`prefix: ${config.prefix}\ntype "${config.prefix}[command]" to use a command\ntype "${config.prefix}help [category]" for description and usage\n\tex: ${config.prefix}help Statistics`)
		.addField("Setup", `${help.getSetupCommandList()}`)
		.addField("Statistics", `${help.getStatisticsCommandList()}`)
		.addField("Miscellaneous", `${help.getMiscellaneousCommandList()}`)
		.setColor(0x00AE86)
		.setFooter("Mistbot | Help");
		channel.send({embed});
	}
	else if (category.toLowerCase() == "Set".toLowerCase()
			|| category.toLowerCase() == "Setup".toLowerCase()
        	|| category.toLowerCase() == "spreadsheet".toLowerCase()) {
        setupObj = help.getObjSetup();
        const embed = new Discord.RichEmbed()
            .setTitle("ℹ️ Mistbot Help Setup")
            .setDescription("Settings that are specific to each guild")
            .setColor(0x00AE86)
            .setFooter("Mistbot | Help - Set Up");
        for (let i = 0; i < setupObj.length; i++) {
            if (setupObj[i].postfix == null)
                embed.addField(`${setupObj[i].title}`, `${setupObj[i].description}`)
            else
                embed.addField(`${setupObj[i].title} ${setupObj[i].postfix}`, `${setupObj[i].description}`)
        }
        channel.send({embed});
	}

	else if (category.toLowerCase() == "Statistics".toLowerCase()
		  || category.toLowerCase() == "Stats".toLowerCase()) {
		statsObj = help.getObjStatistics();
		const embed = new Discord.RichEmbed()
		.setTitle("ℹ️ Mistbot Help Statistics")
		.setDescription("Queries for Clan Statistics")
		.setColor(0x00AE86)
		.setFooter("Mistbot | Help - Statistics");
		for (let i = 0; i < statsObj.length; i++) {
			if (statsObj[i].postfix == null)
				embed.addField(`${statsObj[i].title}`, `${statsObj[i].description}`)
			else
				embed.addField(`${statsObj[i].title} ${statsObj[i].postfix}`, `${statsObj[i].description}`)
		}
		channel.send({embed});
	}
	else if (category.toLowerCase() == "Miscellaneous".toLowerCase()
		  || category.toLowerCase() == "Misc".toLowerCase()) {
		miscObj = help.getObjMiscellaneous();
		const embed = new Discord.RichEmbed()
		.setTitle("ℹ️ Mistbot Help Miscellaneous")
		.setDescription("Random Gifs, Pics, ect.")
		.setColor(0x00AE86)
		.setFooter("Mistbot | Help - Miscellaneous");
		for (let i = 0; i < miscObj.length; i++) {
			if (miscObj[i].postfix == null)
				embed.addField(`${miscObj[i].title}`, `${miscObj[i].description}`)
			else
				embed.addField(`${miscObj[i].title} ${miscObj[i].postfix}`, `${miscObj[i].description}`)
		}
		channel.send({embed});
	}
}

module.exports = {
	getHelp: getHelp
}
