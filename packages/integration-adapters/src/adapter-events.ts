import type { LiteralUnion } from 'type-fest';

export interface StackFrame {
  file: string | null;
  methodName: LiteralUnion<'<unknown>', string>;
  arguments: string[];
  lineNumber: number | null;
  column: number | null;
}
export interface IntegrationEvents {
  HttpError: {
    time: Date;
    statusCode: number;
    body: string;
    requestId: string;
    parsedStack: StackFrame[];
  };
  HttpGetRequest: {
    time: Date;
    method: 'get';
    url: string;
    requestId: string;
    headers: HeadersInit | undefined;
  };

  HttpPostRequest: {
    time: Date;
    method: 'post';
    requestId: string;
    url: string;
    headers?: HeadersInit | undefined;
    body: BodyInit | undefined | null;
  };

  HttpCachedResponse: {
    time: Date;
    body: unknown;
    requestId: string;
  };

  HttpResponse: {
    time: Date;
    requestId: string;
    headers?: HeadersInit;
    body: unknown;
    statusCode: number;
  };
}
