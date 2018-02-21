require('isomorphic-fetch');
const config = require("../config/config.json");

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
function getMembersInfo() {
	const minRow = 4;
	const minCol = "B";
	const maxCol = "M";
	const maxRow = 53;

	return fetch(`${baseGoogleSpreadsheetUrl}${config.spreadSheetId}/values/Summary!${minCol}${minRow}:${maxCol}${maxRow}?key=${config.googleSpreadsheetApiKey}`)
	.then((response) => response.json())
	.then((data) => {
		const newMembers = new Members();
		const membersInfo = data.values;
		membersInfo.map((memberInfo) => {
			// Checking if the id field is non-empty.
			if (memberInfo[0]) {
				const member = getMemberInfo(memberInfo);
				newMembers.addMember(member);
			}
		});
		return newMembers;
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
function getClanQuestMembersInfo() {
	const minCurrentCQRow = 4;
	const minCurrentCQCol = "O"
	const maxCurrentCQRow = 53;
	const maxCurrentCQCol = "AQ"

	const minNextCQRow = 4;
	const minNextCQCol = "AS"
	const maxNextRow = 53;
	const maxNextCol = "BU";

	return fetch(`${baseGoogleSpreadsheetUrl}${config.spreadSheetId}/values/Summary!${minCurrentCQCol}${minCurrentCQRow}:${maxCurrentCQCol}${maxCurrentCQRow}?key=${config.googleSpreadsheetApiKey}`)
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