const getMaxAttr = require("../helper/getMaxAttr");
const getStatResult = require("../helper/getStatResult");

/**
 * A class that contains an array of <ClanQuestMember> and functions
 * to calculate weekly stats information.
 */
class ClanQuestMembers {
	constructor() {
		this.members = [];
	}

	addMember(member) {
		this.members.push(member);
	}

	getSleepless() {
		return getStatResult(this.members, "highestConsecutiveHits");
	}

	getThug() {
		return getStatResult(this.members, "mostDamageOnOneTitan");
	}

	findByName(nickname) {
		for (let i = 0; i < this.members.length; i++) {
			if (this.members[i].name === nickname)
				return this.members[i];
		}
		return null;
	}
}

module.exports = ClanQuestMembers;