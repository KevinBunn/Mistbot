/**
 * A class that contains a member's clan quest information.
 */
class ClanQuestMember {
	constructor(name, hits, highestConsecutiveHits, mostDamageOnOneTitan) {
		this.name = name;
		this.highestConsecutiveHits = parseInt(highestConsecutiveHits);
		this.mostDamageOnOneTitan = parseInt(mostDamageOnOneTitan);
	}
}

module.exports = ClanQuestMember;