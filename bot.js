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
const statsCommand = require("./command/statsCommands");
const helpCommands = require("./command/helpCommands");
const tournamentCommands = require("./command/tournamentCommands");
// Fun commands.
const miscCommands = require("./command/miscCommands");

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
		} else if (message.content === `${config.prefix}weekly_stats`) {
			statsCommand.getWeeklyStats(message.channel);
		} else if (message.content === `${config.prefix}top_ten_damage`) {
			statsCommand.getTopTenTotalDamage(message.channel);
		}else if (message.content === `${config.prefix}curr_tour`) {
			tournamentCommands.getCurrentTournament(message.channel);
		} else if (message.content === `${config.prefix}next_tour`) {
			tournamentCommands.getNextTournament(message.channel);
		} else if (message.content === `${config.prefix}just_do_it`) {
			miscCommands.getJustDoItGif(message.channel);
		} else if (message.content === `${config.prefix}help`) {
			helpCommands.getHelp(message.channel, config.prefix);
		}
	} catch (error) {
		message.channel.send('Sorry! An error occurred!');
	}
});

client.login(config.token);