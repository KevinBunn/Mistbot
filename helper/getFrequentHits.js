function getFrequentHits(hits) {
	return hits.filter((hit) => hit !== 0).length;
}

module.exports = getFrequentHits;