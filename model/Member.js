/**
 * A class that contains a member's information.
 */
class Member {
	constructor(id, name, lastWeekMS, MS, lastWeekCQHits, CQHits, clanCratesShared, MSIncrease, CQParticipation, totalDamage, lastWeekTotalDamage, damageMargin) {
		this.id = id;
		this.name = name;
		this.lastWeekMS = parseInt(lastWeekMS);
		this.MS = parseInt(MS);
		this.CQHits = parseInt(CQHits);
		this.clanCratesShared = parseInt(clanCratesShared);
		this.MSIncrease = parseInt(MSIncrease);
		this.CQParticipation = parseInt(CQParticipation.replace("%", "")),
		this.totalDamage = parseInt(totalDamage),
		this.lastWeekTotalDamage = parseInt(lastWeekTotalDamage),
		this.damageMargin = parseInt(damageMargin.replace("%", ""))
	}
}

module.exports = Member;