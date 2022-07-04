FROM node:lts-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 4000

CMD [ "sh", "-c", "yarn start:debug"]
