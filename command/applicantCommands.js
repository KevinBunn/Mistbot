require('es6-promise').polyfill();
const Discord = require("discord.js");
const _ = require("lodash")

/**
 * Importing Firebase.
 */

const firebase = require("../config/firebaseConfig");
const database = firebase.database;
const guildApplicantRef = database.ref("server_applicants");
const guildSettingsRef = database.ref("clan_settings");

const Applicant = require('../model/Applicant')


function getClanSettingsRef(clanName, channel) {
  return guildSettingsRef.once("value")
    .then((snapshot) => {
      if (snapshot.hasChild(clanName)) {
        return guildSettingsRef.child(clanName)
      } else {
        throw "No clan found for " + clanName
      }
    }).catch(err => {
      channel.send(err)
    });
}

async function addApplicant(channel, guildId, author, args) {
  let clanSettingsRef = await getClanSettingsRef(args[1], channel)
  let settings = await clanSettingsRef.once("value").then(snapshot => {
    return snapshot.val()
  })
  if (args[1] === "mistborns" && parseInt(args[2]) < settings.requirements) {
    channel.send('Looks like your Max Stage is below Mistborn requirements (' + settings.requirements + '), you can try applying to Wrath of Khans for newer players.')
  }
  else if (args[1] === "wok" && parseInt(args[2]) < settings.requirements) {
    channel.send('Looks like your Max Stage is below Wrath of Khans requirements, come back when you have reached ' + settings.requirements)
  }
  else {
    let guildRef = guildApplicantRef.child(guildId);
    let clanRef = await getClanRef(guildRef, args[1], channel)
    let promise = getWaitingListSpot(clanRef);
    let waitListNumber = 0
    await promise.then((number) => {
      waitListNumber = number
    })
    clanRef.once("value", function(snapshot) {
      if(snapshot.hasChild(`${author.id}`)) {
        let existingApplicant = snapshot.child(`${author.id}`)
        let applicantRef = clanRef.child(`${author.id}`);
        applicantRef.set({
          name: existingApplicant.val()["name"],
          max_stage: args[2],
          raid_damage: args[3],
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
        let newApplicantRef = clanRef.child(`${author.id}`);
        newApplicantRef.set({
          name: `${author.username}`,
          max_stage: args[2],
          raid_damage: args[3],
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
}

async function getApplicants(channel, guildId, args) {
  let guildRef = guildApplicantRef.child(guildId);
  let clanRef = await getClanRef(guildRef, args[1], channel)
  let applicantList = []
  let promises = []
  promises.push(clanRef.once("value")
    .then((snapshot) => {
    snapshot.forEach((child) => {
      if (child.val() === '') {
        // do nothing
      } else {
        let applicant = new Applicant();
        applicant.name = child.val()["name"]
        applicant.timeApplied = child.val()["time_applied"]
        applicant.maxStage = child.val()["max_stage"]
        applicant.raidDamage = child.val()["raid_damage"]
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
        const applicantRaidDamage = applicantList[i].raidDamage;
        embed.addField(`${i + 1}. ${applicantName}`,
          `Max Stage: ${applicantMaxStage}
         Raid Damage: ${applicantRaidDamage}`);
      }
      embed.setTimestamp()
      channel.send({embed});
    }
  })
}

async function removeApplicantFromClan(channel, author, guildId, user, args) {
  if (args[1] === "mistborns" && (author.roles.find('name', 'Mistborn Master') || author.roles.find('name', 'Mistborn Grand Master'))
    || args[1] === "wok" && (author.roles.find('name', 'WoK Master') || author.roles.find('name', 'WoK Grand Master')) ) {
    removeApplicant(channel, guildId, args, user)
      .then(function () {
        channel.send(`Removed ${user.displayName} from waiting list`)
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message)
      });
  } else {
    channel.send('You do not have permissions to remove applicants')
  }
}

function getWaitingListSpot(clanRef) {
  return clanRef.once("value")
    .then((snapshot) => {
      return snapshot.numChildren()
    });
}
function getClanRef(guildRef, clanName, channel) {
  return guildRef.once("value")
    .then((snapshot) => {
      if (snapshot.hasChild(clanName)) {
        return guildRef.child(clanName)
      } else {
        throw "No clan found for " + clanName
      }
    }).catch(err => {
      channel.send(err)
    });
}

async function removeApplicant (channel, guildId, args, user) {
  let guildRef = guildApplicantRef.child(guildId);
  let clanRef = await getClanRef(guildRef, args[1], channel)
  return clanRef.once("value")
    .then((snapshot) => {
      if (snapshot.hasChild(`${user.id}`)) {
        return clanRef.child(user.id).remove()
      }
    });
}

async function recruitApplicant(channel, clanChannel, author, guildId, user, args) {
  let clanSettingsRef = await getClanSettingsRef(args[1], channel)
  let settings = await clanSettingsRef.once("value").then(snapshot => {
    return snapshot.val()
  })
  if (args[1] === "mistborns") {
    if(author.roles.find('name', 'Mistborn Master') || author.roles.find('name', 'Mistborn Grand Master')) {
      await removeApplicant(channel, guildId, args, user)
      // message user clan code and passcode
      user.send('You have been recruited to Mistborns! Here are the Clan Credentials.\n' + 'Code: gg8e6\n' + (settings.is_public ? "Clan is Public" : `Pass: ${settings.passcode}`))
      // add role to user
      user.addRole('679188640999538708')
      user.addRole('368984671100600321').then(() => {
        clanChannel.send(`Welcome to Mistborns <@${user.id}>!\n` +
          `When you have the time, please look over the following:\n` +
          `**1.** Make sure your discord nickname matches your IGN.\n` +
          `**2.** Please read the clan <#392936605905846274>.\n` +
          `**3.** Review our <#620279426852061186> so you are ready for the next raid.\n` +
          `**4.** Let us know if you have any questions!`)
      })
    } else{
      channel.send('You do not have permissions to recruit applicants for Mistborns')
    }
  } else if (args[1] === "wok") {
    if(author.roles.find('name', 'WoK Master') || author.roles.find('name', 'WoK Grand Master')) {
      await removeApplicant(channel, guildId, args, user)
      // message user clan code and passcode
      user.send('You have been recruited to Wrath of Khans! Here are the Clan Credentials.\n' + 'Code: nmm94\n' + 'Pass: ' + (settings.is_public ? "Clan is Public" : `Pass: ${settings.passcode}`))
      // add role to user
      user.addRole('679115153199071262')
      user.addRole('679191376386326528').then(() => {
        clanChannel.send(`Welcome to Wrath of Khans <@${user.id}>!\n` +
          `When you have the time, please look over the following:\n` +
          `**1.** Make sure your discord nickname matches your IGN.\n` +
          `**2.** Please read the clan <#679118612010762250>.\n` +
          `**3.** Review our <#620279426852061186> so you are ready for the next raid.\n` +
          `**4.** Let us know if you have any questions!`);
      })
    } else{
      channel.send('You do not have permissions to recruit applicants for Wrath of Khans')
    }
  }
}

// Not Used anymore since there is a clan requirement now for WoK
function joinWok(member, clanChannel) {
  member.addRole('679191376386326528')
  member.addRole('679115153199071262').then(() => {
    clanChannel.send(`Welcome to Wrath of Khans <@${member.id}>!\n` +
      `When you have the time, please look over the following:\n` +
      `**1.** Make sure your discord nickname matches your IGN.\n` +
      `**2.** Please read the clan <#679118612010762250>.\n` +
      `**3.** Review our <#620279426852061186> so you are ready for the next raid.\n` +
      `**4.** Let us know if you have any questions!`);
  })
}

module.exports = {
  addApplicant: addApplicant,
  getApplicants: getApplicants,
  removeApplicantFromClan: removeApplicantFromClan,
  recruitApplicant: recruitApplicant,
  joinWok: joinWok
}
