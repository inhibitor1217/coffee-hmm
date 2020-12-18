Array.normalize = <T>(array: T[], selector: (item: T) => string | number) => {
  const object: { [key: string]: T } = {};
  array.forEach((item) => {
    object[selector(item)] = item;
  });
  return object;
};

Array.groupBy = <T>(array: T[], identifier: (item: T) => string | number) => {
  const object: { [key: string]: T[] } = {};
  array.forEach((item) => {
    const id = identifier(item);
    if (!object[id]) {
      object[id] = [];
    }
    object[id].push(item);
  });
  return object;
};

Object.filterUndefinedKeys = (object: {
  [key: string]: AnyJson | undefined;
}) => {
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
