/**
 * Splits strings by spaces unless inside quotes, using regex pattern
 *
 * @param {string} content - the string to be split
 */
function splitString(content) {
	var myRegexp = /[^\s"]+|"([^"]*)"/gi;
	var strArray = [];

	do {
    	//Each call to exec returns the next regex match as an array
    	var match = myRegexp.exec(content);
    	if (match != null)
    	{
        	//Index 1 in the array is the captured group if it exists
        	//Index 0 is the matched text, which we use if no captured group exists
        	strArray.push(match[1] ? match[1] : match[0]);
    	}
	} while (match != null);

	return strArray;
}

module.exports = splitString;