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
const rankingCommands = require('./command/rankingCommands');
const managementCommands = require('./command/managementCommands');

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


//Retrieve the id of the primary clan of the user. Biased to select Mist over WoK.
function getPrimaryClan (member) {
	let inMist = member.roles.find(role => role.id == '679188640999538708');
	let inWoK = member.roles.find(role => role.id == '679191376386326528');
	if (inMist) {
		return inMist;
	} else if (inWoK) {
		return inWoK;
	} else {
		return null;
	}
}

//TODO: reduce redundancy by creating function for obtaining clan reference.

// Create an event listener for messages
client.on("message", message => {
	try {
		let splitContent = splitString(message.content);
		// if it doesn't start with the command or is from a bot (excluding ClanAssistant)
		if (!message.content.toLowerCase().startsWith(config.prefix) || (message.author.bot && message.author.id !== "718638278391234580")) {

			// Use this if-else to check for connection
		} else if (splitContent[0].toLowerCase() === `${config.prefix}helloworld`) {
			message.channel.send("We are go!");

		} else if (splitContent[0].toLowerCase() === `${config.prefix}gc`) {

			role = getPrimaryClan(message.member);
			message.channel.send(role.name);

		} else if (splitContent[0].toLowerCase() === `${config.prefix}setspreadsheet`) {
			if (splitContent[1] !== undefined)
				statsCommand.setSpreadsheetId(message.channel, message.guild.id, splitContent[1]);
			else
				message.channel.send("Please specify a spreadsheet id.");
		} else if (splitContent[0].toLowerCase() === `${config.prefix}apply`) {
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
			if (!validClan) {
				message.channel.send('Please specify a valid clan')
			} else {
				message.guild.fetchMember(message.author)
					.then(member => {
						applicantCommands.addApplicant(message.channel, clanChannel, message.guild.id, message.author, splitContent, member)
					})
			}
		} else if (splitContent[0] === `${config.prefix}applicants`) {
			applicantCommands.getApplicants(message.channel, message.guild.id, splitContent)
		} else if (splitContent[0].toLowerCase() === `${config.prefix}removeapplicant`) {
			console.log()
			if (splitContent[1] !== undefined && splitContent[2] !== undefined) {
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
		} else if (message.content.toLowerCase() === `${config.prefix}tobattle`) {
			miscCommands.getToBattleGif(message.channel);
		} else if (message.content.toLowerCase() === `${config.prefix}wok`) {
			miscCommands.getSisterClan(message.channel);
		} else if (message.content.toLowerCase() === `${config.prefix}joinwok`) {
			let clanChannel = client.channels.find('id', '679116561578983424')
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
							if (getPrimaryClan(member)) {
								statsCommand.getStats(message.channel, getPrimaryClan(member).name, member.displayName, member);
							} else {
								message.channel.send('Please @ mention a member of a clan.');
							}
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
						// TODO: Implement logic for handling alts. Now only handling first clan tag found, preferring Mistborns.
						if (getPrimaryClan(member)) {
							statsCommand.getStats(message.channel, getPrimaryClan(member).name, member.displayName, member);
						} else {
							message.channel.send('You are not in a recognized clan. No statistics available.');
						}

					});
			}
		} else if (splitContent[0].toLowerCase() === `${config.prefix}top`) {

			let clanName;
			if (splitContent[1] === 'mistborns') {
				clanName = 'Mistborns'
			} else if (splitContent[1] === 'wok') {
				clanName = 'Wrath of Khans'
			}
			else {
				message.channel.send('Please specify a clan')
			}
			statsCommand.getTopStats(message.channel, clanName, message.guild)


		} else if (splitContent[0].toLowerCase() === `${config.prefix}msranking`) {
			//Lists max stage ranking of all players in clan in descending order.

			let clanName;
			if (splitContent[1] === 'mistborns') {
				clanName = 'Mistborns'
			} else if (splitContent[1] === 'wok') {
				clanName = 'Wrath of Khans'
			}
			rankingCommands.getStatRankings('maxStage', message.channel, clanName);

		} else if (splitContent[0].toLowerCase() === `${config.prefix}dmgranking`) {
			let clanName;
			if (splitContent[1] === 'mistborns') {
				clanName = 'Mistborns'
			} else if (splitContent[1] === 'wok') {
				clanName = 'Wrath of Khans'
			}
			rankingCommands.getStatRankings('weeklyAvgHit', message.channel, clanName);

		} else if (splitContent[0].toLowerCase() === `${config.prefix}ranking`) {
			let clanName;
			let statName;
			if (splitContent[1] == undefined || splitContent[2] == undefined) {
				message.channel.send('Command Usage: m!ranking (stat_name) (clan_name)');
			}

			statName = splitContent[1]
			console.log(statName);
			if (splitContent[2] === 'mistborns') {
				clanName = 'Mistborns'
			} else if (splitContent[2] === 'wok') {
				clanName = 'Wrath of Khans'
			}

			rankingCommands.getStatRankings(statName, message.channel, clanName);
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
				case 'reminders':
					tournamentCommands.setReminderRole(message.channel, message.member, message.guild);
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
		} else if (splitContent[0].toLowerCase() === `${config.prefix}clansetup`) {
			managementCommands.set_prop(message.channel, message.member, splitContent);
		} else if (splitContent[0].toLowerCase() === `${config.prefix}kick`) {
			managementCommands.kickPlayer(message.channel, message, splitContent);
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
console.log("printing after log");

//Start Toury Reminder Notification
tournamentCommands.startReminderTimer(client);