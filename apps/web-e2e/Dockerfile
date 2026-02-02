FROM node:24-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

# Build-time selection of config file
ARG CONFIG=zero.config.dev.json

# Copy the chosen config into a stable path
COPY ${CONFIG} /app/config.json

COPY dist/* /app
COPY railway.json /railway.json

# Conditionally add --logger json for production or staging
CMD sh -c '\
    if [ "$NODE_ENV" = "production" ] || [ "$NODE_ENV" = "staging" ]; then \
    exec node cli.js start --config config.json --logger json; \
    else \
    exec node cli.js start --config config.json; \
    fi'
