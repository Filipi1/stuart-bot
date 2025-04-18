# Specify the base image with Node.js, version 18, and Alpine Linux 3.18
FROM node:18-alpine

WORKDIR /app

# Instala o FFmpeg
RUN apk add --no-cache ffmpeg

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Cria a pasta de áudios
RUN mkdir -p /app/audios

CMD ["yarn", "start:prod"]