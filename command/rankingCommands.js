require('es6-promise').polyfill();
const numeral = require('numeral');
const Discord = require("discord.js");

//Import helper functions

const clanInfo = require("../helper/getClanInfo");

function getStatRankings (stat, channel, role) {
    clanInfo.getMembersInfo(role).then((data) => {
        //get sorted rankings.
        const rankings = data.members.getSortedRankings(stat);

        //Construct first embed:
        //Use promises to seperate embeds if more than 25 members.
        let promiseFirstEmbed = new Promise(function (resolve, reject) {
            let embed = new Discord.RichEmbed()
                .setTitle(`${stat} of players in descending order.`)
                .setAuthor(`📊 ${role} ${stat} Rankings`)
                .setColor(0x00AE86)
                .setTimestamp()

            let max = rankings[0].length > 25 ? 25 : rankings[0].length;
            for (let i = 0; i < max; i++) {
                embed.addField(`${i+1}.`, `${rankings[0][i]} - ${rankings[1][i]}`);
            }
            resolve(embed);
        });
        promiseFirstEmbed.then((embed) => channel.send({embed}));


        if (rankings[0].length > 25) {
            let promiseSecondEmbed = new Promise (function (resolve, reject) {
                let embed = new Discord.RichEmbed()
                    .setTitle(`${stat} of players in descending order.`)
                    .setAuthor(`📊 ${role} ${stat} Rankings`)
                    .setColor(0x00AE86)
                    .setTimestamp()

                for (let i = 25; i < rankings[0].length; i++) {
                    embed.addField(`${i+1}.`, `${rankings[0][i]} - ${rankings[1][i]}`);
                }
                resolve(embed);
            });

            promiseSecondEmbed.then((embed) => channel.send({embed}));
        }



    })
}

module.exports = {
    getStatRankings : getStatRankings
}