FROM trion/ng-cli:12.1.1

EXPOSE 3000

ENV API_PORT=3000
ENV TVDB_API_KEY=""
ENV SONARR_API_BASE_URL="https://sonarr.yourserver.local/api"
ENV SONARR_API_KEY=""
ENV SONARR_QUALITY_PROFILE_ID=3
ENV SONARR_BASE_PATH="/downloads/anime/"

USER root

WORKDIR /app
ADD . .
RUN npm ci
WORKDIR /app/animetarr-ui
RUN npm ci
RUN ng build
WORKDIR /app
CMD ["npm", "start"]
