function getHighestConsecutiveHits(hits) {
	let highestConsecutiveHits = 0;
	let currentConsecutiveHits = 0;
	for (let i = 0; i < hits.length; i++) {
		if (hits[i] !== 0) {
			currentConsecutiveHits++;
		} else {
			currentConsecutiveHits = 0;
		}

		if (currentConsecutiveHits > highestConsecutiveHits) {
			highestConsecutiveHits = currentConsecutiveHits;
		}
	}
	return highestConsecutiveHits;
}

module.exports = getHighestConsecutiveHits;