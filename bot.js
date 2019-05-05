require('es6-promise').polyfill();
require('isomorphic-fetch');
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config/config.json");

/**
 * Importing Helpers.
 */
const splitString = require("./helper/splitString");

/**
 * Importing commands.
 */
const statsCommand = require("./command/statsCommands");
const helpCommands = require("./command/helpCommands");

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
		let splitContent = splitString(message.content);
		if (!message.content.startsWith(config.prefix) || message.author.bot) {
      		return;
    	} else if (splitContent[0] === `${config.prefix}setSpreadsheetId`) {
			if (splitContent[1] !== undefined)
      			statsCommand.setSpreadsheetId(message.channel, message.guild.id, splitContent[1]);
			else
				message.channel.send("Please specify a spreadsheet id.");
		// } else if (message.content === `${config.prefix}weekly_stats`) {
		// 	statsCommand.getWeeklyStats(message.channel, message.guild.id);
		} else if (splitContent[0] === `${config.prefix}topDamage`) {
			statsCommand.getTopDamage(message.channel, message.guild.id, splitContent[1]);
		} else if (splitContent[0] === `${config.prefix}topParticipation`) {
			statsCommand.getTopParticipation(message.channel, message.guild.id, splitContent[1]);
		} else if (message.content === `${config.prefix}just_do_it`) {
			miscCommands.getJustDoItGif(message.channel);
		} else if (message.content === `${config.prefix}whatdoesthatmean`) {
			miscCommands.getAbbreviations(message.channel);
		//} else if (message.content === `${config.prefix}sister_clan`) {
		//	miscCommands.getMistwraithCode(message.channel);
		} else if (message.content === `${config.prefix}thinking`) {
			miscCommands.getThinkingGif(message.channel);
		} else if (splitContent[0] === (`${config.prefix}help`)) {
            helpCommands.getHelp(message.channel, splitContent[1]);
		} else if (message.content === `${config.prefix}myStats`) {
			// first get the GuildMember who typed the message
			message.guild.fetchMember(message.author)
  			.then(member => {
    			statsCommand.getStats(message.channel, message.guild.id, member.displayName, member);
  			});
		} else if (splitContent[0] === `${config.prefix}stats`) {
			if (splitContent[1] !== undefined) {
                const memberName = splitContent[1];
                found = false;
                message.guild.members.find((member) => {
                    if (member.displayName.toLowerCase() === memberName.toLowerCase()) {
                        statsCommand.getStats(message.channel, message.guild.id, memberName, member);
                        found = true;
                        return;
                    }
                });
                if (!found) {
                    message.channel.send(`No one in the server is named '${memberName}'`)
                }
            }
            else
            	message.channel.send("Please specify a clan member");
		}
		else if (message.content.startsWith(config.prefix)) {
			message.channel.send(`Sorry I don't recognize that command. Type **${config.prefix}help** for the list of available commands.`)
		}
	} catch (error) {
    console.log(error);
		message.channel.send('Sorry! An error occurred!');
	}
});

client.login(config.token);

