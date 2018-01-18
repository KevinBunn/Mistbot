/**
 * A class that contains a member's clan quest information.
 */
class ClanQuestMember {
	constructor(name, hits, totalDamage, averageDamage, maxStage, joinedDiscord, lastWeekAverage, lastWeekMS, highestConsecutiveHits, frequentHits, mostDamageOnOneTitan) {
		this.name = name;
		this.hits = hits;
		this.totalDamage = totalDamage;
		this.averageDamage = averageDamage;
		this.maxStage = maxStage;
		this.joinedDiscord = joinedDiscord;
		this.lastWeekAverage = lastWeekAverage;
		this.lastWeekMS = lastWeekMS;
		this.highestConsecutiveHits = highestConsecutiveHits;
		this.frequentHits = frequentHits;
		this.mostDamageOnOneTitan = mostDamageOnOneTitan;
	}
}

module.exports = ClanQuestMember;