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
		message.content = message.content.toLowerCase()
		let splitContent = splitString(message.content);
		if (!message.content.startsWith(config.prefix) || message.author.bot) {
    	} else if (splitContent[0] === `${config.prefix}setspreadsheet`) {
      if (splitContent[1] !== undefined)
        statsCommand.setSpreadsheetId(message.channel, message.guild.id, splitContent[1]);
      else
        message.channel.send("Please specify a spreadsheet id.");
    } else if (splitContent[0] === `${config.prefix}apply`) {
			applicantCommands.addApplicant(message.channel, message.guild.id, message.author, splitContent)
    } else if (message.content === `${config.prefix}applicants`) {
			applicantCommands.getApplicants(message.channel, message.guild.id)
    } else if (splitContent[0] === `${config.prefix}removeapplicant`) {
      if (splitContent[1] !== undefined) {
        const memberName = splitContent[1];
        message.guild.members.find((member) => {
          if (member.displayName.toLowerCase() === memberName.toLowerCase()) {
            applicantCommands.removeApplicant(message.channel, message.member, message.guild.id, member);
          }
        });
      } else {
        message.channel.send("Please specify a user");
      }
		} else if (message.content === `${config.prefix}justdoit`) {
			miscCommands.getJustDoItGif(message.channel);
		} else if (message.content === `${config.prefix}whatdoesthatmean`) {
			miscCommands.getAbbreviations(message.channel);
		//} else if (message.content === `${config.prefix}sister_clan`) {
		//	miscCommands.getMistwraithCode(message.channel);
		} else if (message.content === `${config.prefix}thinking`) {
			miscCommands.getThinkingGif(message.channel);
		} else if (splitContent[0] === (`${config.prefix}help`)) {
            helpCommands.getHelp(message.channel, splitContent[1]);
		} else if (splitContent[0] === `${config.prefix}stats`) {
			if (splitContent[1] !== undefined) {
				console.log(_.isEmpty(message.mentions.users))
				if (!_.isEmpty(message.mentions.users)) {
					// find by id
          let userId = message.mentions.users.first().id
          message.guild.members.find((member) => {
            if (member.id === userId) {
              statsCommand.getStats(message.channel, message.guild.id, member.displayName, member);
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
					statsCommand.getStats(message.channel, message.guild.id, member.displayName, member);
				});
			}
		} else if (splitContent[0] === `${config.prefix}top`) {
			statsCommand.getTopStats(message.channel, message.guild.id)
		} else if (splitContent[0] === `${config.prefix}raid`) {
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
		} else if (splitContent[0] === `${config.prefix}tournament`) {
			switch (splitContent[1]) {
				case 'list':
					tournamentCommands.getTournamentList(message.channel);
					break;
				default:
					tournamentCommands.getTournament(message.channel);
					break;
			}
		} else if (splitContent[0] === `${config.prefix}recruit`) {
      // let clanChannel = client.channels.find('id','428585515252711434')
      let clanChannel = client.channels.find('id','391394106292830208')
      if (splitContent[1] !== undefined) {
        const memberName = splitContent[1];
        message.guild.members.find((member) => {
          if (member.displayName.toLowerCase() === memberName.toLowerCase()) {
            applicantCommands.recruitApplicant(clanChannel, message.member, message.guild.id, member);
          }
        });
      } else {
        message.channel.send("Please specify a user");
      }
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

