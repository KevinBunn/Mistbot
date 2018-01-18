/**
 * A class that contains a member's information.
 */
class Member {
	constructor(rank, name, total, averageDamage, lastWeekAverage, averageMargin, MS, MSLastWeek, increase, joinedDiscord) {
		this.rank = rank;
		this.name = name;
		this.total = total;
		this.averageDamage = averageDamage;
		this.lastWeekAverage = lastWeekAverage;
		this.averageMargin = averageMargin;
		this.MS = MS;
		this.MSLastWeek = MSLastWeek;
		this.increase = increase;
		this.joinedDiscord = joinedDiscord;
	}
}

module.exports = Member;