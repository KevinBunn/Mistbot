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
					title: "mystats",
					description: "\tDisplays your clan stats."
				},
				{
					title: "stats",
					description: "\tDisplays clan stats of another member."
				},
				// {
				// 	title: "topDamage",
				// 	description: "\tDisplays the top [number] members with the most total damage.",
				// 	postfix: "[number]"
				// },
				// {
				// 	title: "topParticipation",
				// 	description: "\tDisplays the top [number] members with the most CQ participation.",
				// 	postfix: "[number]"
				// }
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

    getSetupCommandList() {
        var commands = "";
        for (let i = 0; i < this.commandHelp.Setup.length; i++) {
            commands += (this.commandHelp.Setup[i].title + ", ");
        }
        commands = commands.replace(/,\s*$/, "");
        return commands;
    }

	getStatisticsCommandList() {
		var commands = "";
		for (let i = 0; i < this.commandHelp.Statistics.length; i++) {
			commands += (this.commandHelp.Statistics[i].title + ", ");
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

	getTimerCommandList() {
		var commands = "";
		for (let i = 0; i < this.commandHelp.Timer.length; i++) {
			commands += (this.commandHelp.Timer[i].title + ", ");
		}
		commands = commands.replace(/,\s*$/, "");
		return commands;
	}

	getMiscellaneousCommandList() {
		var commands = "";
		for (let i = 0; i < this.commandHelp.Miscellaneous.length; i++) {
			commands += (this.commandHelp.Miscellaneous[i].title + ", ");
		}
		commands = commands.replace(/,\s*$/, "");
		return commands;
	}
}

module.exports = Help;
