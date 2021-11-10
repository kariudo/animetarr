FROM trion/ng-cli:12.1.1 as build

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
RUN npm run-script build
WORKDIR /build/animetarr-ui
RUN npm ci
RUN npm run-script build

FROM node:14.17-alpine

WORKDIR /app
COPY --from=build /build/dist .
COPY --from=build /build/.env.example .
CMD ["node", "."]
