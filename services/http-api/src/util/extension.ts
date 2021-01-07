Array.normalize = <T>(array: T[], selector: (item: T) => string | number) => {
  const object: { [key: string]: T } = {};
  array.forEach((item) => {
    object[selector(item)] = item;
  });
  return object;
};
