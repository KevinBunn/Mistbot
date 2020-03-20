const getStatResult = require("../helper/getStatResult");
const _ = require('lodash')

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

	getHitman() {
		return getStatResult(this.members, "CQParticipation")
	}

	//returns names and max stages of players sorted in descending order.
	getSortedRankings(stat) {
		let names = [];
		let sortedStat = [];
		//use concat to get a shadow copy of the members list.
		let sorted  = this.members.concat().sort((a,b) => a[stat] < b[stat] ? 1 : -1);
		for (let i = 0; i < this.members.length; i++) {
			if (sorted[i].name !== undefined) {
				names.push(sorted[i].name);
				sortedStat.push(sorted[i][stat]);
			}
		}
		return [names, sortedStat];
	}


	//TODO: CMERGE: add clan tags for multiple clans.
	findByName(nickname, clanTag) {
		for (let i = 0; i < this.members.length; i++) {
			if (this.members[i].name !== undefined) {
        if (this.members[i].name.includes(clanTag)) {
        	// we can just replace it with the built in string function, trim it in case of space after tag.
          let nameWithoutClantag = this.members[i].name.replace(clanTag, '').trim()
          this.members[i].name = nameWithoutClantag
        }
				if (this.members[i].name.toLowerCase() === nickname.toLowerCase()) {
          return this.members[i];
        }
			}
		}
		return null;
	}

	getTopIncreasedByStat(statName) {
		// Separate those that have no last week value or '0'
		let membersThatHaveLWValues = _.partition(this.members, function(o) {
			return o[`${statName}LW`] !== 0
		})
		// Find the max increase
		let topMember = _.maxBy(membersThatHaveLWValues[0], function(o) {
			return (o[`${statName}`] - o[`${statName}LW`])
		})
		// get the max value
		let maxValue = (topMember[`${statName}`] - topMember[`${statName}LW`])
		// check if any others are equal to max
		let topMembers = _.filter(membersThatHaveLWValues[0], function(o) {
			return (o[`${statName}`] - o[`${statName}LW`]) === maxValue
		})
		// we'll need to return a string of names
		let topMembersNameString = []
		topMembers.forEach(member => {
			topMembersNameString.push(` ${member.name}`)
		})
		// return the names along with the value
		return [topMembersNameString, maxValue]
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
