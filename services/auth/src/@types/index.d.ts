/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */

type AnyJson = boolean | number | string | null | JsonArray | JsonMap;
type JsonMap = {
  [key: string]: AnyJson;
};
type JsonArray = Array<AnyJson>;

interface JSON {
  parse(
    text: string,
    reviver?: ((this: any, key: string, value: any) => any) | undefined
  ): AnyJson;
}

interface ArrayConstructor {
  normalize<T>(
    array: T[],
    selector: (item: T) => string | number
  ): { [key: string]: T };

  groupBy<T>(
    array: T[],
    identifier: (item: T) => string | number
  ): { [key: string]: T[] };
}
