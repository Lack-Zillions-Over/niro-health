ARG NODE_VERSION=18-alpine

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY . .

RUN yarn add @nestjs/cli

RUN yarn install

RUN yarn build

EXPOSE ${PORT}

CMD ["sh", "-c", "yarn start:prod"]
