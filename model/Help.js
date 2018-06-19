/**
 * A class that contains definitions for the various help options
 */
class Help {

	constructor() {
		this.commandHelp = {
			"SetUp": [
				{
					title: "set_spreadsheet_id",
					description: "\tSets the spreadsheet id where the bot will read statistics from."
				}
			],
			"Statistics": [
				{
					title: "weekly_stats",
					description: "\tDisplays current clan accolades for the week."
				},
				{
					title: "my_stats",
					description: "\tDisplays your clan stats."
				},
				{
					title: "stats",
					description: "\tDisplays clan stats of another member."
				},
				{
					title: "top_damage",
					description: "\tDisplays the top [number] members with the most total damage.",
					postfix: "[number]"
				},
				{
					title: "top_participation",
					description: "\tDisplays the top [number] members with the most CQ participation.",
					postfix: "[number]"
				}
			],
			"Tournament": [
				{
					title: "curr_tour",
					description: "\tDisplays current tournament that is going on."
				},
				{
					title: "next_tour",
					description: "\tDisplays when and what the next tournament is."
				}
			],
			"Timer": [
				{
					title: "set_tl_timer",
					description: "\tSets an timer for the next Titan Lord. Requires an up-to-date spreadsheet."
				},
				{
					title: "tl_timer",
					description: "\tGet time until next Titan Lord if a timer has been set."
				}
			],
			"Miscellaneous": [
				{
					title: "just_do_it",
					description: "\tDisplays the just do it gif."
				},
				{
					title: "thinking",
					description: "\tDisplays the thinking gif."
				}
			]
		};
	}

	getObjSetUp() {
		return this.commandHelp.SetUp;
	}
	getObjStatistics() {
		return this.commandHelp.Statistics;
	}

	getObjTournament() {
		return this.commandHelp.Tournament;
	}

	getObjTimer() {
		return this.commandHelp.Timer;
	}

	getObjMiscellaneous() {
		return this.commandHelp.Miscellaneous;
	}

	getSetUpCommandList() {
		var commands = "";
        for (let i = 0; i < this.commandHelp.SetUp.length; i++) {
            commands += (this.commandHelp.SetUp[i].title + ", ");
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