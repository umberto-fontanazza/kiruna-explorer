declare namespace Express {
  interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locals?: { [key: string]: any };
  }
}
