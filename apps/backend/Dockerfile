FROM node:24-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

# Build-time selection of config file
ARG CONFIG=zero.config.dev.json

# Copy the prebuilt CLI
COPY dist/cli.js /app/cli.js

# Copy the chosen config into a stable path
COPY ${CONFIG} /app/config.json

# Run the CLI with the baked config
CMD ["node", "cli.js", "start" "--config", "/app/config.json"]
