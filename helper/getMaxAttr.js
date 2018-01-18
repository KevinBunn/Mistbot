function getMaxAttr(arr, attr) {
	return Math.max(...arr.map((el) => el[attr]));
}

module.exports = getMaxAttr;