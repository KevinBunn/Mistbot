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
const ClanQuestMember = require("../model/ClanQuestMember");
const ClanQuestMembers = require("../model/ClanQuestMembers");

/**
 * Helper variables.
 */
const getHighestConsecutiveHits = require("../helper/getHighestConsecutiveHits");

/**
 * Global variables.
 */
const baseGoogleSpreadsheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/";

/**
 * Creates a new <Members> from the google spreadsheet.
 */
function getMembersInfo(channel, guild_id) {
	const minRow = 5;
	const minCol = "A";
	const maxCol = "H";
  const maxRow = 59;
  return guildSpreadsheetRef.once('value')
  .then((snapshot) => {
    const spreadSheetId = snapshot.val()[guild_id];
    if (!spreadSheetId) {
      channel.send("Spreadsheet id has not been set. Set id via set_spreadsheet_id");
      throw new Error("Spreadsheet id has not been set");
    }
    return fetch(`${baseGoogleSpreadsheetUrl}${spreadSheetId}/values/Clan Overview!${minCol}${minRow}:${maxCol}${maxRow}?key=${config.googleSpreadsheetApiKey}`)
    .then((response) => response.json())
    .then((data) => {
      const newMembers = new Members();
      const membersInfo = data.values;
      membersInfo.map((memberInfo) => {
        // Checking if the id field is non-empty.
        //console.log(memberInfo[1]);
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

/**
 * Creates a new <ClanQuestMembers> from the google spreadsheet.
 */
function getClanQuestMembersInfo(channel, guild_id) {
	const minCurrentCQRow = 5;
	const minCurrentCQCol = "L"
	const maxCurrentCQRow = 59;
	const maxCurrentCQCol = "BD"

	// const minNextCQRow = 4;
	// const minNextCQCol = "AS"
	// const maxNextRow = 53;
	// const maxNextCol = "BU";
  return guildSpreadsheetRef.once('value')
  .then((snapshot) => {
    const spreadSheetId = snapshot.val()[guild_id];
    if (!spreadSheetId) {
      channel.send("Spreadsheet id has not been set. Set id via set_spreadsheet_id");
      throw new Error("Spreadsheet id has not been set");
    }
    return fetch(`${baseGoogleSpreadsheetUrl}${spreadSheetId}/values/Clan Overview!${minCurrentCQCol}${minCurrentCQRow}:${maxCurrentCQCol}${maxCurrentCQRow}?key=${config.googleSpreadsheetApiKey}`)
    .then((response) => response.json())
    .then((data) => {
      let newCQMembers = new ClanQuestMembers();
      let CQData = data.values;

      for (let i = 0; i < CQData.length; i++) {
        const CQ = CQData[i];
        if (CQ[0]) {
          const member = getClanQuestMemberInfo(CQ);
          newCQMembers.addMember(member);
        }
      }
      return newCQMembers;
    });
  })
}

/**
 * Creates a <ClanQuestMember> from an array containing member information.
 *
 * @param {Array} memberData - An array containing information about a clan quest member.
 * @return {ClanQuestMember} - A <ClanQuestMember> with all of the information.
 */
function getClanQuestMemberInfo(memberData) {
	// Convert consecutive hits into an array.
	let hits = memberData.slice(1, memberData.length);

	hits = hits.map((hit) => {
		if (!hit) {
			hit = 0;
		}
		return parseInt(hit);
	});

	const member = new ClanQuestMember(
		name=memberData[0],
		hits=hits,
		highestConsecutiveHits=getHighestConsecutiveHits(hits),
		mostDamageOnOneTitan=Math.max(...hits),
	);
	return member;
}

module.exports = {
	getMemberInfo: getMemberInfo,
	getMembersInfo: getMembersInfo,
	getClanQuestMemberInfo: getClanQuestMemberInfo,
	getClanQuestMembersInfo: getClanQuestMembersInfo
}