const Discord = require("discord.js");

const moment = require('moment');

const firebase = require("../config/firebaseConfig");
const database = firebase.database;
const raidTimerRef = database.ref("raid_timer");

const INTERVAL_HOURS = 12;
let cycleCount = 1;

let timerInterval = null;
let currentTimerMessage = null;

function updateCurrentTimerMessage(timeUntilRaid) {
  currentTimerMessage.then((msg) => {
    if (cycleCount !== 1) {
      msg.edit(`Time Until Cycle ${cycleCount}:\n\`\`\`${moment.utc(timeUntilRaid.as('milliseconds')).format('HH:mm:ss')}\`\`\``);
    } else {
      msg.edit(`Time Until Raid:\n\`\`\`${moment.utc(timeUntilRaid.as('milliseconds')).format('HH:mm:ss')}\`\`\``);
    }
  }).catch(err => {
    console.error(err)
  })
}

async function startTimer (channel, time) {
  console.log(cycleCount)
  const seconds = moment(time, 'HH:mm:ss').seconds();
  currentTimerMessage = channel.sendMessage('Setting timer for ' + time);
  // wait for the seconds to even out to 0
  let timeUntilRaid = moment.duration(time, 'HH:mm:ss');
  let earlyNotifyOffset = 0;
  setTimeout(function() {
    try {
      timeUntilRaid.subtract(seconds, 'seconds');
      updateCurrentTimerMessage(timeUntilRaid);
      // continue to do that every minute
      timerInterval = setInterval(function () {
        timeUntilRaid.subtract(1, "minute");
        updateCurrentTimerMessage(timeUntilRaid)
        console.log(Math.floor(timeUntilRaid) === 0);
        if (Math.floor(timeUntilRaid) - (earlyNotifyOffset * 60 * 1000) === 0) {
          if (cycleCount === 1) {
            channel.sendMessage('@everyone Raid starts in **' + timeUntilRaid.asMinutes() + ' minutes!**');
          } else {
            channel.sendMessage('@everyone Cycle ' + cycleCount + ' up in **' + timeUntilRaid.asMinutes() + ' minutes!**');
          }
        }
        else if (Math.floor(timeUntilRaid) === 0) {
          if (cycleCount === 1) {
            channel.sendMessage('@everyone Raid is up!');
          } else {
            channel.sendMessage('@everyone Cycle ' + cycleCount + ' is up!');
          }
          cycleCount += 1;
          timeUntilRaid.add(INTERVAL_HOURS, 'hours')
        }
      }, 60 * 1000); // Check every minute
    }
    catch(e) {
      console.error(e)
    }
  }, seconds * 1000)
  await raidTimerRef.once("value", (snapshot) => {
    earlyNotifyOffset = snapshot.child("offset").val()
  }).catch(err => {
    console.error(err)
  });
}

function startMidRaidTimer (channel, time, cycle) {
  if (timerInterval) {
    currentTimerMessage.then((msg) => {
      msg.edit(`\`\`\`Timer Stopped\`\`\``)
    }).catch((err) => {
      console.error(err)
    })
    clearInterval(timerInterval)
  }
  cycleCount = parseInt(cycle) + 1;
  try {
    startTimer(channel, time);
  } catch(e) {
    console.error(e)
  }

}

function stopTimer (channel) {
  if (currentTimerMessage !== null) {
    currentTimerMessage.then((msg) => {
      msg.edit(`\`\`\`Timer Stopped\`\`\``)
    }).catch(err => {
      console.error(err)
    })
    channel.send('Raid Timer Stopped');
    clearInterval(timerInterval);
    console.log(timerInterval);
    timerInterval = null;
    cycleCount = 1;
  } else {
    channel.send('No current raid timer running')
  }
}

function updateOffset () {

}

module.exports = {
  startRaidTimer: startTimer,
  startMidRaidTimer: startMidRaidTimer,
  stopTimer: stopTimer,
  updateOffset : updateOffset()
};
