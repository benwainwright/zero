import { useEvents } from '@hooks';
import type { IKnownEvents } from '@zero/websocket-adapter/client';
import { useState } from 'react';

export interface RequestRecord {
  request: IKnownEvents['HttpGetRequest'] | IKnownEvents['HttpPostRequest'];
  response?:
    | IKnownEvents['HttpError']
    | IKnownEvents['HttpResponse']
    | IKnownEvents['HttpCachedResponse'];
}

export const useHttpRequests = () => {
  const [requests, setRequests] = useState<RequestRecord[]>([]);

  useEvents((data) => {
    if (data.key === 'HttpGetRequest' || data.key === 'HttpPostRequest') {
      console.log('FOUND REQ');
      setRequests((oldRequests) => [...oldRequests, { request: data.data }]);
    }
    if (
      data.key === 'HttpError' ||
      data.key === 'HttpCachedResponse' ||
      data.key === 'HttpResponse'
    ) {
      console.log('FOUND RES');
      setRequests((oldRequests) => {
        const newRequests = [...oldRequests];
        const theRequest = newRequests.find(
          (item) => item.request.requestId === data.data.requestId
        );

        if (theRequest) {
          theRequest.response = data.data;
        }

        return newRequests;
      });
    }
  });

  console.log({ requests });

  return requests;
};
