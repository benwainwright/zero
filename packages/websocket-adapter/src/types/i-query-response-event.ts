export interface IRequestResponseEvent {
  RequestResponseEvent: {
    key: string;
    id: string;
    data: unknown;
  };
  RequestFailedEvent: {
    key: string;
    id: string;
  };
}
