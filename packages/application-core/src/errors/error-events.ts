export interface IErrorEvents {
  ApplicationError: {
    stack: {
      file: string;
      callee: string;
    }[];
    message: string;
  };
}
