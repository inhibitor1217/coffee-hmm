Array.normalize = <T>(array: T[], selector: (item: T) => string | number) => {
  const object: { [key: string]: T } = {};
  array.forEach((item) => {
    object[selector(item)] = item;
  });
  return object;
};

Object.filterUndefinedKeys = (object: {
  [key: string]: AnyJson | undefined;
}): JsonMap => {
  const filtered: JsonMap = {};
  Object.keys(object).forEach((key) => {
    const value = object[key];
    if (value === undefined) {
      return;
    }
    filtered[key] = value;
  });
  return filtered;
};

Promise.chain = <T>(promises: ((value: T) => Promise<T>)[], initialValue: T) =>
  promises.reduce(
    (prev, cur) => prev.then((value) => cur(value)),
    Promise.resolve(initialValue)
  );
