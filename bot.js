const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config/config.json");
const _ = require("lodash")

/**
 * Importing Helpers.
 */
const splitString = require("./helper/splitString");

/**
 * Importing commands.
 */
const statsCommand = require("./command/statsCommands");
const helpCommands = require("./command/helpCommands");
const applicantCommands = require('./command/applicantCommands');
const timerCommands = require('./command/timerCommands');
const tournamentCommands = require('./command/tournamentCommands');

// Fun commands.
const miscCommands = require("./command/miscCommands");
/**
 * Listen for when bot is ready.
 */
client.on("ready", () => {
	console.log("I am ready!");
});

function sendMissingTimerError (channel) {
	channel.send('Please specify a time.')
}

function sendMissingCycleError (channel) {
	channel.send('Please specify a cycle.')
}

// Create an event listener for messages
client.on("message", message => {
	try {
		let splitContent = splitString(message.content);
		if (!message.content.toLowerCase().startsWith(config.prefix) || message.author.bot) {
		} else if (splitContent[0].toLowerCase() === `${config.prefix}setspreadsheet`) {
			if (splitContent[1] !== undefined)
				statsCommand.setSpreadsheetId(message.channel, message.guild.id, splitContent[1]);
			else
				message.channel.send("Please specify a spreadsheet id.");
		} else if (splitContent[0].toLowerCase() === `${config.prefix}apply`) {
			applicantCommands.addApplicant(message.channel, message.guild.id, message.author, splitContent)
		} else if (splitContent[0] === `${config.prefix}applicants`) {
			applicantCommands.getApplicants(message.channel, message.guild.id, splitContent)
		} else if (splitContent[0].toLowerCase() === `${config.prefix}removeapplicant`) {
			if (splitContent[1] !== undefined || splitContent[2]) {
				const memberName = splitContent[2];
				message.guild.members.find((member) => {
					if (member.displayName.toLowerCase() === memberName.toLowerCase()) {
						applicantCommands.removeApplicantFromClan(message.channel, message.member, message.guild.id, member, splitContent);
					}
				});
			} else {
				message.channel.send("Please specify a clan and a user");
			}
		} else if (message.content.toLowerCase() === `${config.prefix}justdoit`) {
			miscCommands.getJustDoItGif(message.channel);
		} else if (message.content.toLowerCase() === `${config.prefix}whatdoesthatmean`) {
			miscCommands.getAbbreviations(message.channel);
		} else if (message.content.toLowerCase() === `${config.prefix}dance`) {
			miscCommands.getDanceGif(message.channel);
		} else if (message.content.toLowerCase() === `${config.prefix}wok`) {
			miscCommands.getSisterClan(message.channel);
		} else if (message.content.toLowerCase() === `${config.prefix}joinwok`) {
			let clanChannel = client.channels.find('id','679116561578983424')
			applicantCommands.joinWok(message.member, clanChannel);
		} else if (message.content.toLowerCase() === `${config.prefix}thinking`) {
			miscCommands.getThinkingGif(message.channel);
		} else if (splitContent[0].toLowerCase() === (`${config.prefix}help`)) {
			helpCommands.getHelp(message.channel, splitContent[1]);
		} else if (splitContent[0].toLowerCase() === `${config.prefix}stats`) {
			if (splitContent[1] !== undefined) {
				if (!_.isEmpty(message.mentions.users)) {
					// find by id
					let userId = message.mentions.users.first().id
					message.guild.members.find((member) => {
						if (member.id === userId) {
							statsCommand.getStats(message.channel, "Mistborns", member.displayName, member);
						}
					});
				}
				else {
					message.channel.send('Please @ mention another user')
				}
			}
			else {
				message.guild.fetchMember(message.author)
					.then(member => {
						// THIS IS TEMPORARY UNTIL WE CAN GET BOTH CLANS IN
            if (member.roles.find('name', 'Wrath of Khans') && !member.roles.find('name', 'Mistborns')) {
            	message.channel.send("Right now the bot only supports members in Mistborns, we are currently working on Wraths of Khans support.")
						} else {
              // TODO: Implement logic for handling alts. Now only handling first clan tag found, preferring Mistborns.
              // let clanName = member.roles.includes(e => e.name = "Mistborns") ? "Mistborns" : "Wrath of Khans";
              statsCommand.getStats(message.channel, "Mistborns", member.displayName, member);
						}
					});
			}
		} else if (splitContent[0].toLowerCase() === `${config.prefix}top`) {
			// TODO: check if fix works.
			// let clanName = message.author.roles.find("name", "Mistborns") ? "Mistborns" : "Wrath of Khans";
			statsCommand.getTopStats(message.channel, "Mistborns")
		} else if (splitContent[0].toLowerCase() === `${config.prefix}raid`) {
			if (splitContent[1] === `start`) {
				if (splitContent[2] === null) {
					sendMissingTimerError(message.channel.error)
				} else {
					timerCommands.startRaidTimer(message.channel, splitContent[2])
				}
			} else if (splitContent[1] === 'update') {
				if (splitContent[2] === undefined) {
					sendMissingTimerError(message.channel)
				} else if (splitContent[3] === undefined) {
					sendMissingCycleError(message.channel)
				} else {
					timerCommands.startMidRaidTimer(message.channel, splitContent[2], splitContent[3])
				}
			} else if (splitContent[1] === 'end') {
				timerCommands.stopTimer(message.channel)
			}
		} else if (splitContent[0].toLowerCase() === `${config.prefix}tournament`) {
			switch (splitContent[1]) {
				case 'list':
					tournamentCommands.getTournamentList(message.channel);
					break;
				default:
					tournamentCommands.getTournament(message.channel);
					break;
			}

			//If Wrath ends up being closed reg, will need to change logic to choose which clan to reruit to.
		} else if (splitContent[0].toLowerCase() === `${config.prefix}recruit`) {
      let clanChannel;
      let validClan = false;
      if (splitContent[1] === "mistborns") {
        clanChannel = client.channels.find('id', '428585515252711434')
        validClan = true
      }
			else if (splitContent[1] === "wok") {
        clanChannel = client.channels.find('id', '679116561578983424')
        validClan = true
      }

			if (!_.isEmpty(message.mentions.users) && validClan) {
				// find by id
				let userId = message.mentions.users.first().id
				message.guild.members.find((member) => {
					if (member.id === userId) {
						applicantCommands.recruitApplicant(message.channel, clanChannel, message.member, message.guild.id, member, splitContent);
					}
				});
			}
			else {
				message.channel.send('Please specify a valid clan and @ mention another user')
			}
		}
		else if (message.content.toLowerCase().startsWith(config.prefix)) {
			message.channel.send(`Sorry I don't recognize that command. Type **${config.prefix}help** for the list of available commands.`)
		}
	} catch (error) {
		console.log(error);
		message.channel.send('Sorry! An error occurred!');
	}
});

client.login(config.token);

