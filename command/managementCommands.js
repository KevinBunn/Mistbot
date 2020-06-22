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
        } else if (args[2] == "open") {
            prop = "spots_open";
            bool = false;
        }


        if (bool && args[3] != "true" && args[3] != "false") {
            channel.send("true or false please.");
        } else if (isPass && !(/^\d{4}$/.test(args[3]))) {
            channel.send("please enter 4 digit passcode.")
        } else if (!bool && !(/^[0-9]*$/.test(args[3]))) {
            channel.send("please enter a valid stage requirement. ex: 30000")
        } else {
            if (bool) {
                // I want to make sure it doesn't pass in as a string
                clanRef.update ({
                    [prop]: args[3] === "true"
                });
            } else {
                clanRef.update ({
                    [prop] : args[3]
                });
            }
            channel.send(`${prop} has been updated.`)
        }
    }
}

async function kickPlayer(channel, message, args) {
    if (valid(channel, message.member, args)) {
        let clanRef = await getClanRef(args[1], channel);
        let settings = await clanRef.once("value").then(snapshot => {
            return snapshot.val()
        })

        const user = message.mentions.users.first();
        // If we have a user mentioned
        if (user) {
            // Now we get the member from the user
            const member = message.guild.member(user);
            // If the member is in the guild
            if (member) {

                requiredRoleID = ({ 'mistborns': '679188640999538708', 'wok': '679191376386326528' })[args[1]];

                if (member.roles.some(r => r.id === requiredRoleID)) {
                    /**
                     * Kick the member
                     * Make sure you run this on a member, not a user!
                     * There are big differences between a user and a member
                     */
                    msg = `Kicked via Kick Command from ${message.member.displayName} `;
                    member
                        .kick(msg)
                        .then(() => {
                            props = new Array("spots_open");
                            if (settings["is_full"]) {
                                clanRef.update({
                                    "is_full": false
                                });
                                props.push("is_full");
                            }

                            clanRef.update({
                                "spots_open": parseInt(settings.spots_open) + 1
                            });

                            props = props.join(' ,');
                            msg = `successfully kicked ${user.displayName} and ${props} has been updated.`
                            // We let the message author know we were able to kick the person
                            message.reply(msg);
                        })
                        .catch(err => {
                            // An error happened
                            // This is generally due to the bot not being able to kick the member,
                            // either due to missing permissions or role hierarchy
                            msg = `I was unable to kick the ${member.displayName}`
                            message.reply(msg);
                            // Log the error
                            console.error(err);
                        });
                } else {
                    role = message.guild.roles.filter(r => r.id === requiredRoleID).first();
                    msg = `${member.displayName} does not seem to be in ${role.name}.`
                    // The mentioned user isn't in this guild
                    message.reply(msg);
                }
            } else {
                // The mentioned user isn't in this guild
                message.reply("that user isn't in this server!");
            }
            // Otherwise, if no user was mentioned
        } else {
            message.reply("you didn't mention the user to kick!");
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
    set_prop: set_prop,
    kickPlayer: kickPlayer
}
