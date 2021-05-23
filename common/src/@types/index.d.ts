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
