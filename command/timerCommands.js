require('es6-promise').polyfill();
require('isomorphic-fetch');
const numeral = require('numeral');
const moment = require("moment");
const Discord = require("discord.js");
const config = require("../config/config.json");

/**
 * Importing helper functions.
 */
const flatten = require("../helper/flatten");
const getTimeDifference = require("../helper/getTimeDifference");
/**
 * Global variables.
 */
const baseGoogleSpreadsheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/";
let isCQTimerRunning = false;

function getNextTitanTimer(channel) {
	return fetch(`${baseGoogleSpreadsheetUrl}${config.spreadSheetId}/values/Summary!J55?key=${config.googleSpreadsheetApiKey}`)
	.then((response) => response.json())
	.then((data) => data.values[0])
	.then((maxTitanHit) => {
		const timeStartCol = incrementSpreadsheetColumn("O", maxTitanHit);
		return fetch(`${baseGoogleSpreadsheetUrl}${config.spreadSheetId}/values:batchGet?ranges=Summary!${timeStartCol}54&ranges=Summary!${timeStartCol}55&key=${config.googleSpreadsheetApiKey}`);
	})
	.then((response) => response.json())
	.then((data) => {
		const lastStartTime = moment.utc(data.valueRanges[0].values[0][0], "YYYY-MM-DD HH:mm:ss");
		const duration = parseInt(data.valueRanges[1].values[0][0]);
		const currentTime = moment.utc();
		let nextCQStartTime = lastStartTime.add(6, "hours").add(duration, "seconds");
		const time = getTimeDifference(nextCQStartTime, currentTime);

		if (isCQTimerRunning) {
			const embed = new Discord.RichEmbed()
			.setDescription(
				`A timer has already been set for the next CQ, which is in:\n` +
				`**${time.hours}** Hour(s), **${time.minutes}** Minute(s), **${time.seconds}** Second(s).`
			);
			channel.send({embed})
			return;
		}

		const embed = new Discord.RichEmbed()
		.setDescription(
			`A timer has not been set yet. Use **${config.prefix}set_tl_timer** to set a timer.`
		);
		channel.send({embed})
	});
}

function setNextTitanTimer(channel, author) {
	return fetch(`${baseGoogleSpreadsheetUrl}${config.spreadSheetId}/values/Summary!J55?key=${config.googleSpreadsheetApiKey}`)
	.then((response) => response.json())
	.then((data) => data.values[0])
	.then((maxTitanHit) => {
		const timeStartCol = incrementSpreadsheetColumn("O", maxTitanHit);
		return fetch(`${baseGoogleSpreadsheetUrl}${config.spreadSheetId}/values:batchGet?ranges=Summary!${timeStartCol}54&ranges=Summary!${timeStartCol}55&key=${config.googleSpreadsheetApiKey}`);
	})
	.then((response) => response.json())
	.then((data) => {
		const lastStartTime = moment.utc(data.valueRanges[0].values[0][0], "YYYY-MM-DD HH:mm:ss");
		const duration = parseInt(data.valueRanges[1].values[0][0]);
		const currentTime = moment.utc();
		let nextCQStartTime = lastStartTime.add(6, "hours").add(duration, "seconds");
		const time = getTimeDifference(nextCQStartTime, currentTime);

		if (isCQTimerRunning) {
			const embed = new Discord.RichEmbed()
			.setDescription(
				`A timer has already been set. You can't set another timer until the current timer has expired.\n` +
				`Next CQ is in **${time.hours}** Hour(s), **${time.minutes}** Minute(s), **${time.seconds}** Second(s).`
			);
			channel.send({embed})
			return;
		}

		if (currentTime > nextCQStartTime) {
			const embed = new Discord.RichEmbed()
			.setDescription(
				`Can't set a timer due to invalid data. Please make sure the spreadsheet is updated with the newest CQ.`
			);
			channel.send({embed})
			return;
		}
		const thirtyMinutesWarning = parseInt((nextCQStartTime.clone().subtract(30, "minutes")).diff(currentTime));
		const fiveMinutesWarning = parseInt((nextCQStartTime.clone().subtract(5, "minutes")).diff(currentTime));
		const CQWarning = parseInt(nextCQStartTime.clone().diff(currentTime));

		isCQTimerRunning = true;
		const embed = new Discord.RichEmbed()
		.setDescription(
			`A timer has been set for **${time.hours}** Hour(s), **${time.minutes}** Minute(s), **${time.seconds}** Second(s).\n` +
			`Warnings will be sent at **30 minutes** and **5 minutes** before the Titan Lord is up.`
		)
		channel.send({embed})
		// CQ Started.
		setTimeout(() => {
			isCQTimerRunning = false;
			channel.send(`@everyone there is a Titan Lord up right now! Lets make short work of it. -${author.toString()}`);
		}, CQWarning);

		if (fiveMinutesWarning > 0) {
			// CQ Starts in 5 minutes.
			setTimeout(() => {
				channel.send(`@everyone get your tapping fingers ready! There is a Titan Lord ready in **5 minutes**! -	${author.toString()}`);
			}, fiveMinutesWarning);
		}

		if (thirtyMinutesWarning > 0) {
			// CQ Starts in 30 minutes.
			setTimeout(() => {
				channel.send(`@everyone get your tapping fingers ready! There is a Titan Lord ready in **30 minutes!** -${author.toString()}`);
			}, thirtyMinutesWarning);
		}
	});
}

function incrementSpreadsheetColumn(column, increment){
	let lastChar = column[column.length - 1]

	for (let i = 0; i < increment; i++) {
		if (lastChar < "Z") {
			lastChar = String.fromCharCode(lastChar.charCodeAt(0) + 1)
			column = column.slice(0, -1) + lastChar
		} else {
			const length = column.length;
			column = "";
			for (let j = 0; j < length + 1; j++) {
				column += "A";
			}
			lastChar = "A";
		}
	}
	return column;
}

module.exports = {
	setNextTitanTimer: setNextTitanTimer,
	getNextTitanTimer: getNextTitanTimer,
}


