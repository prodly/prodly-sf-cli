export type SaveResult =
  | {
      success: true;
      id: string;
      errors: never[];
    }
  | {
      success: false;
      id?: undefined;
      errors: SaveError[];
    };

export type SaveError = {
  errorCode: string;
  message: string;
  fields?: string[];
};
