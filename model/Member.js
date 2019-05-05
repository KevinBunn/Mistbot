/**
 * A class that contains a member's information.
 */
class Member {
	constructor(id, name, weeklyRank, raidLevel, lfTickets, lfAttacks, lfDmg, lfRank, weeklyDmg, weeklyAvgHitDmg, weeklyDmgPercent) {
		this.name = name;
		this.id = id;
		this.raidLevel = raidLevel
		this.weeklyRank = parseInt(weeklyRank)
		this.weeklyDmg = parseFloat(weeklyDmg)
		this.weeklyAvgHitDmg = parseFloat(weeklyAvgHitDmg)
		this.weeklyDmgPercent = parseFloat(weeklyDmgPercent.replace("%", ""))
		this.lfRank = parseInt(lfRank)
		this.lfTickets = parseInt(lfTickets)
		this.lfAttacks = parseInt(lfAttacks)
		this.lfDmg = parseFloat(lfDmg)
	}
}

module.exports = Member;
