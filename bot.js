require('es6-promise').polyfill();
require('isomorphic-fetch');
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config/config.json");

/**
 * Importing models.
 */
const Members = require("./model/Members");
const Member = require("./model/Member");
const ClanQuestMember = require("./model/ClanQuestMember");
const ClanQuestMembers = require("./model/ClanQuestMembers");

/**
 * Importing commands.
 */
const weeklyStatsCommand = require("./command/weeklyStatsCommands");
const tournamentCommands = require("./command/tournamentCommands");

/**
 * Listen for when bot is ready.
 */
client.on("ready", () => {
	console.log("I am ready!");
});

// Create an event listener for messages
client.on("message", message => {
	try {
		if (!message.content.startsWith(config.prefix) || message.author.bot) {
			return;
		} else if (message.content === "!weekly_stats") {
			weeklyStatsCommand.getWeeklyStatsCommand(message.channel);
		} else if (message.content === "!curr_tour") {
			tournamentCommands.getCurrentTournament(message.channel);
		} else if (message.content === "!next_tour") {
			tournamentCommands.getNextTournament(message.channel);
		}
	} catch (error) {
		message.channel.send('Sorry! An error occurred!');
	}
});



client.login(config.token);