function flatten(arr) {
	return [].concat.apply([], arr.values);
}

module.exports = flatten;