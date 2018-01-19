/**
 * Splits strings by a given character
 *
 * @param {string} content - the string to be split
 * @param {char} separator - the character we want to separate the string by
 */
function splitString(content, separator) {
	var strArray = content.split(separator);
	return strArray;
}

module.exports = splitString;