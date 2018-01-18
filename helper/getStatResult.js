const getMaxAttr = require("./getMaxAttr");

function getStatResult(data, attr) {
	let highestStat = getMaxAttr(data, attr);
	let result = {
		names: [],
		stat: highestStat,
	};

	for (let i = 0; i < data.length; i++) {
		if (data[i][attr] >= highestStat) {
			result.names.push(data[i].name);
		}
	}

	return result;
}

module.exports = getStatResult;