/**
 * Gets the days, hours, minutes, and seconds representation of the time difference.
 * Stackoverflow Reference: https://stackoverflow.com/questions/13903897/javascript-return-number-of-days-hours-minutes-seconds-between-two-dates.
 *
 * @param {Date} date1 - first date.
 * @param {Date} date2 - second date.
 *
 * @return {Object} - an object containing the days, hours, minutes, and seconds.
 */
function getTimeDifference(date1, date2) {
	// get total seconds between the times
	let delta = Math.abs(date1 - date2) / 1000;

	// calculate (and subtract) whole days
	const days = Math.floor(delta / 86400);
	delta -= days * 86400;

	// calculate (and subtract) whole hours
	const hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;

	// calculate (and subtract) whole minutes
	const minutes = Math.floor(delta / 60) % 60;
	delta -= minutes * 60;

	// what's left is seconds
	const seconds = Math.floor(delta % 60);  // in theory the modulus is not required

	return {
		days: days,
		hours: hours,
		minutes: minutes,
		seconds: seconds,
	}
}

module.exports = getTimeDifference;