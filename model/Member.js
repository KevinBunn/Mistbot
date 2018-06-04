/**
 * A class that contains a member's information.
 */
class Member {
	constructor(rank, name, id, maxStage, totalDamage, damagePercent, bossHitCount, CQParticipation) {
		this.damageRank = parseInt(rank);
		this.name = name;
		this.id = id;
		this.maxStage = parseInt(maxStage);
		this.totalDamage = parseFloat(totalDamage);
		this.damagePercent = parseFloat(damagePercent);
		this.bossHitCount = parseInt(bossHitCount);
		this.CQParticipation = parseFloat(CQParticipation);
		//this.totalDamage = parseInt(totalDamage.replace(/,/g,""));
		// this.lastWeekTotalDamage = parseInt(lastWeekTotalDamage),
		// this.damageMargin = parseInt(damageMargin.replace("%", ""))
	}
}

module.exports = Member;