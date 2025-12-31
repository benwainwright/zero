export type ITryHandleQueryResponse<TResponse> =
  | {
      handled: true;
      response: TResponse;
    }
  | {
      handled: false;
    };
