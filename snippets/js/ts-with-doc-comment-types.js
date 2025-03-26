/**
 * @template T
 * @param {T[]} list 
 * @param {T} newItem 
 * @returns {T[]} 
 */
function appendToList(list, newItem) {
  return [...list, newItem];
}

appendToList([1, 2, 3], 4);