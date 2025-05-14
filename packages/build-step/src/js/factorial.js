// @ts-check

/**
 * Computes the factorial of the given number.
 * @param {bigint} x A number.
 * @returns {bigint} The factorial.
 */
export function factorial(x) {
	return x > 1n ? x * factorial(x - 1n) : 1n;
}
