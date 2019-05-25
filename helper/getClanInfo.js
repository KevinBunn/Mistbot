require('isomorphic-fetch');
const config = require("../config/config.json");

/**
 * Importing Firebase.
 */
const firebase = require("../config/firebaseConfig");
const database = firebase.database;
const guildSpreadsheetRef = database.ref("discord_server_to_sheet_id_map");
/**
 * Importing models.
 */
const Members = require("../model/Members");
const Member = require("../model/Member");

/**
 * Global variables.
 */
const baseGoogleSpreadsheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/";

/**
 * Creates a new <Members> from the google spreadsheet.
 */
function getMembersInfo(channel, guild_id) {
  console.log('creating member info')
	const minRow = 2;
	const minCol = "A";
	const maxCol = "K";
  const maxRow = 51;
  return guildSpreadsheetRef.once('value')
  .then((snapshot) => {
    const spreadSheetId = snapshot.val()[guild_id];
    if (!spreadSheetId) {
      throw new Error("Spreadsheet id has not been set. Set id via set_spreadsheet_id command.");
    }
    return fetch(`${baseGoogleSpreadsheetUrl}${spreadSheetId}/values/EZ Summary!${minCol}${minRow}:${maxCol}${maxRow}?key=${config.googleSpreadsheetApiKey}`)
    .then((response) => response.json())
    .then((data) => {
      const newMembers = new Members();
      const membersInfo = data.values;
      membersInfo.map((memberInfo) => {
        // Checking if the id field is non-empty.
        // console.log(memberInfo[1]);
        if (memberInfo[1] !== undefined) {
          const member = getMemberInfo(memberInfo);
          newMembers.addMember(member);
        }
      });
      return newMembers;
    });
  });
}

/**
 * Creates a <Member> from an array containing member information.
 *
 * @param {Array} memberData - An array containing information about a member.
 * @return {Member} - A <Member> with all of the information.
 */
function getMemberInfo(memberData) {
	return new Member(...memberData);
}

module.exports = {
	getMembersInfo: getMembersInfo,
}
