export interface Reducer<T, C, R> {
  readonly supply: () => C;
  readonly incorporate: (container: C, newItem: T) => C;
  readonly finish: (container: C) => R;
}

const toSetReducer: Reducer<unknown, Set<unknown>, Set<unknown>> = {
  supply: () => new Set<unknown>(),
  incorporate: (items, newItem) => {
    items.add(newItem);
    return items;
  },
  finish: (items) => items,
};

export function toSet<T>(): Reducer<T, Set<T>, Set<T>> {
  return toSetReducer as Reducer<T, Set<T>, Set<T>>;
}

export function* protoChain(object: unknown): Iterable<unknown> {
  if (object === null || typeof object !== "object") {
    return;
  }
  let current = Object.getPrototypeOf(object);
  while (current) {
    yield current;
    current = Object.getPrototypeOf(current);
  }
}

export function reduce<T, C, R>(
  items: Iterable<T>,
  reducer: Reducer<T, C, R>,
): R {
  const container = reducer.supply();
  for (const item of items) {
    reducer.incorporate(container, item);
  }
  return reducer.finish(container);
}

export function* map<T, R>(
  items: Iterable<T>,
  fn: (item: T) => R,
): Iterable<R> {
  for (const item of items) {
    yield fn(item);
  }
}

export function some<T>(
  items: Iterable<T>,
  test: (item: T) => boolean,
): boolean {
  for (const item of items) {
    if (test(item)) {
      return true;
    }
  }
  return false;
}

export function getConstructorName(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value.constructor?.name ?? "")
    : "";
}

export function equalTo(target: unknown): (value: unknown) => boolean {
  return (value) => value === target;
}

export function isPromise(value: unknown): value is Promise<unknown> {
  if (value instanceof Promise) {
    return true;
  }
  return some(map(protoChain(value), getConstructorName), equalTo("Promise"));
}

export function getConstructorNames(value: unknown): Set<string> {
  return reduce(map(protoChain(value), getConstructorName), toSet());
}
