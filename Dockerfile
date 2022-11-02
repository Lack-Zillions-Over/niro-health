FROM node:16-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn build

EXPOSE ${PORT}

CMD [ "sh", "-c", "yarn start:prod"]
