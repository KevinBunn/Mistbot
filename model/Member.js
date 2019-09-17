/**
 * A class that contains a member's information.
 */
class Member {
	constructor(id, name, weeklyRank, raidLevel, raidCardLevel,
							tickets, maxStage, skillPoints, petLevels, craftingShards, heroMasteries, role,
							weeklyDmg, weeklyAvgHit, lastWeekDmg, lastWeekAvgHit,
							lastWeekMaxStage, lastWeekTickets, lastWeekRaidLevel, lastWeekPetLevels) {
    this.id = id
		this.name = name
    this.weeklyRank = parseInt(weeklyRank)
		this.raidLevel = parseInt(raidLevel)
		this.raidCardLevel = parseInt(raidCardLevel)
		this.tickets = parseInt(tickets)
		this.maxStage = parseInt(maxStage)
		this.skillPoints = parseInt(skillPoints)
		this.craftingShards = parseInt(craftingShards)
		this.heroMasteries = parseInt(heroMasteries)
		switch (role) {
      case 'Leader':
        this.role = 'Grand Master'
        break
      case 'CoLeaderAdmin':
        this.role = 'Master'
        break
      case 'CoLeader':
        this.role = 'Captain'
        break
      case 'Elder':
        this.role = 'Knight'
        break
      case 'Member':
        this.role = 'Recruit'
        break
      default:
        break
    }
		this.weeklyDmg = parseFloat(weeklyDmg)
		this.weeklyAvgHit = parseFloat(weeklyAvgHit)
    this.lastWeekDmg = parseFloat(lastWeekDmg)
    this.lastWeekAvgHit = parseFloat(lastWeekAvgHit)
		this.lastWeekMaxStage = parseFloat(lastWeekMaxStage)
		this.lastWeekTickets = parseFloat(lastWeekTickets)
		this.lastWeekRaidLevel = parseFloat(lastWeekRaidLevel)
		this.lastWeekPetLevels = parseFloat(lastWeekPetLevels)
	}
}

module.exports = Member;
