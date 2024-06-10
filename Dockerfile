# Specify the base image with Node.js, version 18, and Alpine Linux 3.18
FROM node:18-alpine3.18

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node . .

RUN yarn

RUN yarn build

ENV NODE_ENV=prod
CMD ["yarn", "start:prod"]