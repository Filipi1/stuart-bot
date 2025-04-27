FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache ffmpeg

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build && mkdir -p /app/audios

CMD ["yarn", "start:prod"]