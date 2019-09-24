require('es6-promise').polyfill();
const numeral = require('numeral');
const Discord = require("discord.js");

/**
 * Importing Firebase.
 */
const firebase = require("../config/firebaseConfig");
const database = firebase.database;
const guildSpreadsheetRef = database.ref("discord_server_to_sheet_id_map");

/**
 * Importing helper functions.
 */
const clanInfo = require("../helper/getClanInfo");

/**
 * Calculates the current week range from sunday to sunday.
 * For example, 1/14/2018 to 1/21/2018.
 *
 * @return {String} - a string containing the weekrange.
 */
function getWeekRangeForSunday() {
	let startDate = new Date();
	let endDate = new Date();
	let currentDate = new Date();

	 if (currentDate.getDay() === 0) {
		startDate.setDate(currentDate.getDate() - 7);
		endDate = currentDate;
	 } else {
		startDate.setDate(currentDate.getDate() - currentDate.getDay());
		endDate.setDate(startDate.getDate() + 7);
	}

	return `${startDate.getMonth()+1}/${startDate.getDate()}/${startDate.getFullYear()} - ${endDate.getMonth()+1}/${endDate.getDate()}/${endDate.getFullYear()}`;
}

/**
 * Sends weekly stats to the given discord channel.
 *
 * @param {Channel} channel - The discord channel to send message to
 */
function getWeeklyStats(channel, guild_id) {
	Promise.all([clanInfo.getMembersInfo(channel, guild_id)])
	.then((data) => {
		const dateRange = getWeekRangeForSunday();
		const hitman = data[0].getHitman();

		const embed = new Discord.RichEmbed()
			.setTitle(`${dateRange}`)
			.setAuthor(`📊 Weekly Statistics Report`)
			.setColor(0x00AE86)
			.setDescription(
				`**Hitman** - ${hitman.stat}% of Titanlords hit\n` +
				`${hitman.names.join(", ")}\n`
			)
			.setTimestamp();

		channel.send({embed});
	})
	.catch((error) => {
    handleStatsError(channel, error);
  });
}

/**
 * Sends top total damage dealers to the given discord channel, according
 * to the content that was passed in.
 *
 * @param {Channel} channel - The discord channel to send message to
 * @param {Integer} - number passed in from message.content
 */
function getTopDamage(channel, guild_id, number) {
	clanInfo.getMembersInfo(channel, guild_id).then((data) => {
		if (number <= 20 && number > 0) {
			const topDamageMembers = data.getTopDamage(number);
			const embed = new Discord.RichEmbed()
			.setAuthor(`Top ${number} members - Total Damage`)
			.setColor(0x00AE86);
			for (let i = 0; i < topDamageMembers.length; i++) {
				const memberName = topDamageMembers[i].name;
				const memberTotal = numeral(topDamageMembers[i].totalDamage).format('0,0');
				embed.addField(`${i + 1}. ${memberName}`, `\t${memberTotal}M`, true);
			}

			channel.send({embed});
		}
		else {
			channel.send("Please specify a number between 1 and 20");
		}
	})
	.catch((error) => {
        handleStatsError(channel, error);
  });
}

/**
 * Sends top participating members in the clan to the given discord channel,
 * according to the number passed in.
 *
 * @param {Channel} channel - The discord channel to send message to
 * @param {Integer} - number passed in from message.content
 */
function getTopParticipation(channel, guild_id, number) {
  clanInfo.getMembersInfo(channel, guild_id).then((data) => {
		if (number <= 20 && number > 0) {
			const topParticipating = data.getTopParticipation(number);
			const embed = new Discord.RichEmbed()
			.setAuthor(`Top ${number} members - Participation`)
			.setColor(0x00AE86);
			for (let i = 0; i < topParticipating.length; i++) {
				const memberName = topParticipating[i].name;
				const memberParticipation = topParticipating[i].CQParticipation;
				embed.addField(`${i + 1}. ${memberName}`, `\t${memberParticipation}%`, true);
			}

			channel.send({embed});
		}
		else {
			channel.send("Please specify a number between 1 and 20");
		}
	})
	.catch((error) => {
        handleStatsError(channel, error);
  });
}

/**
 * Sends the user their personal stats to a given discord channel.
 *
 * @param {Channel} channel - The discord channel to send message to
 * @param {string} nickname - The name of the user that sent the message.
 */
async function getStats(channel, guild_id, nickname, discordMember) {
	Promise.all([clanInfo.getMembersInfo(channel, guild_id)])
	.then((data) => {
		const member = data[0].findByName(nickname)
		if(!member) {
			channel.send("Sorry, not a clan member");
		}
		else {
		  // just separating these into promises so that it separates the embeds correctly.
      // I had issues otherwise trying to send two.
			let promiseWeeklyStats = new Promise(function (resolve, reject) {
        const embed = new Discord.RichEmbed()
          .setAuthor(`${member.name}'s Weekly Stats`, `${discordMember.user.displayAvatarURL}`)
          .setColor(0x00AE86)
          .setDescription('Conclusion of last two raids, updated weekly')
					.addField('Role', `${member.role}`, true)
					.addField('Max Stage', `${member.maxStage}`, true)
          .addField('Tickets Earned', `${member.tickets}`, true)
          .addField('Skill Points', `${member.skillPoints}`, true)
          .addField('Pet Levels', `${member.petLevels}`, true)
          .addField('Crafting Shards Spent', `${member.craftingShards}`, true)
          .addField('Hero Masteries', `${member.heroMasteries}`, true)
          .addField('Raid Level', `${member.raidLevel}`, true)
          .addField('Raid Card Level', `${member.raidCardLevel}`, true)
          .addField('Raid Rank', `${member.weeklyRank}`, true)
          .addField('Total Damage', `${numeral(member.weeklyDmg).format('0.00')}M`, true)
          .addField('Average Hit Damage', `${numeral(member.weeklyAvgHit).format('0.00')}K`, true)
				resolve(embed)
			})
			let promiseLifeTimeStats = new Promise(function (resolve, reject) {
        const embed = new Discord.RichEmbed()
      		.setAuthor(`${member.name}'s Stats Last Week`, `${discordMember.user.displayAvatarURL}`)
          .setColor(0x00AE86)
          .setDescription('How much have you improved?')
          .addField('Max Stage', `+ ${member.maxStage - member.lastWeekMaxStage}`, true)
          .addField('Tickets Earned', `+ ${member.tickets - member.lastWeekTickets}`, true)
          .addField('Pet Levels', `+ ${member.petLevels - member.lastWeekPetLevels}`, true)
          .addField('Raid Level', `+ ${member.raidLevel - member.lastWeekRaidLevel}`, true)
          .addField('Total Damage', `${numeral(member.lastWeekDmg).format('0.00')}M`, true)
          .addField('Average Hit Damage', `${numeral(member.lastWeekAvgHit).format('0.00')}K`, true)
				resolve(embed)
			})

			promiseWeeklyStats.then((embed) => {
        channel.send({embed});
			})
			promiseLifeTimeStats.then((embed) => {
        channel.send({embed});
			})
		}
  })
	.catch((error) => {
    	handleStatsError(channel, error);
  });
}

function handleStatsError(channel, error) {
    channel.send(`${error}`);
    if (error.toString() === "TypeError: Cannot read property 'map' of undefined"
		|| error.toString() === "TypeError: Cannot read property 'length' of undefined")
    	channel.send("Suggestion: does your spreadsheet have link sharing turned on?");
}

function setSpreadsheetId(channel, guild_id, spreadsheetId) {
  let guildKey = guildSpreadsheetRef.child(guild_id);
  guildKey.set(spreadsheetId, (error) => {
    if (error) {
      throw error;
    } else {
      channel.send(`Successfully set spreadsheet id as ${spreadsheetId}`);
    }
  });
}

module.exports = {
	getWeeklyStats: getWeeklyStats,
	getTopDamage: getTopDamage,
	getStats: getStats,
  getTopParticipation: getTopParticipation,
  setSpreadsheetId: setSpreadsheetId,
}
