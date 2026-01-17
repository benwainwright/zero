export type ITryHandleRequestResponse<TResponse> =
  | {
      handled: true;
      response: TResponse;
    }
  | {
      handled: false;
    };
