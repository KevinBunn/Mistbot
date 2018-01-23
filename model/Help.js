/**
 * A class that contains definitions for the various help options
 */
class Help {

	constructor() {
		this.commandHelp = {
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
			"Miscellaneous": [
				{
					title: "just_do_it",
					description: "\tDisplays the just do it gif."
				}
			]
		};
	}

	getObjStatistics() {
		return this.commandHelp.Statistics;
	}

	getObjTournament() {
		return this.commandHelp.Tournament;
	}

	getObjMiscellaneous() {
		return this.commandHelp.Miscellaneous;
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