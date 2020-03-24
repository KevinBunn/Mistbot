const firebase = require("../config/firebaseConfig");
const database = firebase.database;
const guildSettingsRef = database.ref("clan_settings");
require('es6-promise').polyfill();

function valid(channel, author, args) {
    if ((args[1] === "mistborns") && (author.roles.find('name', 'Mistborn Master') || author.roles.find('name', 'Mistborn Grand Master') ||
        author.roles.find('name,', 'Bot Dev'))) {
        return true;
    } else if ((args[1] === "wok") && (author.roles.find('name', 'WoK Master') || author.roles.find('name', 'WoK Grand Master') ||
        author.roles.find('name', 'Bot Dev'))) {
        return true;
    } else {
        channel.send("You do not have permission to alter clan settings.");
        return false;
    }
}

async function set_prop(channel, author, args) {
    if (valid(channel, author, args)) {
        let clanRef = await getClanRef(args[1], channel);
        let prop;
        let bool = true;
        let isPass = false

        if (args[2] == "public") {
            prop = "is_public";
        } else if (args[2] == "full") {
            prop = "is_full";
        } else if (args[2] == "pass") {
            prop = "passcode";
            isPass = false;
        } else if (args[2] == "requirement") {
            prop = "requirement";
            bool = false;
        }

        if (bool && args[3] != "true" && args[3] != "false") {
            channel.send("true or false please.");
        } else if (isPass && !(/^\d{4}$/.test(args[3]))) {
            channel.send("please enter 4 digit passcode.")
        } else if (!bool && !(/^[0-9]*$/.test(args[3]))) {
          channel.send("please enter a valid stage requirement. ex: 30000")
        } else {
            clanRef.update ({
                [prop] : args[3]
            });
            channel.send(`${prop} has been updated.`)
        }

    }
}

function getClanRef(clanName, channel) {
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

module.exports = {
    set_prop: set_prop
}
