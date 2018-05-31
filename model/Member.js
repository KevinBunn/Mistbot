/**
 * A class that contains a member's information.
 */
class Member {
	constructor(id, name, clanRank, damageRank, damagePercent, CQParticipation, totalDamage) {
		this.id = id;
		this.name = name;
		this.clanRank = parseInt(clanRank);
		this.damageRank = parseInt(damageRank);
		this.damagePercent = parseFloat(damagePercent);
		this.CQParticipation = parseFloat(CQParticipation);
		this.totalDamage = parseInt(totalDamage.replace(/,/g,""));
		// this.lastWeekTotalDamage = parseInt(lastWeekTotalDamage),
		// this.damageMargin = parseInt(damageMargin.replace("%", ""))
	}
}

module.exports = Member;