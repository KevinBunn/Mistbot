const getMaxAttr = require("../helper/getMaxAttr");
const getStatResult = require("../helper/getStatResult");

/**
 * A class that contains an array of <Member> and functions
 * to calculate weekly stats information.
 */
class Members {
	constructor() {
		this.members = [];
	}

	addMember(member) {
		this.members.push(member);
	}

	getInspired() {
		return getStatResult(this.members, 'averageMargin');
	}

	getCoinShot() {
		return getStatResult(this.members, 'increase');
	}

	findByName(nickname) {
		for (let i = 0; i < this.members.length; i++) {
			if (this.members[i].name === nickname)
				return this.members[i];
		}
		return null;
	}
}

module.exports = Members;