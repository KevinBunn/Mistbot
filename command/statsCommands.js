require('es6-promise').polyfill();
const numeral = require('numeral');
const Discord = require("discord.js");

/**
 * Importing Firebase.
 */
// const firebase = require("../config/firebaseConfig");
// const database = firebase.database;
// const guildSpreadsheetRef = database.ref("discord_server_to_sheet_id_map");

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
// function getWeekRangeForSunday() {
// 	let startDate = new Date();
// 	let endDate = new Date();
// 	let currentDate = new Date();
//
// 	 if (currentDate.getDay() === 0) {
// 		startDate.setDate(currentDate.getDate() - 7);
// 		endDate = currentDate;
// 	 } else {
// 		startDate.setDate(currentDate.getDate() - currentDate.getDay());
// 		endDate.setDate(startDate.getDate() + 7);
// 	}
//
// 	return `${startDate.getMonth()+1}/${startDate.getDate()}/${startDate.getFullYear()} - ${endDate.getMonth()+1}/${endDate.getDate()}/${endDate.getFullYear()}`;
// }

function assignRoles(skillsData, maxStageData, ticketsData, petLevelsData, tournamentData, role, clanTag, guild) {
  const topRoles = guild.roles.filter(role => {
    return role.name === "Rioter"
      || role.name === "Lurcher"
      || role.name === "Coin Shot"
      || role.name === "Thug"
      || role.name === "Seeker"
      || role.name === "Soother"
  })
  const lurcherRole = topRoles.find(role => role.name === "Lurcher")
  const coinShotRole = topRoles.find(role => role.name === "Coin Shot")
  const seekerRole = topRoles.find(role => role.name === "Seeker")
  const sootherRole = topRoles.find(role => role.name === "Soother")
  const rioterRole = topRoles.find(role => role.name === "Rioter")
  let membersWithTopRoles = guild.members.filter(member => {
    // filter by mistborn role
    return member.roles.find("name", role);
  }).filter(member => {
    // then by if they have the role
    return member.roles.find("name", "Rioter")
      || member.roles.find("name", "Lurcher")
      || member.roles.find("name", "Coin Shot")
      || member.roles.find("name", "Thug")
      || member.roles.find("name", "Seeker")
      || member.roles.find("name", "Soother");
  })
  membersWithTopRoles.forEach(member => {
    // remove all of the roles
    console.log(`removing from ${member.displayName}`)
    member.removeRoles(topRoles)
  })

  skillsData.forEach(playerInfo => {
    console.log(playerInfo)
    let nameWithoutClantag = playerInfo.replace(clanTag, '').trim()
    guild.members.find(member => {
      if (member.displayName === nameWithoutClantag) {
        //Lurcher
        console.log(`adding Lurcher to ${member.displayName}`)
        member.addRole(lurcherRole)
      }
    })
  })
  maxStageData.forEach(playerInfo => {
    let nameWithoutClantag = playerInfo.replace(clanTag, '').trim()
    guild.members.find(member => {
      if (member.displayName === nameWithoutClantag) {
        // Coin Shot
        console.log(`adding Coin shot to ${member.displayName}`)
        member.addRole(coinShotRole)
      }
    })
  })
  ticketsData.forEach(playerInfo => {
    let nameWithoutClantag = playerInfo.replace(clanTag, '').trim()
    guild.members.find(member => {
      if (member.displayName === nameWithoutClantag) {
        // Seeker
        console.log(`adding Seeker to ${member.displayName}`)
        member.addRole(seekerRole)
      }
    })
  })
  petLevelsData.forEach(playerInfo => {
    let nameWithoutClantag = playerInfo.replace(clanTag, '').trim()
    guild.members.find(member => {
      if (member.displayName === nameWithoutClantag) {
        // Soother
        console.log(`adding soother to ${member.displayName}`)
        member.addRole(sootherRole)
      }
    })
  })
  tournamentData.forEach(playerInfo => {
    let nameWithoutClantag = playerInfo.replace(clanTag, '').trim()
    guild.members.find(member => {
      if (member.displayName === nameWithoutClantag) {
        // Rioter
        console.log(`adding Rioter to ${member.displayName}`)
        member.addRole(rioterRole)
      }
    })
  })
}

/**
 * Sends top total damage dealers to the given discord channel, according
 * to the content that was passed in.
 *
 * @param {Channel} channel - The discord channel to send message to
 * @param {String} role - discord member's role
 * @param {String} guild - discord guild
 */
function getTopStats (channel, role, guild) {
  clanInfo.getMembersInfo(role).then((data) => {
  	// get all the members who qualify
  	const topSkillData = data.members.getTopIncreasedByStat('skillPoints')
		const topMaxStageData = data.members.getTopIncreasedByStat('maxStage')
		const topTicketsData = data.members.getTopIncreasedByStat('tickets')
		const topPetLevelsData = data.members.getTopIncreasedByStat('petLevels')
		const topTournamentData = data.members.getTopIncreasedByStat('tournamentPoints')
		// Start constructing the embed
		const embed = new Discord.RichEmbed()
			.setTitle('These are the members with the most gains')
			.setAuthor(`📊 Weekly Statistics Report`)
			.setColor(0x00AE86)
			.setTimestamp()

    if (role === "wok") {
      role = "Wrath of Khans"
    }
    assignRoles(topSkillData[0], topMaxStageData[0], topTicketsData[0], topPetLevelsData[0], topTournamentData[0], role, data.clanTag, guild)
		// Put in the fields, data[0] are members, data[1] is the max value returned
		embed.addField('Stages Increased', `${topMaxStageData[0]} - ${topMaxStageData[1]}`)
    embed.addField('Skill Points Earned', `${topSkillData[0]} - ${topSkillData[1]}`)
    embed.addField('Tickets Collected', `${topTicketsData[0]} - ${topTicketsData[1]}`)
    embed.addField('Pet Levels Increased', `${topPetLevelsData[0]} - ${topPetLevelsData[1]}`)
    embed.addField('Tournament Points Gained', `${topTournamentData[0]} - ${topTournamentData[1]}`)
    channel.send({embed});
  })

}

/**
 * Sends top participating members in the clan to the given discord channel,
 * according to the number passed in.
 *
 * @param {Channel} channel - The discord channel to send message to
 * @param {Integer} - number passed in from message.content
 */
// function getTopParticipation(channel, guild_id, number) {
//   clanInfo.getMembersInfo(channel, guild_id).then((data) => {
// 		if (number <= 20 && number > 0) {
// 			const topParticipating = data.getTopParticipation(number);
// 			const embed = new Discord.RichEmbed()
// 			.setAuthor(`Top ${number} members - Participation`)
// 			.setColor(0x00AE86);
// 			for (let i = 0; i < topParticipating.length; i++) {
// 				const memberName = topParticipating[i].name;
// 				const memberParticipation = topParticipating[i].CQParticipation;
// 				embed.addField(`${i + 1}. ${memberName}`, `\t${memberParticipation}%`, true);
// 			}
//
// 			channel.send({embed});
// 		}
// 		else {
// 			channel.send("Please specify a number between 1 and 20");
// 		}
// 	})
// 	.catch((error) => {
//         handleStatsError(channel, error);
//   });
// }

/**
 * Sends the user their personal stats to a given discord channel.
 *
 * @param {Channel} channel - The discord channel to send message to
 * @param {String} role - discord member's role
 * @param {string} nickname - The name of the user that sent the message.
 */
async function getStats(channel, role, nickname, discordMember) {
  clanInfo.getMembersInfo(role)
    .then((data) => {
      const member = data.members.findByName(nickname, data.clanTag)
      if (!member) {
        channel.send("Could not find you in the clan, does your name match?");
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
            .addField('Tournament Points', `${member.tournamentPoints}`, true)
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
            .addField('Max Stage', `+ ${member.maxStage - member.maxStageLW}`, true)
            .addField('Tickets Earned', `+ ${member.tickets - member.ticketsLW}`, true)
            .addField('Skill Points', `+ ${member.skillPoints - member.skillPointsLW}`, true)
            .addField('Pet Levels', `+ ${member.petLevels - member.petLevelsLW}`, true)
            .addField('Tournament Points', `+ ${member.tournamentPoints - member.tournamentPointsLW}`, true)
            .addField('Raid Level', `+ ${member.raidLevel - member.raidLevelLW}`, true)
            .addField('Average Hit Damage', `${numeral(member.avgHitLW).format('0.00')}K`, true)
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

module.exports = {
	getTopStats: getTopStats,
	getStats: getStats,
  // getTopParticipation: getTopParticipation,
}
