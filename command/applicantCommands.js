require('es6-promise').polyfill();
const Discord = require("discord.js");
const _ = require("lodash")

/**
 * Importing Firebase.
 */
const firebase = require("../config/firebaseConfig");
const database = firebase.database;
const guildApplicantRef = database.ref("server_applicants");

const Applicant = require('../model/Applicant')

async function addApplicant(channel, guildId, author, args) {
  let guildRef = guildApplicantRef.child(guildId);
  let promise = getWaitingListSpot(guildRef);
  let waitListNumber = 0
  await promise.then((number) => {
    waitListNumber = number
  })
  guildRef.once("value", function(snapshot) {
    if(snapshot.hasChild(`${author.id}`)) {
      let existingApplicant = snapshot.child(`${author.id}`)
      let applicantRef = guildRef.child(`${author.id}`);
      applicantRef.set({
        name: existingApplicant.val()["name"],
        max_stage: args[1],
        raid_level: args[2],
        time_applied: existingApplicant.val()["time_applied"]
      }, function (error) {
        if (error) {
          console.log("Data could not be saved." + error);
          channel.send('Error: Failed to Submit' + error);
        } else {
          console.log("Data saved successfully.");
          channel.send(`Looks like you already applied <@${author.id}>, I've updated your application`)
        }
      })
    } else {
      let newApplicantRef = guildRef.child(`${author.id}`);
      newApplicantRef.set({
        name: `${author.username}`,
        max_stage: args[1],
        raid_level: args[2],
        time_applied: Date.now()
      }, function (error) {
        if (error) {
          console.log("Data could not be saved." + error);
          channel.send('Error: Failed to Submit' + error);
        } else {
          console.log("Data saved successfully.");
          channel.send(`Thank you for applying! you are in spot ${waitListNumber} of the waiting list`)
        }
      })
    }
  })
}

function getApplicants(channel, guildId) {
  let guildRef = guildApplicantRef.child(guildId);
  let applicantList = []
  let promises = []
  promises.push(guildRef.once("value")
    .then((snapshot) => {
    snapshot.forEach((child) => {
      if (child.val() === '') {
        // do nothing
      } else {
        let applicant = new Applicant();
        applicant.name = child.val()["name"]
        applicant.timeApplied = child.val()["time_applied"]
        applicant.maxStage = child.val()["max_stage"]
        applicant.raidLevel = child.val()["raid_level"]
        applicantList.push(applicant)
      }
    });
  }));
  Promise.all(promises).then(() => {
    if (applicantList.length < 1) {
      channel.send('There is currently no one in the wait list')
    } else {
      applicantList = _.orderBy(applicantList, ["timeApplied"], ["acs"])
      const embed = new Discord.RichEmbed()
        .setAuthor(`Current Wait list`)
        .setColor(0x00AE86);
      for (let i = 0; i < applicantList.length; i++) {
        const applicantName = applicantList[i].name;
        const applicantMaxStage = applicantList[i].maxStage;
        const applicantRaidLevel = applicantList[i].raidLevel;
        embed.addField(`${i + 1}. ${applicantName}`,
          `Max Stage: ${applicantMaxStage}
         Raid Level: ${applicantRaidLevel}`);
      }
      embed.setTimestamp()
      channel.send({embed});
    }
  })
}

function removeApplicant(channel, author, guildId, user) {
  if(author.roles.find('name', 'Mistborn Master') || author.roles.find('name', 'Grand Master')) {
    let guildRef = guildApplicantRef.child(guildId);
    guildRef.child(user.id).remove()
      .then(function() {
        channel.send(`Removed ${user.displayName} from waiting list`)
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message)
      });
  } else{
    channel.send('You do not have permissions to remove applicants')
  }
}

function getWaitingListSpot(guildRef) {
  return guildRef.once("value")
    .then((snapshot) => {
      return snapshot.numChildren()
    });
}

module.exports = {
  addApplicant: addApplicant,
  getApplicants: getApplicants,
  removeApplicant: removeApplicant
}
