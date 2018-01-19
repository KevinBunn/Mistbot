require('es6-promise').polyfill();
require('isomorphic-fetch');
const numeral = require('numeral');
const Discord = require("discord.js");
const config = require("../config/config.json");

/**
 * Importing models.
 */
const Members = require("../model/Members");
const Member = require("../model/Member");
const ClanQuestMember = require("../model/ClanQuestMember");
const ClanQuestMembers = require("../model/ClanQuestMembers");

/**
 * Importing helper functions.
 */
const flatten = require("../helper/flatten");
const getFrequentHits = require("../helper/getFrequentHits");
const getHighestConsecutiveHits = require("../helper/getHighestConsecutiveHits");

/**
 * Global variables.
 */
const baseGoogleSpreadsheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/";

/**
 * Creates a new <Members> from the google spreadsheet.
 */
function getMembersInfo() {
	const minRow = 4;
	const maxRow = 53;

	return fetch(`${baseGoogleSpreadsheetUrl}${config.spreadSheetId}/values/Summary!B${minRow}:K${maxRow}?key=${config.googleSpreadsheetApiKey}`)
	.then((response) => response.json())
	.then((data) => {
		const newMembers = new Members();
		const membersInfo = data.values;
		membersInfo.map((memberInfo) => {
			// Checking if the name field is non-empty.
			if (memberInfo[1]) {
				let member = getMemberInfo(memberInfo);
				member.total = parseInt(member.total);
				member.averageDamage = parseFloat(member.averageDamage);
				member.lastWeekAverage = parseFloat(member.lastWeekAverage);
				// Remove % for easier calculations
				member.averageMargin = parseInt(member.averageMargin.replace("%", ""));
				member.MS = parseInt(member.MS);
				member.MSLastWeek = parseInt(member.MSLastWeek);
				member.increase = parseInt(member.increase);
				member.joinedDiscord = member.joinedDiscord === "TRUE" ? true : false;
				newMembers.addMember(member);
			}
		});
		return newMembers;
	});
}

/**
 * Creates a <Member> from an array containing member information.
 *
 * @param {Array} memberData - An array containing information about a member.
 * @return {Member} - A <Member> with all of the information.
 */
function getMemberInfo(memberData) {
	return new Member(...memberData);
}

/**
 * Creates a new <ClanQuestMembers> from the google spreadsheet.
 */
function getClanQuestMembersInfo() {
	const minRow = 4;
	const maxRow = 38;

	return fetch(`${baseGoogleSpreadsheetUrl}${config.spreadSheetId}/values/Summary!Q${minRow}:BO${maxRow}?key=${config.googleSpreadsheetApiKey}&majorDimension=COLUMNS`)
	.then((response) => response.json())
	.then((data) => {
		let newCQMembers = new ClanQuestMembers();
		let CQData = data.values;

		for (let i = 1; i < CQData.length; i++) {
			let CQ = CQData[i];
			if (CQ[0]) {
				const member = getClanQuestMemberInfo(CQ);
				newCQMembers.addMember(member);
			}
		}
		return newCQMembers;
	});
}

/**
 * Creates a <ClanQuestMember> from an array containing member information.
 *
 * @param {Array} memberData - An array containing information about a clan quest member.
 * @return {ClanQuestMember} - A <ClanQuestMember> with all of the information.
 */
function getClanQuestMemberInfo(memberData) {
	// Convert consecutive hits into an array.
	let hits = memberData.slice(1,29);
	let maxNumberOfHits = hits.filter((hit) => (hit !== "")).length;

	hits = hits.map((hit) => {
		if (!hit) {
			hit = 0;
		}
		return parseInt(hit);
	});

	const member = new ClanQuestMember(
		name=memberData[0],
		hits=hits,
		totalDamage=memberData[29],
		averageDamage=memberData[30],
		maxStage=memberData[31],
		joinedDiscord=memberData[32],
		lastWeekAverage=memberData[33],
		lastWeekMS=memberData[34],
		highestConsecutiveHits=getHighestConsecutiveHits(hits),
		frequentHits=getFrequentHits(hits, maxNumberOfHits),
		mostDamageOnOneTitan=Math.max(...hits),
		maxNumberOfHits=maxNumberOfHits
	);
	return member;
}

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
function getWeeklyStats(channel) {
	Promise.all([getMembersInfo(), getClanQuestMembersInfo()])
	.then((data) => {
		const dateRange = getWeekRangeForSunday();
		const inspired = data[0].getInspired();
		const sleepless = data[1].getSleepless();
		const hitman = data[1].getHitman();
		const coinShot = data[0].getCoinShot();
		const thug = data[1].getThug();

		const embed = new Discord.RichEmbed()
			.setTitle("**༺Mistborn Accolades༻**")
			.setAuthor(`📊 Weekly Statistics Report (${dateRange})`)
			.setColor(0x00AE86)
			.setDescription(
				`**Inspired** - ${inspired.stat.toLocaleString()}% average damage increase from last week.\n` +
				`${inspired.names.join(", ")}\n` +
				`**Sleepless** - ${sleepless.stat} Titanlords hit in a row.\n` +
				`${sleepless.names.join(", ")}\n` +
				`**Hitman** - ${hitman.stat}% of Titanlords hit\n` +
				`${hitman.names.join(", ")}\n` +
				`**Coin Shot** - ${coinShot.stat.toLocaleString()} stages advanced since last week.\n` +
				`${coinShot.names.join(", ")}\n` +
				`**Thug** - ${thug.stat.toLocaleString()} damage done to one Titanlord.\n` +
				`${thug.names.join(", ")}\n`
			)
			.setTimestamp();

		channel.send({embed});
	})
	.catch((error) => {throw error});
}


/**
 * Sends top total damage dealers to the given discord channel, according
 * to the content that was passed in.
 *
 * @param {Channel} channel - The discord channel to send message to
 * @param {I dunno... int?} - number passed in from message.content
 */
function getTopDamage(channel, number) {
	Promise.all([getMembersInfo(), getClanQuestMembersInfo()])
	.then((data) => {
		var memberName;
		var memberTotal;
		var newNumeral;
		if (number < 20 && number > 0) {
			const embed = new Discord.RichEmbed()
			.setAuthor(`Top ${number} members - Total Damage`)
			.setColor(0x00AE86);
			for (let i = 0; i < number; i++) {
				memberName = data[0].members[i].name;
				memberTotal = numeral(data[0].members[i].total).format('0,0');
				embed.addField(`${i + 1}. ${memberName}`, `\t${memberTotal}`, true);
			}

			channel.send({embed});
		}
		else {
			channel.send("Please specify a number between 1 and 20");
		}
	})
	.catch((error) => {throw error});
}

/**
 * Sends the user their personal stats to a given discord channel.
 *
 * @param {Channel} channel - The discord channel to send message to
 * @param {string} nickname - The name of the user that sent the message.
 */
function getMyStats(channel, nickname) {
	Promise.all([getMembersInfo(), getClanQuestMembersInfo()])
	.then((data) => {
		if(!data[0].findByName(nickname)) {
			channel.send("Sorry, not a clan member");
		}
		else {
			const embed = new Discord.RichEmbed()
			.setAuthor(`${data[0].findByName(nickname).name}'s Clan Stats`)
			.setColor(0x00AE86)
			.addField("Total Damage", `${data[0].findByName(nickname).total}`)
			.addField("Average Damage", `${data[0].findByName(nickname).averageDamage}`)
			.addField("Last Week Average", `${data[0].findByName(nickname).lastWeekAverage}`)
			.addField("Damage Margin (increase/decrease from last week)", `${data[0].findByName(nickname).averageMargin}%`)
			.addField("Max Stage", `${data[0].findByName(nickname).MS}`)
			channel.send({embed});
		}
	})
}

module.exports = {
	getWeeklyStats: getWeeklyStats,
	getTopDamage: getTopDamage,
	getMyStats: getMyStats
}