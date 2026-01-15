import { setupServer } from 'msw/node';
import { handlers as goCardlessHandlers } from './handlers/gocardless/handlers.ts';

export const server = setupServer(...goCardlessHandlers);
