require('es6-promise').polyfill();
const numeral = require('numeral');
const Discord = require("discord.js");

//Import helper functions

const clanInfo = require("../helper/getClanInfo");

function getMaxStageRankings (channel, role) {
    clanInfo.getMembersInfo(role).then((data) => {
        //get max stage of each member.
        const rankings = data.members.getMaxStages();

        //Construct first embed:
        //Use promises to seperate embeds if more than 25 members.
        let promiseFirstEmbed = new Promise(function (resolve, reject) {
            let embed = new Discord.RichEmbed()
                .setTitle('Max Stages of players in descending order.')
                .setAuthor(`📊 ${role} Max Stage Rankings`)
                .setColor(0x00AE86)
                .setTimestamp()

            for (let i = 0; i < 25; i++) {
                embed.addField(`${i+1}.`, `${rankings[0][i]} - ${rankings[1][i]}`);
            }
            resolve(embed);
        });
        promiseFirstEmbed.then((embed) => channel.send({embed}));


        console.log(rankings[0].length);
        if (rankings[0].length > 25) {
            let promiseSecondEmbed = new Promise (function (resolve, reject) {
                let embed = new Discord.RichEmbed()
                    .setTitle('Max Stages of players in descending order.')
                    .setAuthor(`📊 ${role} Max Stage Rankings`)
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
    getMaxStageRankings : getMaxStageRankings
}