const Discord = require("discord.js");
const schedule = require('node-schedule');

/**
 * Importing Firebase.
 */
const firebase = require("../config/firebaseConfig");
const database = firebase.database;
const tournamentRef = database.ref("tournament");

/**
 * Importing Helpers.
 *
 */
const getTimeDifference = require("../helper/getTimeDifference");

/**
 * List of tournament types.
 */
const types = [
	"There is no bonus during this tournament.",
	"All heroes do 5x damage.",
	"All melee heroes do 8x damage.",
	"All ranged heroes do 8x damage.",
	"All spell heroes do 8x damage.",
	"Your taps will do 5x damage.",
	"You will regenerate +4 mana per minute.",
	"Your mana capacity will be increased by 200.",
	"You will have 100% chance of receiving double fairy rewards.",
	"Your critical hit chance will increase 40%.",
];

/**
 * List of tournament rewards.
 */
const rewards = [
	"Shards + Pets",
	"Weapon Upgrades + Fortune",
	"Skill Points + Perks"
]

// 0 for Sunday, 3 for Wednesday
const tournamentUTCDays = [0, 3];

/**
 * Sends current tournament information to the given discord channel.
 *
 * @param {Channel} channel - The discord channel to send message to.
 */
function getCurrentTournament(channel) {
	tournamentRef.once('value')
	.then((snapshot) => {
		if (isTournamentOn()) {
			const data = snapshot.val();
			const rewardCounter = data["rewardCounter"];
			const typeCounter = data["typeCounter"]
			const timeRemaining = getCurrentTournamentTimeLeft();
			const embed = new Discord.RichEmbed()
			.setTitle(`**There is a tournament currently going on. Go go go!**\n`)
			.setDescription(
				`**Type**: ${types[typeCounter]}\n` +
				`**Reward**: ${rewards[rewardCounter]}\n` +
				`**Time Remaining to join**: ${timeRemaining.days} Days ${timeRemaining.hours} Hours ${timeRemaining.minutes} Minutes ${timeRemaining.seconds} Seconds\n`
			);
			channel.send({embed});
		} else {
			const embed = new Discord.RichEmbed()
			.setTitle(`No tournament is currently going on.\n`)
			.setDescription(
				`Use **!next_tour** to ask about the next tournament.\n`
			);
			channel.send({embed});
		}
	})
}

/**
 * Sends next tournament information to the given discord channel.
 *
 * @param {Channel} channel - The discord channel to send message to.
 */
function getNextTournament(channel) {
	tournamentRef.once('value')
	.then((snapshot) => {
		const currentDate = new Date();
		let nextDate = new Date();
		// Next tournament has to be sunday.
		if (currentDate.getUTCDay() >= 3) {
			nextDate.setUTCDate(currentDate.getUTCDate() + (7 - currentDate.getUTCDay()));
		} else {
			// Next tournament has to be wednesday.
			nextDate.setUTCDate(currentDate.getUTCDate() + (3 - currentDate.getUTCDay()));
		}
		nextDate.setUTCHours(0);
		nextDate.setUTCMinutes(0);
		nextDate.setUTCSeconds(0);
		nextDate.setUTCMilliseconds(0);

		const data = snapshot.val();
		const rewardCounter = (data["rewardCounter"] + 1) % rewards.length;
		const typeCounter = (data["typeCounter"] + 1) % types.length;
		const timeRemaining = getTimeDifference(currentDate, nextDate);
		const embed = new Discord.RichEmbed()
		.setTitle(`**Next tournament**`)
		.setDescription(
			`**Type**: ${types[typeCounter]}\n` +
			`**Reward**: ${rewards[rewardCounter]}\n` +
			`**Time Remaining until you can join**: ${timeRemaining.days} Days ${timeRemaining.hours} Hours ${timeRemaining.minutes} Minutes ${timeRemaining.seconds} Seconds\n`
		);
		channel.send({embed});
	});
}

/**
 * Returns whether or not there is currently a tournament going on.
 */
function isTournamentOn() {
	const currentDate = new Date();
	return tournamentUTCDays.indexOf(currentDate.getUTCDay()) > -1;
}

/**
 * Returns the time left for the current tournament.
 */
function getCurrentTournamentTimeLeft() {
	const currentDate = new Date();
	const endDate = new Date();
	endDate.setUTCDate(currentDate.getUTCDate() + 1);
	endDate.setUTCHours(0);
	endDate.setUTCMinutes(0);
	endDate.setUTCSeconds(0);
	endDate.setUTCMilliseconds(0);
	return getTimeDifference(endDate, currentDate);
}



/**
 * Cron job that updates the counters in firebase.
 *
 * IMPORTANT NOTE:
 * Tournament occurs every Wednesday and Sunday at 12:00 AM UTC.
 * However, Cronjob uses system time.
 * Please convert to your own system time (if not using UTC), so it updates correctly.
 */
const counterUpdate = schedule.scheduleJob('0 0 * * 0,3', function(){
	tournamentRef.once('value')
	.then((snapshot) => {
		const data = snapshot.val();
		const typeCounter = data["typeCounter"];
		const rewardCounter = data["rewardCounter"];

		tournamentRef.set({
			typeCounter: (typeCounter + 1) % types.length,
			rewardCounter: (rewardCounter + 1) % rewards.length
		});
		console.log('counter has been updated');
	});
});

module.exports = {
	getCurrentTournament: getCurrentTournament,
	getNextTournament: getNextTournament,
}