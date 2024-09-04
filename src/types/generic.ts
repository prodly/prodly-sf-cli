type JSONValue = string | number | boolean | JSONObject | JSONValue[];

export type JSONObject = {
  [x: string]: JSONValue;
};
