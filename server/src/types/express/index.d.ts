/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace Express {
  interface Request {
    locals?: {
      queryParsedData?: any;
      bodyParsedData?: any;
      paramsParsedData?: any;
      [key: localsFields]: any;
    };
  }
}

//TODO: improve this definition
