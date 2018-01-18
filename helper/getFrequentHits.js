function getFrequentHits(hits, maxNumberOfHits) {
	return (hits.filter((hit) => hit !== 0).length / maxNumberOfHits).toFixed(2)*100;
}

module.exports = getFrequentHits;