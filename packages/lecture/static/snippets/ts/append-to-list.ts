function appendToList<T>(list: T[], newItem: T): T[] {
  return [...list, newItem];
}

appendToList([1, 2, 3], 4);
