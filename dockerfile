FROM trion/ng-cli:14.2.3 AS build

EXPOSE 3000

ENV API_PORT=3000
ENV TVDB_API_KEY=""
ENV SONARR_API_BASE_URL="https://sonarr.yourserver.local/api"
ENV SONARR_API_KEY=""
ENV SONARR_QUALITY_PROFILE_ID=3
ENV SONARR_BASE_PATH="/downloads/anime/"

USER root

WORKDIR /build
ADD . .
RUN npm ci
RUN npm run build
WORKDIR /build/animetarr-ui
RUN npm ci
RUN npm run build

FROM node:20.12-alpine

WORKDIR /app
COPY --from=build /build/dist .
CMD ["node", "."]

