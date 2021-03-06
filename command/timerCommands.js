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
  const seconds = moment(time, 'HH:mm:ss').seconds();
  currentTimerMessage = channel.send('Setting timer for ' + time);
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
        if (Math.floor(timeUntilRaid) - (earlyNotifyOffset * 60 * 1000) === 0) {
          if (cycleCount === 1) {
            channel.send('@everyone Raid starts in **' + timeUntilRaid.asMinutes() + ' minutes!**');
          } else {
            channel.send('@everyone Cycle ' + cycleCount + ' up in **' + timeUntilRaid.asMinutes() + ' minutes!**');
          }
        }
        else if (Math.floor(timeUntilRaid) === 0) {
          if (cycleCount === 1) {
            channel.send('@everyone Raid is up!');
          } else {
            channel.send('@everyone Cycle ' + cycleCount + ' is up!');
          }
          cycleCount += 1;
          timeUntilRaid.add(INTERVAL_HOURS, 'hours')
        }
      }, 60 * 1000); // Check every minute
    }
    catch(e) {
      console.log('Error during the interval loop')
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
      console.log('Error trying to restart timer')
      console.error(err)
    })
    try {
      clearInterval(timerInterval);
    } catch(e) {
      console.error(e)
    }
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
      console.log('Error trying to end timer')
      console.error(err)
    })
    channel.send('Raid Timer Stopped');
    try {
      clearInterval(timerInterval);
    } catch(e) {
      console.error(e)
    }

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
