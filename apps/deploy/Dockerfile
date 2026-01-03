FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY ./dist/server /server
WORKDIR /server

CMD [ "node", "server/start.js" ]
