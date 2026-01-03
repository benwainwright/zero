FROM node:24-alpine AS server

WORKDIR /app
ENV NODE_ENV=production

COPY dist/server/start.js ./dist/server/start.js

ENV WS_PORT=3001
EXPOSE 3001

# If your app reads PORT instead of WS_PORT, set PORT in compose.
CMD ["node", "dist/server/start.js"]


############################
# Client target (static frontend)
############################
FROM nginx:1.27-alpine AS client

# Copy built static files into nginx html directory
COPY dist/web /usr/share/nginx/html

# Optional: if you're doing SPA routing, uncomment this:
# (and add a matching nginx config file)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
