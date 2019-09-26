/**
 * A class that contains a member's information.
 */
class Member {
	constructor(id, name, weeklyRank, raidLevel, raidCardLevel,
							tickets, maxStage, skillPoints, petLevels, craftingShards, tournamentPoints, role,
							weeklyDmg, weeklyAvgHit, avgHitLW,
							maxStageLW, skillPointsLW, petLevelsLW, ticketsLW, raidLevelLW, tournamentPointsLW) {
    this.id = id
		this.name = name
    this.weeklyRank = parseInt(weeklyRank)
		this.raidLevel = parseInt(raidLevel)
		this.raidCardLevel = parseInt(raidCardLevel)
		this.tickets = parseInt(tickets)
		this.maxStage = parseInt(maxStage)
		this.skillPoints = parseInt(skillPoints)
    this.petLevels = parseInt(petLevels)
		this.craftingShards = parseInt(craftingShards)
    this.tournamentPoints = parseInt(tournamentPoints)
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
		this.weeklyDmg = parseInt(weeklyDmg)
		this.weeklyAvgHit = parseFloat(weeklyAvgHit)
    this.avgHitLW = parseFloat(avgHitLW)
		this.maxStageLW = parseInt(maxStageLW)
		this.ticketsLW = parseInt(ticketsLW)
		this.raidLevelLW = parseInt(raidLevelLW)
		this.petLevelsLW = parseInt(petLevelsLW)
    this.skillPointsLW = parseInt(skillPointsLW)
    this.tournamentPointsLW = parseInt(tournamentPointsLW)
	}
}

module.exports = Member;
