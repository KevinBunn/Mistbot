const Discord = require("discord.js");
const config = require("../config/config.json");

/**
 * Importing models.
 */
const Help = require("../model/Help");


function generateEmbedFields (embed, helpObj) {
  for (let i = 0; i < helpObj.length; i++) {
    if (helpObj[i].postfix == null)
      embed.addField(`${helpObj[i].title}`, `${helpObj[i].description}`);
    else
      embed.addField(`${helpObj[i].title} ${helpObj[i].postfix}`, `${helpObj[i].description}`);
  }
}

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
		.addField("Raid", `${help.getRaidCommandList()}`)
		.addField("Applicants", `${help.getApplicantsCommandList()}`)
		.addField("Tournament", `${help.getTournamentCommandList()}`)
		.addField("Miscellaneous", `${help.getMiscellaneousCommandList()}`)
		.setColor(0x00AE86)
		.setFooter("Mistbot | Help");
		channel.send({embed});
	}
	else if (category.toLowerCase() === "set"
			|| category.toLowerCase() === "setup"
        	|| category.toLowerCase() === "spreadsheet") {
        const setupObj = help.getObjSetup();
        const embed = new Discord.RichEmbed()
            .setTitle("ℹ️ Mistbot Help Setup")
            .setDescription("Settings that are specific to each guild")
            .setColor(0x00AE86)
            .setFooter("Mistbot | Help - Set Up");
        generateEmbedFields(embed, setupObj);
        channel.send({embed});
	}
	else if (category.toLowerCase() === "statistics"
		  || category.toLowerCase() === "stats") {
		const statsObj = help.getObjStatistics();
		const embed = new Discord.RichEmbed()
		.setTitle("ℹ️ Mistbot Help Statistics")
		.setDescription("Queries for Clan Statistics")
		.setColor(0x00AE86)
		.setFooter("Mistbot | Help - Statistics");
    generateEmbedFields(embed, statsObj);
		channel.send({embed});
	}
	else if (category.toLowerCase() === "miscellaneous"
		  || category.toLowerCase() === "misc") {
		const miscObj = help.getObjMiscellaneous();
		const embed = new Discord.RichEmbed()
		.setTitle("ℹ️ Mistbot Help Miscellaneous")
		.setDescription("Random Gifs, Pics, ect.")
		.setColor(0x00AE86)
		.setFooter("Mistbot | Help - Miscellaneous");
    generateEmbedFields(embed, miscObj);
		channel.send({embed});
	}
	else if (category.toLowerCase() === "raid"
    || category.toLowerCase() === "timer" ) {
		const raidObj = help.getObjRaid();
    const embed = new Discord.RichEmbed()
      .setTitle("ℹ️ Mistbot Help Raid")
      .setDescription("Timer for raids")
      .setColor(0x00AE86)
      .setFooter("Mistbot | Help - Raid");
    generateEmbedFields(embed, raidObj);
    channel.send({embed});
	}
  else if (category.toLowerCase() === "applicants"
		|| category.toLowerCase() === "apply") {
    const applicantsObj = help.getObjApplicants();
    const embed = new Discord.RichEmbed()
      .setTitle("ℹ️ Mistbot Help Applicants")
      .setDescription("View and edit the clan wait list")
      .setColor(0x00AE86)
      .setFooter("Mistbot | Help - Applicants");
    generateEmbedFields(embed, applicantsObj);
    channel.send({embed});
  }
  else if (category.toLowerCase() === "Tournament".toLowerCase()
    || category.toLowerCase() === "Tour".toLowerCase()) {
    const tourObj = help.getObjTournament();
    const embed = new Discord.RichEmbed()
      .setTitle("ℹ️ FishBot Help Tournament")
      .setDescription("Queries for Tournament Information")
      .setColor(0x00AE86)
      .setFooter("FishBot | Help - Tournament");
    generateEmbedFields(embed, tourObj);
    channel.send({embed});
  }
}

module.exports = {
	getHelp: getHelp
}
