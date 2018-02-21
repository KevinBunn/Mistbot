require('es6-promise').polyfill();
require('isomorphic-fetch');
const numeral = require('numeral');
const Discord = require("discord.js");
const config = require("../config/config.json");

const firebase = require("../config/firebaseConfig");
const database = firebase.database;
const clanRef = database.ref(config.clanCode);

/**
 * Importing models.
 */
const Members = require("../model/Members");
const Member = require("../model/Member");

/**
 * Importing helper functions.
 */
const clanInfo = require("../helper/getClanInfo");



function getPoints(channel, memberName) {
}

module.exports = {
	getPoints: getPoints
}