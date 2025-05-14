// @ts-check

/**
 * Computes the set difference a \ b.
 * @param {Set<string>} a First set.
 * @param {Set<string>} b Second set.
 * @returns {Set<string>} b The difference a \ b.
 */
export function setDiff(a, b) {
	const diff = new Set(a);
	for (const x of b) {
		diff.delete(x);
	}
	return diff;
}

/**
 * Computes the set intersection a ^ b.
 * @param {Set<string>} a First set.
 * @param {Set<string>} b Second set.
 * @returns {Set<string>} b The intersection a ^ b.
 */
export function setIntersect(a, b) {
	const intersect = new Set();
	for (const x of a) {
		if (b.has(x)) {
			intersect.add(x);
		}
	}
	return intersect;
}
