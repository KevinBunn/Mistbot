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

	findByName(nickname) {

		for (let i = 0; i < this.members.length; i++) {
			if (this.members[i].name !== undefined) {
        if (this.members[i].name.includes('<MST>')) {
          let split1 = this.members[i].name.split('>')
          let nameWithoutClantag = split1[1].trim()
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
