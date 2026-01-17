export interface ICoreEvents {
  CommandHandleStartEvent: {
    key: string;
    id: string;
  };
  CommandHandleCompleteEvent: {
    key: string;
    id: string;
  };
  RequestHandleStartEvent: {
    key: string;
    id: string;
  };
  RequestHandleCompleteEvent: {
    key: string;
    id: string;
  };
}
