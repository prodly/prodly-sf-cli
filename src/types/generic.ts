type JSONValue = string | number | boolean | JSONObject;

export type JSONObject = {
  [x: string]: JSONValue;
};
