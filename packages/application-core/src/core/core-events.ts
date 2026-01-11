export interface ICoreEvents {
  CommandHandleStartEvent: {
    key: string;
    id: string;
  };
  CommandHandleCompleteEvent: {
    key: string;
    id: string;
  };
  QueryHandleStartEvent: {
    key: string;
    id: string;
  };
  QueryHandleCompleteEvent: {
    key: string;
    id: string;
  };
}
