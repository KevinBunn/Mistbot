const Discord = require("discord.js");
const schedule = require('node-schedule');
const moment = require('moment');

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
  "x10 gold from bosses.",
  "x3 Warlord Boost",
  "Regenerate +5 additional mana per minute.",
  "Probability type bonuses will increase by x1.2.",
  "x3 Sorcerer Boost.",
  "x10 Chesterson Gold.",
  "+100% Multiple Fairy Chance.",
  "x3 Knight Boost.",
  "+20% Mana Refund",
  "x1.5 Relics Earned"
];
const typeImages = [
  "https://imgur.com/uv7BKXI",
  "https://imgur.com/n5JyjTO",
  "https://imgur.com/fEa9g3L",
  "https://imgur.com/yKqd3N3",
  "https://imgur.com/Qy4zoJH",
  "https://imgur.com/oZxC2wi",
  "https://imgur.com/wfAjCrL",
  "https://imgur.com/P0RJJtM",
  "https://imgur.com/GSCdePe",
  "https://imgur.com/Y37GGny"
];

/**
 * List of tournament rewards.
 */
const rewards = [
  "Shards + Eggs",
  "Hero Weapons",
  "Skill Points + Perks"
];

// 0 for Sunday, 3 for Wednesday
const tournamentUTCDays = [0, 3];

/**
 * Sends current tournament information to the given discord channel.
 *
 * @param {Channel} channel - The discord channel to send message to.
 */
function getTournament(channel) {
  tournamentRef.once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      if (isTournamentOn()) {
        const rewardCounter = data["reward_counter"];
        const typeCounter = data["type_counter"]
        console.log(typeCounter)
        const timeRemaining = getCurrentTournamentTimeLeft();
        const embed = new Discord.RichEmbed()
          .setTitle(`**Current Tournament**\n`)
          .setThumbnail(`${typeImages[typeCounter - 1]}.png`)
          .setColor(0x00AE86)
          .setDescription(
            `**Type**: ${types[typeCounter - 1]}\n` +
            `**Reward**: ${rewards[rewardCounter - 1]}\n` +
            `**Time Remaining to join**: ${timeRemaining.days} Days ${timeRemaining.hours} Hours ${timeRemaining.minutes} Minutes ${timeRemaining.seconds} Seconds\n`
          );
        channel.send({embed});
      } else {
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

        const rewardCounter = (data["reward_counter"]) % rewards.length;
        const typeCounter = (data["type_counter"]) % types.length;
        const timeRemaining = getTimeDifference(currentDate, nextDate);
        //const file = new Discord.Attachment(`assets/artifacts/${typeImages[typeCounter]}.png`);
        const embed = new Discord.RichEmbed()
          .setTitle(`**Next Tournament**`)
          //.attachFile(`assets/artifacts/${typeImages[typeCounter]}.png`)
          .setThumbnail(`${typeImages[typeCounter]}.png`)
          .setColor(0x00AE86)
          .setDescription(
            `**Type**: ${types[typeCounter]}\n` +
            `**Reward**: ${rewards[rewardCounter]}\n` +
            `**Time Remaining until you can join**: ${timeRemaining.days} Days ${timeRemaining.hours} Hours ${timeRemaining.minutes} Minutes ${timeRemaining.seconds} Seconds\n`
          );
        channel.send(embed);
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
      const rewardCounter = (data["reward_counter"]) % rewards.length;
      const typeCounter = (data["type_counter"]) % types.length;
      const timeRemaining = getTimeDifference(currentDate, nextDate);
      //const file = new Discord.Attachment(`assets/artifacts/${typeImages[typeCounter]}.png`);
      const embed = new Discord.RichEmbed()
        .setTitle(`**Next tournament**`)
        //.attachFile(`assets/artifacts/${typeImages[typeCounter]}.png`)
        .setThumbnail(`${typeImages[typeCounter]}.png`)
        .setColor(0x00AE86)
        .setDescription(
          `**Type**: ${types[typeCounter]}\n` +
          `**Reward**: ${rewards[rewardCounter]}\n` +
          `**Time Remaining until you can join**: ${timeRemaining.days} Days ${timeRemaining.hours} Hours ${timeRemaining.minutes} Minutes ${timeRemaining.seconds} Seconds\n`
        );
      channel.send(embed);
    });
}

function addTournamentListFields(embed, count, typeCounter, rewardCounter, dateList) {
  return new Promise((resolve) => {
    // let options = {weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC'};
    resolve(embed.addField(
      '====================',
      `**Type**: ${types[typeCounter] }\n` +
      `**Reward**: ${rewards[rewardCounter]}\n` +
      `**Start Date**: ${moment(dateList[count]).tz('UTC').format('dddd, MMMM Do')}\n`
    ));
  });
}

async function getTournamentList(channel) {
  tournamentRef.once('value')
    .then(async (snapshot) => {
      const currentDate = new Date();
      let dateList = [];
      let tempDate = currentDate;
      tempDate.setUTCHours(0);
      tempDate.setUTCMinutes(0);
      tempDate.setUTCSeconds(0);
      tempDate.setUTCMilliseconds(0);
      for (let i = 0; i < 5; i++) {
        let newDate = new Date();
        if (tempDate.getUTCDay() >= 3) {
          tempDate.setUTCDate(tempDate.getUTCDate() + (7 - tempDate.getUTCDay()))
          newDate = tempDate
        } else {
          // Next tournament has to be wednesday.
          tempDate.setUTCDate(tempDate.getUTCDate() + (3 - tempDate.getUTCDay()));
          newDate = tempDate;
        }
        dateList.push(new Date(tempDate));
      }
      const data = snapshot.val();
      const embed = new Discord.RichEmbed()
        .setTitle(`**Upcoming Tournaments**`)
        .setThumbnail(`https://imgur.com/BVWaCOr.png`)
        .setColor(0x00AE86)
      for (let i = 0; i < dateList.length; i++) {
        const rewardCounter = (data["reward_counter"] + i) % rewards.length;
        const typeCounter = (data["type_counter"] + i) % types.length;
        await addTournamentListFields(embed, i, typeCounter, rewardCounter, dateList)
      }
      embed.addField('====================', '** **')
      channel.send(embed);
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
      const typeCounter = data["type_counter"];
      const rewardCounter = data["reward_counter"];

      tournamentRef.set({
        type_counter: (typeCounter + 1) % types.length,
        reward_counter: (rewardCounter + 1) % rewards.length
      });
      console.log('counter has been updated');
    });
});

module.exports = {
  getTournament: getTournament,
  getTournamentList: getTournamentList,
}