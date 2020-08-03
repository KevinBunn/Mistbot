/**
 * A class that contains definitions for the various help options
 */
class Help {

	constructor() { 
		this.commandHelp = {
			"Setup": [
				{
					title: "setspreadsheet",
					description: "Sets the spreadsheet id where the bot will read statistics from."
				}
			],
			"Statistics": [
				{
					title: "stats",
					description: "\tDisplays clan stats for you or another member.",
					postfix: "@[clan member]"
				},
			],
			"Miscellaneous": [
				{
					title: "justdoit",
					description: "\tDisplays the just do it gif."
				},
				{
					title: "thinking",
					description: "\tDisplays the thinking gif."
				}
			],
			"Raid": [
				{
					title: "start",
					description: "\tStart the timer. (during raid prep)",
          postfix: "[hh:mm:ss]"
				},
				{
					title: "update",
					description: "\tUpdate current timer or start timer mid raid.",
          postfix: "[hh:mm:ss] [cycle]"
				},
				{
					title: "end",
					description: "\tStop the current timer."
				}
			],
			"Applicants": [
				{
          title: "apply",
          description: "\tAdd yourself to the clan waitlist",
					postfix: "[max stage] [raid level]"
				},
				{
          title: "applicants",
          description: "\tSee the current waitlist",
				},
				{
					title: "removeapplicant",
					description: "\tRemove someone from the wait list",
					postfix: "[applicant name]"
				}
			],
			"Tournament": [
				{
					title: "list",
					description: "\tSee the list of upcoming tournaments",
				},
				{
					title: "reminders",
					description: "\tJoin the channel of tournament reminder information",
				}
			]
		};
	}

	getObjSetup() {
		return this.commandHelp.Setup;
	}

	getObjStatistics() {
		return this.commandHelp.Statistics;
	}

	getObjMiscellaneous() {
		return this.commandHelp.Miscellaneous;
	}

	getObjRaid() {
		return this.commandHelp.Raid;
	}

	getObjApplicants() {
		return this.commandHelp.Applicants;
	}

  getObjTournament() {
    return this.commandHelp.Tournament;
  }

	getSetupCommandList() {
		let commands = "";
		for (let i = 0; i < this.commandHelp.Setup.length; i++) {
				commands += (this.commandHelp.Setup[i].title + ", ");
		}
		commands = commands.replace(/,\s*$/, "");
		return commands;
	}

	getStatisticsCommandList() {
		let commands = "";
		for (let i = 0; i < this.commandHelp.Statistics.length; i++) {
			commands += (this.commandHelp.Statistics[i].title + ", ");
		}
		commands = commands.replace(/,\s*$/, "");
		return commands;
	}

	getRaidCommandList() {
		let commands = "";
		for (let i = 0; i < this.commandHelp.Raid.length; i++) {
			commands += (this.commandHelp.Raid[i].title + ", ");
		}
		commands = commands.replace(/,\s*$/, "");
		return commands;
	}

	getMiscellaneousCommandList() {
		let commands = "";
		for (let i = 0; i < this.commandHelp.Miscellaneous.length; i++) {
			commands += (this.commandHelp.Miscellaneous[i].title + ", ");
		}
		commands = commands.replace(/,\s*$/, "");
		return commands;
	}

  getApplicantsCommandList() {
    let commands = "";
    for (let i = 0; i < this.commandHelp.Applicants.length; i++) {
      commands += (this.commandHelp.Applicants[i].title + ", ");
    }
    commands = commands.replace(/,\s*$/, "");
    return commands;
  }

  getTournamentCommandList() {
    var commands = "";
    for (let i = 0; i < this.commandHelp.Tournament.length; i++) {
      commands += (this.commandHelp.Tournament[i].title + ", ");
    }
    commands = commands.replace(/,\s*$/, "");
    return commands;
  }
}

module.exports = Help;
