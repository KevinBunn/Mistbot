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
 * Channel ID to post reminders in
 */
const touryReminderChannel = "739860488434745406";
const touryReminderRole = "739860845600833676";

/**
 * This function handles determine which message to send
 * @param {any} client Discord Client object
 */
function sendReminderNotice(client) {
    tournamentRef.once('value')
    .then((snapshot) => {
        const data = snapshot.val();

        let rewardCounter = (data["reward_counter"]) % rewards.length;
        let typeCounter = (data["type_counter"]) % types.length;

        let timeRemaining = "";
        let baseText = "";
        let embedDescription = "";
        let sendNotification = false;

        let channel = client.channels.get(touryReminderChannel);

        if (isTournamentOn()) {
            timeRemaining = getCurrentTournamentTimeLeft();
            baseText = "**Join Reminder**";

            let timeLeftString = `${timeRemaining.minutes} Minutes ${timeRemaining.seconds} Seconds`;

            if (timeRemaining.hours > 0)
                timeLeftString = `${timeRemaining.hours} Hours ` + timeLeftString;

            embedDescription = `**Time Remaining to join**: ${timeLeftString}\n`;
            sendNotification = true;
            //Minus 1 on both in order to pull past toury information
            rewardCounter = (((data["reward_counter"] != 0) ? data["reward_counter"] : rewards.length) - 1) % rewards.length;
            typeCounter = (((data["type_counter"] != 0) ? data["type_counter"] : types.length) - 1) % types.length;
        } else {
            const currentDate = new Date();
            let tempDate = new Date();

            if (tempDate.getUTCDay() >= 3) {
                tempDate.setUTCDate(tempDate.getUTCDate() + (7 - tempDate.getUTCDay()));
            } else {
                // Next tournament has to be wednesday.
                tempDate.setUTCDate(tempDate.getUTCDate() + (3 - tempDate.getUTCDay()));
            }

            if ((new Date()).getUTCDay() === tempDate.getUTCDay() - 1) {
                tempDate.setUTCHours(0);
                tempDate.setUTCMinutes(0);
                tempDate.setUTCSeconds(0);
                tempDate.setUTCMilliseconds(0);

                timeRemaining = getTimeDifference(currentDate, tempDate);
                baseText = "**Upcoming Tournament**";

                let timeString = `${timeRemaining.minutes} Minutes ${timeRemaining.seconds} Seconds`;

                if (timeRemaining.hours > 0)
                    timeString = `${timeRemaining.hours} Hours ` + timeString;

                embedDescription = `**Time Remaining until you can join**: ${timestring}\n`;
                sendNotification = true;
            }
        }

        if (sendNotification) {
            const embed = new Discord.RichEmbed()
                .setTitle(`**Tournament Info**`)
                .setThumbnail(`${typeImages[typeCounter]}.png`)
                .setColor(0x00AE86)
                .setDescription(`**Type**: ${types[typeCounter]}\n` +
                    `**Reward**: ${rewards[rewardCounter]}\n` + embedDescription);

            channel.send(`<@&${touryReminderRole}>: ` + baseText, embed);
        }
    })
}

/**
 * This function handles giving or revoking a users access to the tournament reminder channel
 * @param {any} chnl Channel the command was sent in
 * @param {any} mbr Member who ran the command
 * @param {any} guild Guild the command was ran in
 */
async function setReminderRole(chnl, mbr, guild) {
    let role = guild.roles.get(touryReminderRole);

    if (mbr.roles.get(roleID) === undefined) {
        await mbr.addRole(role);
        chnl.send(`I have given you access to the <#${touryReminderChannel}> channel.`);
    } else {
        await mbr.removeRole(role);
        chnl.send(`I have revoked your access to the <#${touryReminderChannel}> channel.`);
    }
}


/**
 * Cron job for tournament start notices
 *
 * We are notifying for and hour before the tournament starts and an hour after
 */
function startReminderTimer(client) {
    schedule.scheduleJob('0 23 * * 0,2,3,6', () => sendReminderNotice(client));
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
    startReminderTimer: startReminderTimer,
    setReminderRole: setReminderRole
}
