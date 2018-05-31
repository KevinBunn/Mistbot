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

	// getInspired() {
	// 	return getStatResult(this.members, "damageMargin");
	// }

	// getCoinShot() {
	// 	return getStatResult(this.members, "MSIncrease");
	// }

	// getDelibird() {
	// 	return getStatResult(this.members, "clanCratesShared")
	// }

	getHitman() {
		return getStatResult(this.members, "CQParticipation")
	}

	findByName(nickname) {
		for (let i = 0; i < this.members.length; i++) {
			if (this.members[i].name.toLowerCase() === nickname.toLowerCase())
				return this.members[i];
		}
		return null;
	}

	getTopDamage(size) {
		let sortedMembers = this.members.slice().sort((member1, member2) => {
			return member2.totalDamage - member1.totalDamage;
		});
		return sortedMembers.slice(0, size)
	}

	getTopParticipation(size) {
		let sortedMembers = this.members.slice().sort((member1, member2) => {
			return member2.CQParticipation - member1.CQParticipation;
		});
		return sortedMembers.slice(0, size)
	}
}

module.exports = Members;